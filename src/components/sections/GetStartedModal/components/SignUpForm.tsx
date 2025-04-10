import { ENDPOINTS, fetcher } from "@api/useAxiosSWR";
import { EMAIL_PATTERN } from "@constants/index";
import { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";

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
  const [stepMessage, setStepMessage] = useState("Initializing...");

  const updateProgress = (value: number, message: string) => {
    setProgress(value);
    setStepMessage(message);
  };

  const onSubmit = async (data: Record<string, string>) => {
    setSigning(true);
    updateProgress(10, "Starting signup...");

    try {
      updateProgress(20, "Sending signup request...");
      const response: any = await fetcher.post(ENDPOINTS.signup, { ...data });

      updateProgress(40, "Received response from server...");

      const token = response?.token ?? response?.message?.token ?? null;
      const site_url = response?.site_url ?? response?.message?.site_url ?? null;

      updateProgress(70, "Validating site creation...");

      if (token && site_url) {
        enqueueSnackbar(`🎉 Site created! Welcome to AlphaX, ${data.email}`, { variant: "success" });
        localStorage.setItem("access_token", token);
        reset();

        updateProgress(100, "Redirecting to your new site...");
        setTimeout(() => {
          window.location.href = site_url;
        }, 1000);
      } else {
        updateProgress(100, "⚠️ Site was not created.");
        enqueueSnackbar("Site was not created. Please try again later.", { variant: "warning" });
      }
    } catch (error) {
      const errorMessage =
        ((error as AxiosError)?.response?.data as { message: string })?.message ||
        (error as Error).message ||
        "Internal error. Please try again later";

      enqueueSnackbar(errorMessage, { variant: "error" });
      updateProgress(100, "Something went wrong.");
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="hide-scrollbar w-full h-screen overflow-auto bg-gray-50 dark:bg-gray-900 p-4 flex justify-center items-center">
      <div className="hide-scrollbar w-full max-w-[700px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-y-auto max-h-full">
        <div className="p-6 sm:p-10">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            Create account
          </h1>

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
                    placeholder="First Name"
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
                    placeholder="Last Name"
                  />
                  {formErrors.lastName && (
                    <p className="text-xs text-red-600 mt-2">{formErrors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm mb-2 dark:text-white">
                    Company Logo <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#774A67] file:text-white hover:file:bg-[#613a55] dark:file:bg-gray-700 dark:file:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 dark:text-white">Master of Accounts</label>
                <input
                  type="text"
                  {...register("masterOfAccounts")}
                  className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  placeholder="Master of Accounts"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Based on your business location your account will be created
                </p>
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
                  <span className="ml-2 mt-3 text-gray-500 text-sm">.alphaxerp.com</span>
                </div>
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
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm mb-2 dark:text-white">
                  Password <span className="text-red-400">*</span>
                </label>
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
              </div>

              <div>
                <label className="block text-sm mb-2 dark:text-white">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <PhoneInput
                  country={"in"}
                  inputClass="!w-full !py-3 !px-4 !text-sm !border !rounded-lg !dark:bg-slate-900 !dark:border-gray-700 !dark:text-gray-400"
                  specialLabel={""}
                  value={""}
                  onChange={(value) => {
                    (document.querySelector("input[name='phoneNumber']") as HTMLInputElement).value = value;
                  }}
                  inputProps={{
                    name: "phoneNumber",
                    required: true,
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={signing}
                className="w-full mt-4 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg bg-[#774A67] text-white hover:bg-[#613a55] disabled:opacity-50"
              >
                {signing ? "Creating site..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {signing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center gap-6 mb-6">
              {["#38bdf8", "#7c3aed", "#60a5fa"].map((color, i) => (
                <svg
                  key={i}
                  className={`w-16 h-16 ${
                    i === 1 ? "animate-spin-slow-reverse" : "animate-spin-slow"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={color}
                  viewBox="0 0 24 24"
                >
                  <path d="M19.14 12.936a7.996 7.996 0 0 0 .047-.936 7.996 7.996 0 0 0-.047-.936l2.036-1.593a.5.5 0 0 0 .121-.63l-1.926-3.33a.5.5 0 0 0-.607-.218l-2.396.96a7.98 7.98 0 0 0-1.617-.936l-.36-2.52A.5.5 0 0 0 13.405 2h-2.81a.5.5 0 0 0-.492.415l-.36 2.52a7.98 7.98 0 0 0-1.617.936l-2.396-.96a.5.5 0 0 0-.607.218L2.197 8.46a.5.5 0 0 0 .121.63l2.036 1.593a7.996 7.996 0 0 0 0 1.872L2.318 14.15a.5.5 0 0 0-.121.63l1.926 3.33a.5.5 0 0 0 .607.218l2.396-.96a7.98 7.98 0 0 0 1.617.936l.36 2.52a.5.5 0 0 0 .492.415h2.81a.5.5 0 0 0 .492-.415l.36-2.52a7.98 7.98 0 0 0 1.617-.936l2.396.96a.5.5 0 0 0 .607-.218l1.926-3.33a.5.5 0 0 0-.121-.63l-2.036-1.593zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
                </svg>
              ))}
            </div>
            <div className="text-lg text-slate-300 mb-2">{stepMessage}</div>
            <div className="w-60 h-2 bg-slate-700 rounded-full overflow-hidden mx-auto">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">{progress}% Complete</p>
          </div>
        </div>
      )}
    </div>
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


