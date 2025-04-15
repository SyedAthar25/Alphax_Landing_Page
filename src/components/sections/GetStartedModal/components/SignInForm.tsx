import { EMAIL_PATTERN } from "@constants/index";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { rootStore } from "@store/index";
import React, { useState } from "react";
import Loader from "@components/common/Loader";
import { cn } from "@utils/index";

type Props = {
  toggleSignUp: () => void;
  loginSuccess: boolean;
  setLoginSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignInForm = ({ toggleSignUp, loginSuccess, setLoginSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const clientLogin = rootStore(({ handleClientLogin }) => handleClientLogin);
  const [logging, setLogging] = useState(false);

  const onSubmit = async (data: { email: string; password: string }) => {
    console.log("🔐 Attempting login with:", data);
    setLogging(true);

    try {
      // Step 1: Clear previous session
      localStorage.removeItem("sid");
      console.log("🧹 Cleared localStorage token");

      await fetch("https://test.neotechis.com/api/method/logout", {
        method: "GET",
        credentials: "include",
      });
      console.log("🔄 Forced logout of any existing session");

      // Step 2: Login
      const loginRes = await fetch("https://test.neotechis.com/api/method/alphax_erp.api.login.login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      console.log("📥 Login response status:", loginRes.status);

      if (!loginRes.ok) {
        const err = await loginRes.json();
        console.error("❌ Login failed:", err);

        const messages = JSON.parse(err._server_messages || "[]");
        const errorMsg = messages.length ? messages[0] : err.message || "Login failed";
        throw new Error(errorMsg);
      }

      const result = await loginRes.json();
      console.log("✅ Login successful, response:", result);

      const { token, user, url } = result?.message || {};

      if (!token || !user) {
        console.error("❗ Missing token or user in response:", result);
        throw new Error("Invalid response: missing token or user");
      }

      // Step 3: Store token and notify
      localStorage.setItem("sid", token);
      console.log("💾 Token saved to localStorage");

      clientLogin(token);
      console.log("🔓 clientLogin called");

      setLoginSuccess(true);
      enqueueSnackbar(`Welcome ${user}`, { variant: "success" });

      setTimeout(() => {
        const redirectUrl = url || "https://test.neotechis.com/dashboard";
        console.log("➡️ Redirecting to:", redirectUrl);
        location.replace(redirectUrl);
      }, 500);
    } catch (error) {
      console.error("🚨 Login error:", error);
      enqueueSnackbar((error as Error).message || "Login failed", {
        variant: "error",
      });
    } finally {
      setLogging(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full mx-4 my-4 lg:mx-0 lg:mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 md:max-w-[450px]",
        loginSuccess && "md:max-w-max"
      )}
    >
      {!loginSuccess && (
        <div className="p-4 sm:p-7">
          <h1 className="block text-2xl font-bold text-gray-800 dark:text-white text-center">
            Sign in
          </h1>

          <div className="mt-5">
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm mb-2 dark:text-white">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                    placeholder="Enter your lovely email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: EMAIL_PATTERN,
                        message: "Email has invalid format",
                      },
                    })}
                    aria-invalid={formErrors.email ? "true" : "false"}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-600 mt-2" id="email-error">
                      {formErrors.email?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm mb-2 dark:text-white">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must have at least 6 characters",
                      },
                    })}
                    aria-invalid={formErrors.password ? "true" : "false"}
                  />
                  {formErrors.password && (
                    <p className="text-xs text-red-600 mt-2" id="password-error">
                      {formErrors.password?.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={logging}
                  className="w-full mt-4 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-[#774A67] text-white hover:bg-[#774A67] disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  {logging ? <Loader /> : "Sign in"}
                </button>
              </div>
            </form>
          </div>

          <div className="py-3 flex items-center text-xs text-gray-400 uppercase mt-3 before:flex-[1_1_0%] before:border-t before:border before:me-6 after:flex-[1_1_0%] after:border-t after:border border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
            Or
          </div>

          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Don't have an account yet?
              <a
                className="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  toggleSignUp();
                }}
              >
                {" "}Sign up here
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInForm;




// import { EMAIL_PATTERN } from "@constants/index";
// import { ENDPOINTS, fetcher } from "@api/useAxiosSWR";
// import { enqueueSnackbar } from "notistack";
// import { useForm } from "react-hook-form";
// import { LoginResponse } from "types/auth.request";
// import { AxiosError } from "axios";
// import { rootStore } from "@store/index";
// import React, { useState } from "react";
// import Loader from "@components/common/Loader";
// // import Pricing from "@components/sections/Pricing";
// import { cn } from "@utils/index";

// type Props = {
//   toggleSignUp: () => void;
//   loginSuccess: boolean;
//   setLoginSuccess: React.Dispatch<React.SetStateAction<boolean>>;
// };

// const SignInForm = ({ toggleSignUp, loginSuccess, setLoginSuccess }: Props) => {
//   // hooks
//   const {
//     register,
//     handleSubmit,
//     formState: { errors: formErrors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//     mode: "onChange",
//   });

//   const clientLogin = rootStore(({ handleClientLogin }) => handleClientLogin);

//   // states
//   const [logging, setLogging] = useState(false);


//   const onSubmit = async (data: Record<string, string>) => {
//     setLogging(true);
//     try {
//       // Clear any old session cookie
//       console.log("Clearing old session cookie...");
//       document.cookie = "sid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

//       const response = await fetch("https://test.neotechis.com/api/method/alphax_erp.api.login.login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//         credentials: "include",  // Include cookies for session management
//       });

//       console.log("Login API Response Status:", response.status);

//       if (!response.ok) {
//         const errorRes = await response.json();
//         console.error("Login failed with message:", errorRes.message);
//         throw new Error(errorRes.message || "Login failed");
//       }

//       const result = await response.json();
//       console.log("Login API Response Data:", result);

//       // Check if login was successful and proceed
//       const { message, token, url } = result;
//       console.log("Login API Result:", message);
//       console.log("Session Token:", token);

//       if (message?.message === "Login successful" && token) {
//         const siteUrl = url || "https://test.neotechis.com/dashboard";  // Default to the provided URL if not set
//         console.log("Redirecting to URL:", siteUrl);

//         clientLogin(token);  // Set your session token in the frontend if needed
//         setLoginSuccess(true);

//         // Show success message
//         enqueueSnackbar(`Welcome back, ${data.email}`, { variant: "success" });

//         // Redirect after a short delay to ensure UI transitions smoothly
//         setTimeout(() => {
//           location.replace(siteUrl);  // Redirect to the dashboard
//         }, 500);
//       } else {
//         console.error("Login failed. No token returned.");
//         throw new Error("Login failed. No token returned.");
//       }
//     } catch (error) {
//       setLogging(false);
//       console.error("Login Error:", error);
//       enqueueSnackbar(
//         (error as Error).message || "Internal error. Please try again later.",
//         { variant: "error" }
//       );
//     }
//   };



//   // methods
//   // const onSubmit = async (data: Record<string, string>) => {
//   //   setLogging(true);
//   //   try {
//   //     const response: LoginResponse = await fetcher.post(ENDPOINTS.login, {
//   //       ...data,
//   //     });
//   //     console.log("Raw response from API:", response);

//   //     // Handle error if message is a plain string (e.g., login failed)
//   //     if (typeof response.message === "string") {
//   //       throw new Error(response.message);
//   //     }

//   //     // Handle success if message is an object
//   //     if (
//   //       response.message &&
//   //       response.message.message === "Login successful" &&
//   //       response.message.token
//   //     ) {
//   //       const _resetting = () => {
//   //         reset();
//   //         setLogging(false);
//   //       };
//   //       console.log("Login successful. Token and URL found in response.");

//   //       const token = response.message.token;
//   //       const site_url = response.message.url;
//   //       console.log("Storing token in client state:", response.message.token);

//   //       // Store the token however you need
//   //       clientLogin(token);
//   //       setLoginSuccess(true);

//   //       console.log("Login success, token:", token);
//   //       console.log("Redirecting to:", site_url);

//   //       setTimeout(() => {
//   //         _resetting();
//   //         enqueueSnackbar(`Welcome back, ${data.email}`, {
//   //           variant: "success",
//   //         });
//   //       }, 200);

//   //       // Redirect to the ERP dashboard
//   //       setTimeout(() => {
//   //         location.replace(site_url);
//   //       }, 500);
//   //     }
//   //   } catch (error) {
//   //     setLogging(false);
//   //     enqueueSnackbar(
//   //       ((error as AxiosError)?.response?.data as { message: string })?.message ||
//   //       (error as Error).message ||
//   //       "Internal error. Please try again later",
//   //       {
//   //         variant: "error",
//   //       }
//   //     );
//   //   }
//   // };


//   return (
//     <div
//       className={cn(
//         "w-full mx-4 my-4 lg:mx-0 lg:mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 md:max-w-[450px]",
//         loginSuccess && "md:max-w-max"
//       )}
//     >
//       {!loginSuccess && (
//         <div className="p-4 sm:p-7">
//           <h1 className="block text-2xl font-bold text-gray-800 dark:text-white text-center">
//             Sign in
//           </h1>

//           <div className="mt-5">
//             <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
//               <div className="grid gap-y-4">
//                 <div>
//                   <label htmlFor="email" className="block text-sm mb-2 dark:text-white">
//                     Email <span className="text-red-400">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="email"
//                       id="email"
//                       className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
//                       placeholder="Enter your lovely email"
//                       aria-describedby="email-error"
//                       {...register("email", {
//                         required: "Email is required",
//                         pattern: {
//                           value: EMAIL_PATTERN,
//                           message: "Email has invalid format",
//                         },
//                       })}
//                       aria-invalid={formErrors.email ? "true" : "false"}
//                     />
//                   </div>
//                   {formErrors.email && (
//                     <p className="text-xs text-red-600 mt-2" id="email-error">
//                       {formErrors.email?.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <div className="flex justify-between items-center">
//                     <label htmlFor="password" className="block text-sm mb-2 dark:text-white">
//                       Password <span className="text-red-400">*</span>
//                     </label>
//                   </div>
//                   <div className="relative">
//                     <input
//                       type="password"
//                       id="password"
//                       className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
//                       placeholder="Enter your password"
//                       aria-describedby="password-error"
//                       {...register("password", {
//                         required: "Password is required",
//                         minLength: {
//                           value: 6,
//                           message: "Password must have at least 6 characters",
//                         },
//                       })}
//                       aria-invalid={formErrors.password ? "true" : "false"}
//                     />
//                   </div>
//                   {formErrors.password && (
//                     <p className="text-xs text-red-600 mt-2" id="password-error">
//                       {formErrors.password?.message}
//                     </p>
//                   )}
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={logging}
//                   className="w-full mt-4 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-[#774A67] text-white hover:bg-[#774A67] disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
//                 >
//                   {logging ? <Loader /> : "Sign in"}
//                 </button>
//               </div>
//             </form>
//           </div>

//           <div className="py-3 flex items-center text-xs text-gray-400 uppercase mt-3 before:flex-[1_1_0%] before:border-t before:border before:me-6 after:flex-[1_1_0%] after:border-t after:border border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
//             Or
//           </div>

//           <div className="text-center">
//             <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//               Don't have an account yet?
//               <a
//                 className="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
//                 href=""
//                 onClick={(e) => {
//                   e.preventDefault();
//                   toggleSignUp();
//                 }}
//               >
//                 {" "}
//                 Sign up here
//               </a>
//             </p>
//           </div>
//         </div>
//       )}
//       {loginSuccess && (
//         <div className="w-full h-auto relative flex flex-col items-center justify-center">
//           {/* <Pricing isInModal isExpiredPlan={isExpiredPlan} /> */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SignInForm;



// import { EMAIL_PATTERN } from "@constants/index";
// import { ENDPOINTS, fetcher } from "@api/useAxiosSWR";
// import { enqueueSnackbar } from "notistack";
// import { useForm } from "react-hook-form";
// import { LoginResponse } from "types/auth.request";
// import { AxiosError } from "axios";
// import { rootStore } from "@store/index";
// import React, { useState } from "react";
// import Loader from "@components/common/Loader";
// import Pricing from "@components/sections/Pricing";
// import { cn } from "@utils/index";

// type Props = {
//   toggleSignUp: () => void;
//   loginSuccess: boolean;
//   setLoginSuccess: React.Dispatch<React.SetStateAction<boolean>>;
// };

// const SignInForm = ({ toggleSignUp, loginSuccess, setLoginSuccess }: Props) => {
//   // hooks
//   const {
//     register,
//     handleSubmit,
//     formState: { errors: formErrors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//     mode: "onChange",
//   });

//   const clientLogin = rootStore(({ handleClientLogin }) => handleClientLogin);

//   // states
//   const [logging, setLogging] = useState(false);
//   const [hasDomain, setHasDomain] = useState(false);
//   const [isExpiredPlan, setIsExpiredPlan] = useState(false);

//   // methods
//   const onSubmit = async (data: Record<string, string>) => {
//     setLogging(true);
//     try {
//       const response: LoginResponse = await fetcher.post(ENDPOINTS.login, {
//         ...data,
//       });

//       if (response.message === "Login successful" && response.token) {
//         const _resetting = () => {
//           // reset form
//           reset();
//           setLogging(false);
//         };

//         // handle login token and state at client
//         clientLogin(response.token);
//         setLoginSuccess(true);

//         if (response.isExpired) {
//           setTimeout(() => {
//             _resetting();
//             enqueueSnackbar(`Your plan has expired. Please choose a plan to continue`, {
//               variant: "warning",
//             });
//           }, 200);
//           setIsExpiredPlan(true);
//           return;
//         }

//         // if user has not chosen a plan
//         if (response.domain === null) {
//           setTimeout(() => {
//             _resetting();
//             enqueueSnackbar(`Welcome to AlphaX, ${data.email}`, {
//               variant: "success",
//             });
//           }, 200);

//           // TODO: Show pricing plans or redirect to plans section for user to choose
//           return;
//         }

//         // if user has chosen a plan
//         setHasDomain(true);
//         const erpTarget = `http://${response.domain!}`;
//         setTimeout(() => {
//           _resetting();
//           enqueueSnackbar(`Welcome back, ${data.email}`, {
//             variant: "success",
//           });
//         }, 200);

//         // redirect to ERP platform
//         setTimeout(() => {
//           location.replace(erpTarget);
//         }, 500);
//       }
//     } catch (error) {
//       setLogging(false);
//       enqueueSnackbar(
//         ((error as AxiosError)?.response?.data as { message: string })?.message ||
//         (error as Error).message ||
//         "Internal error. Please try again later",
//         {
//           variant: "error",
//         }
//       );
//     }
//   };

//   return (
//     <div
//       className={cn("w-full mx-4 my-4 lg:mx-0 lg:mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 md:max-w-[450px]", loginSuccess && !hasDomain && "md:max-w-max")}
//     >
//       {!loginSuccess && (
//         <div className="p-4 sm:p-7">
//           <h1 className="block text-2xl font-bold text-gray-800 dark:text-white text-center">
//             Sign in
//           </h1>

//           <div className="mt-5">
//             <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
//               <div className="grid gap-y-4">
//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="block text-sm mb-2 dark:text-white"
//                   >
//                     Email <span className="text-red-400">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="email"
//                       id="email"
//                       className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm 
//                       focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 
//                       disabled:pointer-events-none dark:bg-slate-900 
//                       dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
//                       placeholder="Enter your lovely email"
//                       aria-describedby="email-error"
//                       {...register("email", {
//                         required: "Email is required",
//                         pattern: {
//                           value: EMAIL_PATTERN,
//                           message: "Email has invalid format",
//                         },
//                       })}
//                       aria-invalid={formErrors.email ? "true" : "false"}
//                     />
//                   </div>
//                   {formErrors.email && (
//                     <p className="text-xs text-red-600 mt-2" id="email-error">
//                       {formErrors.email?.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <div className="flex justify-between items-center">
//                     <label
//                       htmlFor="password"
//                       className="block text-sm mb-2 dark:text-white"
//                     >
//                       Password <span className="text-red-400">*</span>
//                     </label>
//                   </div>
//                   <div className="relative">
//                     <input
//                       type="password"
//                       id="password"
//                       className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm 
//                       focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 
//                       disabled:pointer-events-none dark:bg-slate-900 
//                       dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
//                       placeholder="Enter your password"
//                       aria-describedby="password-error"
//                       {...register("password", {
//                         required: "Password is required",
//                         minLength: {
//                           value: 6,
//                           message: "Password must have at least 6 characters",
//                         },
//                       })}
//                       aria-invalid={formErrors.password ? "true" : "false"}
//                     />
//                   </div>
//                   {formErrors.password && (
//                     <p className="text-xs text-red-600 mt-2" id="password-error">
//                       {formErrors.password?.message}
//                     </p>
//                   )}
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={logging}
//                   className="w-full mt-4 py-3 px-4 inline-flex justify-center items-center 
//                   gap-x-2 text-sm font-semibold rounded-lg border border-transparent 
//                   bg-[#774A67] text-white hover:bg-[#774A67] disabled:opacity-50 
//                   disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 
//                   dark:focus:ring-gray-600"
//                 >
//                   {logging ? <Loader /> : "Sign in"}
//                 </button>
//               </div>
//             </form>
//           </div>

//           <div
//             className="py-3 flex items-center text-xs text-gray-400 uppercase mt-3
//           before:flex-[1_1_0%] before:border-t before:border 
//           before:me-6 after:flex-[1_1_0%] after:border-t after:border 
//           border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-600 
//           dark:after:border-gray-600"
//           >
//             Or
//           </div>

//           <div className="text-center">
//             <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//               Don't have an account yet?
//               <a
//                 className="text-blue-600 decoration-2 hover:underline font-medium 
//                 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
//                 href=""
//                 onClick={(e) => {
//                   e.preventDefault();
//                   toggleSignUp();
//                 }}
//               >
//                 {" "}
//                 Sign up here
//               </a>
//             </p>
//           </div>
//         </div>
//       )}
//       {loginSuccess && hasDomain && (
//         <div className="w-full h-[300px] relative flex flex-col items-center justify-center gap-[1rem]">
//           <Loader />
//           <span className="text-gray-800 dark:text-white">
//             Redirecting to Frappe ...
//           </span>
//         </div>
//       )}
//       {loginSuccess && !hasDomain && (
//         <div className="w-full h-auto relative flex flex-col items-center justify-center">
//           <Pricing isInModal isExpiredPlan={isExpiredPlan} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default SignInForm;
