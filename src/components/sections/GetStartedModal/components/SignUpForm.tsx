import { ENDPOINTS, fetcher } from "@api/useAxiosSWR";
// import Loader from "@components/common/Loader";
import { EMAIL_PATTERN } from "@constants/index";
import { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  toggleSignUp: () => void;
};

const SignUpForm = ({ toggleSignUp }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      siteName: "",
      companyName: "",
      masterOfAccounts: "",
      phoneNumber: "",
      otp: "",
    },
    mode: "onChange",
  });

  const [signing, setSigning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepMessage, setStepMessage] = useState("");

  const updateProgress = (value: number, message: string) => {
    setProgress(value);
    setStepMessage(message);
  };

  const onSubmit = async (data: Record<string, string>) => {
    console.log("🔄 Step 1: Signup started with data:", data);
    setSigning(true);
    updateProgress(10, "Starting signup...");

    try {
      updateProgress(20, "Sending signup request...");
      const response: any = await fetcher.post(ENDPOINTS.signup, {
        ...data,
      });

      console.log("✅ Step 2: Signup API response received:", response);
      updateProgress(40, "Received response from server...");

      const token =
        response?.token ?? response?.message?.token ?? null;

      const site_url =
        response?.site_url ?? response?.message?.site_url ?? null;

      console.log("🔎 Step 3: Extracted token:", token);
      console.log("🔎 Step 4: Extracted site_url:", site_url);

      updateProgress(70, "Validating site creation...");

      if (token && site_url) {
        enqueueSnackbar(`🎉 Site created! Welcome to AlphaX, ${data.email}`, {
          variant: "success",
        });

        localStorage.setItem("access_token", token);
        reset();

        updateProgress(100, "Redirecting to your new site...");
        setTimeout(() => {
          window.location.href = site_url;
        }, 1000);
      } else {
        updateProgress(100, "⚠️ Site was not created.");
        enqueueSnackbar("Site was not created. Please try again later.", {
          variant: "warning",
        });
      }
    } catch (error) {
      const errorMessage =
        ((error as AxiosError)?.response?.data as { message: string })?.message ||
        (error as Error).message ||
        "Internal error. Please try again later";

      console.error("❌ Step 6: Signup error:", errorMessage);
      enqueueSnackbar(errorMessage, { variant: "error" });
      updateProgress(100, "Something went wrong.");
    } finally {
      setSigning(false);
    }
  };

  return (
    <>
      {/* Sign Up Form */}
      <div className="mt-7 w-full mx-4 lg:mx-0 md:max-w-[600px] bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="p-8 sm:p-10">
          <h1 className="block text-2xl font-bold text-gray-800 dark:text-white text-center">
          Create account
          </h1>
          {/* <p className="text-gray-600 dark:text-gray-400 text-center mb-6">No credit card required</p> */}

          {signing && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 text-center">
                {stepMessage}
              </p>
            </div>
          )}

          <form className="mt-5 w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-y-4">
              {/* First Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 dark:text-white">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("firstName", { required: "First name is required" })}
                    className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    placeholder="John"
                  />
                  {formErrors.firstName && (
                    <p className="text-xs text-red-600 mt-2">{formErrors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm mb-2 dark:text-white">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("lastName", { required: "Last name is required" })}
                    className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    placeholder="Doe"
                  />
                  {formErrors.lastName && (
                    <p className="text-xs text-red-600 mt-2">{formErrors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm mb-2 dark:text-white">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  {...register("companyName", { required: "Company name is required" })}
                  className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  placeholder="Awesome Inc."
                />
                {formErrors.companyName && (
                  <p className="text-xs text-red-600 mt-2">{formErrors.companyName.message}</p>
                )}
              </div>

              {/* Master of Accounts */}
              <div>
                <label className="block text-sm mb-2 dark:text-white">
                  Master of Accounts <span className="text-red-400"></span>
                </label>
                <input
                  type="text"
                  {...register("masterOfAccounts", )}
                  className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  placeholder="Master of Accounts"
                />
                <p className="text-xs text-gray-500 mt-1">Based on your business location your account will be created</p>
                {formErrors.masterOfAccounts && (
                  <p className="text-xs text-red-600 mt-2">{formErrors.masterOfAccounts.message}</p>
                )}
              </div>

              {/* Site Name */}
              <div>
                <label className="block text-sm mb-2 dark:text-white">
                  Site Name <span className="text-red-400">*</span>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    {...register("siteName", { required: "Site name is required" })}
                    className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    placeholder="example-site"
                  />
                  <span className="mt-1 ml-2 text-gray-500">.alphaxerp.com</span>
                </div>
                {formErrors.siteName && (
                  <p className="text-xs text-red-600 mt-2">{formErrors.siteName.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm mb-2 dark:text-white">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: EMAIL_PATTERN,
                      message: "Email has invalid format",
                    },
                  })}
                  className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  placeholder="your@email.com"
                />
                {formErrors.email && (
                  <p className="text-xs text-red-600 mt-2">{formErrors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm mb-2 dark:text-white">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must have at least 6 characters",
                      },
                    })}
                    className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    placeholder="Enter a secure password"
                  />
                  <i className="fas fa-eye absolute right-3 top-3 text-gray-500"></i>
                </div>
                {formErrors.password && (
                  <p className="text-xs text-red-600 mt-2">{formErrors.password.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 dark:text-white">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className="flex">
                    <span className="mt-1 mr-2 text-gray-500">🇮🇳</span>
                    <input
                      type="text"
                      {...register("phoneNumber", { required: "Phone number is required" })}
                      className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                      placeholder="Phone Number"
                    />
                  </div>
                  {formErrors.phoneNumber && (
                    <p className="text-xs text-red-600 mt-2">{formErrors.phoneNumber.message}</p>
                  )}
                </div>

                {/* OTP */}
                {/* <div>
                  <label className="block text-sm mb-2 dark:text-white">
                    OTP <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("otp", { required: "OTP is required" })}
                    className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    placeholder="Enter OTP"
                  />
                  {formErrors.otp && (
                    <p className="text-xs text-red-600 mt-2">{formErrors.otp.message}</p>
                  )}
                </div> */}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={signing}
                className="w-full mt-4 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg bg-[#774A67] text-white hover:bg-[#613a55] disabled:opacity-50"
              >
                {signing ? "Creating site..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?
              <a
                className="text-blue-600 hover:underline font-medium"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toggleSignUp();
                }}
              >
                {" "}
                Sign in here
              </a>
            </p>
            
            <p className="text-center mt-2 text-xs text-gray-500">
              By proceeding, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">Terms</a> and{" "}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>

      {/* 🚀 Modal Popup for Signup Progress */}
      {signing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-sm w-full animate-fadeIn">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {stepMessage}
              </h2>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">{progress}% Complete</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpForm;






// second code comment

// import { ENDPOINTS, fetcher } from "@api/useAxiosSWR";
// // import Loader from "@components/common/Loader";
// import { EMAIL_PATTERN } from "@constants/index";
// import { AxiosError } from "axios";
// import { enqueueSnackbar } from "notistack";
// import { useState } from "react";
// import { useForm } from "react-hook-form";

// type Props = {
//   toggleSignUp: () => void;
// };

// const SignUpForm = ({ toggleSignUp }: Props) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors: formErrors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       siteName: "",
//       companyName: "",
//     },
//     mode: "onChange",
//   });

//   const [signing, setSigning] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [stepMessage, setStepMessage] = useState("");

//   const updateProgress = (value: number, message: string) => {
//     setProgress(value);
//     setStepMessage(message);
//   };

//   const onSubmit = async (data: Record<string, string>) => {
//     console.log("🔄 Step 1: Signup started with data:", data);
//     setSigning(true);
//     updateProgress(10, "Starting signup...");

//     try {
//       updateProgress(20, "Sending signup request...");
//       const response: any = await fetcher.post(ENDPOINTS.signup, {
//         ...data,
//       });

//       console.log("✅ Step 2: Signup API response received:", response);
//       updateProgress(40, "Received response from server...");

//       const token =
//         response?.token ?? response?.message?.token ?? null;

//       const site_url =
//         response?.site_url ?? response?.message?.site_url ?? null;

//       console.log("🔎 Step 3: Extracted token:", token);
//       console.log("🔎 Step 4: Extracted site_url:", site_url);

//       updateProgress(70, "Validating site creation...");

//       if (token && site_url) {
//         enqueueSnackbar(`🎉 Site created! Welcome to AlphaX, ${data.email}`, {
//           variant: "success",
//         });

//         localStorage.setItem("access_token", token);
//         reset();

//         updateProgress(100, "Redirecting to your new site...");
//         setTimeout(() => {
//           window.location.href = site_url;
//         }, 1000);
//       } else {
//         updateProgress(100, "⚠️ Site was not created.");
//         enqueueSnackbar("Site was not created. Please try again later.", {
//           variant: "warning",
//         });
//       }
//     } catch (error) {
//       const errorMessage =
//         ((error as AxiosError)?.response?.data as { message: string })?.message ||
//         (error as Error).message ||
//         "Internal error. Please try again later";

//       console.error("❌ Step 6: Signup error:", errorMessage);
//       enqueueSnackbar(errorMessage, { variant: "error" });
//       updateProgress(100, "Something went wrong.");
//     } finally {
//       setSigning(false);
//     }
//   };
  

//   return (
//     <>
//       {/* Sign Up Form */}
//       <div className="mt-7 w-full mx-4 lg:mx-0 md:max-w-[450px] bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
//         <div className="p-4 sm:p-7">
//           <h1 className="block text-2xl font-bold text-gray-800 dark:text-white text-center">
//             Create account
//           </h1>

//           {signing && (
//             <div className="mt-4">
//               <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden">
//                 <div
//                   className="bg-green-500 h-3 rounded-full transition-all duration-300 ease-in-out"
//                   style={{ width: `${progress}%` }}
//                 ></div>
//               </div>
//               <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 text-center">
//                 {stepMessage}
//               </p>
//             </div>
//           )}

//           <form className="mt-5 w-full" onSubmit={handleSubmit(onSubmit)}>
//             <div className="grid gap-y-4">
//               {/* First Name */}
//               <div>
//                 <label className="block text-sm mb-2 dark:text-white">
//                   First Name <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   {...register("firstName", { required: "First name is required" })}
//                   className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                   placeholder="John"
//                 />
//                 {formErrors.firstName && (
//                   <p className="text-xs text-red-600 mt-2">{formErrors.firstName.message}</p>
//                 )}
//               </div>

//               {/* Last Name */}
//               <div>
//                 <label className="block text-sm mb-2 dark:text-white">
//                   Last Name <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   {...register("lastName", { required: "Last name is required" })}
//                   className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                   placeholder="Doe"
//                 />
//                 {formErrors.lastName && (
//                   <p className="text-xs text-red-600 mt-2">{formErrors.lastName.message}</p>
//                 )}
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm mb-2 dark:text-white">
//                   Email <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: {
//                       value: EMAIL_PATTERN,
//                       message: "Email has invalid format",
//                     },
//                   })}
//                   className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                   placeholder="your@email.com"
//                 />
//                 {formErrors.email && (
//                   <p className="text-xs text-red-600 mt-2">{formErrors.email.message}</p>
//                 )}
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-sm mb-2 dark:text-white">
//                   Password <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="password"
//                   {...register("password", {
//                     required: "Password is required",
//                     minLength: {
//                       value: 6,
//                       message: "Password must have at least 6 characters",
//                     },
//                   })}
//                   className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                   placeholder="Enter a secure password"
//                 />
//                 {formErrors.password && (
//                   <p className="text-xs text-red-600 mt-2">{formErrors.password.message}</p>
//                 )}
//               </div>

//               {/* Site Name */}
//               <div>
//                 <label className="block text-sm mb-2 dark:text-white">
//                   Site Name <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   {...register("siteName", { required: "Site name is required" })}
//                   className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                   placeholder="example-site"
//                 />
//                 {formErrors.siteName && (
//                   <p className="text-xs text-red-600 mt-2">{formErrors.siteName.message}</p>
//                 )}
//               </div>

//               {/* Company Name */}
//               <div>
//                 <label className="block text-sm mb-2 dark:text-white">
//                   Company Name <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   {...register("companyName", { required: "Company name is required" })}
//                   className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                   placeholder="Awesome Inc."
//                 />
//                 {formErrors.companyName && (
//                   <p className="text-xs text-red-600 mt-2">{formErrors.companyName.message}</p>
//                 )}
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 disabled={signing}
//                 className="w-full mt-4 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg bg-[#774A67] text-white hover:bg-[#774A67] disabled:opacity-50"
//               >
//                 {signing ? "Creating site..." : "Create account"}
//               </button>
//             </div>
//           </form>

//           <div className="text-center mt-6">
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Already have an account?
//               <a
//                 className="text-blue-600 hover:underline font-medium"
//                 href="#"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   toggleSignUp();
//                 }}
//               >
//                 {" "}
//                 Sign in here
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* 🚀 Modal Popup for Signup Progress */}
//       {signing && (
//         <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-sm w-full animate-fadeIn">
//             <div className="text-center">
//               <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//                 {stepMessage}
//               </h2>
//               <div className="mt-4 w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden">
//                 <div
//                   className="bg-green-500 h-3 rounded-full transition-all duration-300 ease-in-out"
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//               <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">{progress}% Complete</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SignUpForm;

// second code comment end

// import { ENDPOINTS, fetcher } from "@api/useAxiosSWR";
// import Loader from "@components/common/Loader";
// import { EMAIL_PATTERN } from "@constants/index";
// import { AxiosError } from "axios";
// import { enqueueSnackbar } from "notistack";
// import { useState } from "react";
// import { useForm } from "react-hook-form";

// type Props = {
//   toggleSignUp: () => void;
// };

// const SignUpForm = ({ toggleSignUp }: Props) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors: formErrors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       siteName: "",
//       companyName: "",
//     },
//     mode: "onChange",
//   });

//   const [signing, setSigning] = useState(false);

//   const onSubmit = async (data: Record<string, string>) => {
//     setSigning(true);

//     try {
//       const response: any = await fetcher.post(ENDPOINTS.signup, {
//         ...data,
//       });

//       if (response?.token) {
//         enqueueSnackbar(`Site created! Welcome to AlphaX, ${data.email}`, {
//           variant: "success",
//         });

//         localStorage.setItem("access_token", response.token);
//         reset();
//         toggleSignUp();
//       } else {
//         throw new Error("Signup succeeded but no token received.");
//       }
//     } catch (error) {
//       const errorMessage =
//         ((error as AxiosError)?.response?.data as { message: string })?.message ||
//         (error as Error).message ||
//         "Internal error. Please try again later";

//       enqueueSnackbar(errorMessage, { variant: "error" });
//     } finally {
//       setSigning(false);
//     }
//   };

//   return (
//     <div className="mt-7 w-full mx-4 lg:mx-0 md:max-w-[450px] bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
//       <div className="p-4 sm:p-7">
//         <h1 className="block text-2xl font-bold text-gray-800 dark:text-white text-center">
//           Create account
//         </h1>

//         <form className="mt-5 w-full" onSubmit={handleSubmit(onSubmit)}>
//           <div className="grid gap-y-4">
//             {/* First Name */}
//             <div>
//               <label className="block text-sm mb-2 dark:text-white">
//                 First Name <span className="text-red-400">*</span>
//               </label>
//               <input
//                 type="text"
//                 {...register("firstName", { required: "First name is required" })}
//                 className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                 placeholder="John"
//               />
//               {formErrors.firstName && (
//                 <p className="text-xs text-red-600 mt-2">{formErrors.firstName.message}</p>
//               )}
//             </div>

//             {/* Last Name */}
//             <div>
//               <label className="block text-sm mb-2 dark:text-white">
//                 Last Name <span className="text-red-400">*</span>
//               </label>
//               <input
//                 type="text"
//                 {...register("lastName", { required: "Last name is required" })}
//                 className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                 placeholder="Doe"
//               />
//               {formErrors.lastName && (
//                 <p className="text-xs text-red-600 mt-2">{formErrors.lastName.message}</p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm mb-2 dark:text-white">
//                 Email <span className="text-red-400">*</span>
//               </label>
//               <input
//                 type="email"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: EMAIL_PATTERN,
//                     message: "Email has invalid format",
//                   },
//                 })}
//                 className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                 placeholder="your@email.com"
//               />
//               {formErrors.email && (
//                 <p className="text-xs text-red-600 mt-2">{formErrors.email.message}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm mb-2 dark:text-white">
//                 Password <span className="text-red-400">*</span>
//               </label>
//               <input
//                 type="password"
//                 {...register("password", {
//                   required: "Password is required",
//                   minLength: {
//                     value: 6,
//                     message: "Password must have at least 6 characters",
//                   },
//                 })}
//                 className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                 placeholder="Enter a secure password"
//               />
//               {formErrors.password && (
//                 <p className="text-xs text-red-600 mt-2">{formErrors.password.message}</p>
//               )}
//             </div>

//             {/* Site Name */}
//             <div>
//               <label className="block text-sm mb-2 dark:text-white">
//                 Site Name <span className="text-red-400">*</span>
//               </label>
//               <input
//                 type="text"
//                 {...register("siteName", { required: "Site name is required" })}
//                 className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                 placeholder="example-site"
//               />
//               {formErrors.siteName && (
//                 <p className="text-xs text-red-600 mt-2">{formErrors.siteName.message}</p>
//               )}
//             </div>

//             {/* Company Name */}
//             <div>
//               <label className="block text-sm mb-2 dark:text-white">
//                 Company Name <span className="text-red-400">*</span>
//               </label>
//               <input
//                 type="text"
//                 {...register("companyName", { required: "Company name is required" })}
//                 className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                 placeholder="Awesome Inc."
//               />
//               {formErrors.companyName && (
//                 <p className="text-xs text-red-600 mt-2">{formErrors.companyName.message}</p>
//               )}
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={signing}
//               className="w-full mt-4 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg bg-[#774A67] text-white hover:bg-[#774A67] disabled:opacity-50"
//             >
//               {signing ? <Loader /> : "Create account"}
//             </button>
//           </div>
//         </form>

//         <div className="text-center mt-6">
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Already have an account?
//             <a
//               className="text-blue-600 hover:underline font-medium"
//               href="#"
//               onClick={(e) => {
//                 e.preventDefault();
//                 toggleSignUp();
//               }}
//             >
//               {" "}
//               Sign in here
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpForm;


