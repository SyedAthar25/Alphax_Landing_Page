import { ENDPOINTS, fetcher } from "@api/useAxiosSWR";
import Loader from "@components/common/Loader";
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
    },
    mode: "onChange",
  });

  const [signing, setSigning] = useState(false);

  const onSubmit = async (data: Record<string, string>) => {
    setSigning(true);

    try {
      const response: any = await fetcher.post(ENDPOINTS.signup, {
        ...data,
      });

      if (response?.token) {
        enqueueSnackbar(`Site created! Welcome to AlphaX, ${data.email}`, {
          variant: "success",
        });

        localStorage.setItem("access_token", response.token);
        reset();
        toggleSignUp();
      } else {
        throw new Error("Signup succeeded but no token received.");
      }
    } catch (error) {
      const errorMessage =
        ((error as AxiosError)?.response?.data as { message: string })?.message ||
        (error as Error).message ||
        "Internal error. Please try again later";

      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="mt-7 w-full mx-4 lg:mx-0 md:max-w-[450px] bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="p-4 sm:p-7">
        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white text-center">
          Create account
        </h1>

        <form className="mt-5 w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-y-4">
            {/* First Name */}
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
              {formErrors.password && (
                <p className="text-xs text-red-600 mt-2">{formErrors.password.message}</p>
              )}
            </div>

            {/* Site Name */}
            <div>
              <label className="block text-sm mb-2 dark:text-white">
                Site Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register("siteName", { required: "Site name is required" })}
                className="py-3 px-4 block w-full border rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                placeholder="example-site"
              />
              {formErrors.siteName && (
                <p className="text-xs text-red-600 mt-2">{formErrors.siteName.message}</p>
              )}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={signing}
              className="w-full mt-4 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg bg-[#774A67] text-white hover:bg-[#774A67] disabled:opacity-50"
            >
              {signing ? <Loader /> : "Create account"}
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
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;

// import { ENDPOINTS, fetcher } from "@api/useAxiosSWR";
// import Loader from "@components/common/Loader";
// import { EMAIL_PATTERN } from "@constants/index";
// import { AxiosError } from "axios";
// import { enqueueSnackbar } from "notistack";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// // import { useRouter } from "next/router";

// type Props = {
//   toggleSignUp: () => void;
// };

// const SignUpForm = ({ toggleSignUp }: Props) => {
//   // const router = useRouter();

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
//     console.log("📤 Submitting signup form with data:", data); // Step 1
//     setSigning(true);
//     console.log("⏳ Signup process started..."); // Step 2

//     try {
//       const response: { message: string; token: string } = await fetcher.post(
//         ENDPOINTS.signup,
//         {
//           ...data,
//         }
//       );

//       console.log("✅ API call successful. Response received:", response); // Step 3

//       if (response?.token) {
//         console.log("🔐 Token received:", response.token); // Step 4

//         enqueueSnackbar(`Site created! Welcome to AlphaX, ${data.email}`, {
//           variant: "success",
//         });
//         console.log("📢 Success notification shown to user."); // Step 5

//         localStorage.setItem("access_token", response.token);
//         console.log("💾 Token saved to localStorage."); // Step 6

//         reset();
//         console.log("🧹 Form reset."); // Step 7

//         toggleSignUp(); // Or use router.push()
//         console.log("🔄 Sign up form toggled (or redirect triggered)."); // Step 8
//       } else {
//         console.log("⚠️ Signup succeeded but no token in response.");
//         throw new Error("Signup succeeded but no token received.");
//       }
//     } catch (error) {
//       const errorMessage =
//         ((error as AxiosError)?.response?.data as { message: string })?.message ||
//         (error as Error).message ||
//         "Internal error. Please try again later";

//       enqueueSnackbar(errorMessage, { variant: "error" });
//       console.error("❌ Signup error:", errorMessage); // Error log
//     } finally {
//       setSigning(false);
//       console.log("🏁 Signup process ended."); // Final step
//     }
//   };

//   return (
//     <div className="mt-7 w-full mx-4 lg:mx-0 md:max-w-[450px] bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
//       <div className="p-4 sm:p-7">
//         <h1 className="block text-2xl font-bold text-gray-800 dark:text-white text-center">
//           Create account
//         </h1>

//         <div className="mt-5">
//           <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
//             <div className="grid gap-y-4">
//               {/* First Name */}
//               <div>
//                 <label htmlFor="firstName" className="block text-sm mb-2 dark:text-white">
//                   First Name <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="firstName"
//                   {...register("firstName", { required: "First name is required" })}
//                   className="py-3 px-4 block w-full border rounded-lg text-sm focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                   placeholder="John"
//                 />
//                 {formErrors.firstName && (
//                   <p className="text-xs text-red-600 mt-2">{formErrors.firstName.message}</p>
//                 )}
//               </div>

//               {/* Last Name */}
//               <div>
//                 <label htmlFor="lastName" className="block text-sm mb-2 dark:text-white">
//                   Last Name <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="lastName"
//                   {...register("lastName", { required: "Last name is required" })}
//                   className="py-3 px-4 block w-full border rounded-lg text-sm focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                   placeholder="Doe"
//                 />
//                 {formErrors.lastName && (
//                   <p className="text-xs text-red-600 mt-2">{formErrors.lastName.message}</p>
//                 )}
//               </div>

//               {/* Email */}
//               <div>
//                 <label htmlFor="email" className="block text-sm mb-2 dark:text-white">
//                   Email <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: {
//                       value: EMAIL_PATTERN,
//                       message: "Email has invalid format",
//                     },
//                   })}
//                   className="py-3 px-4 block w-full border rounded-lg text-sm focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                   placeholder="your@email.com"
//                 />
//                 {formErrors.email && (
//                   <p className="text-xs text-red-600 mt-2">{formErrors.email.message}</p>
//                 )}
//               </div>

//               {/* Password */}
//               <div>
//                 <label htmlFor="password" className="block text-sm mb-2 dark:text-white">
//                   Password <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   {...register("password", {
//                     required: "Password is required",
//                     minLength: {
//                       value: 6,
//                       message: "Password must have at least 6 characters",
//                     },
//                   })}
//                   className="py-3 px-4 block w-full border rounded-lg text-sm focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                   placeholder="Enter a secure password"
//                 />
//                 {formErrors.password && (
//                   <p className="text-xs text-red-600 mt-2">{formErrors.password.message}</p>
//                 )}
//               </div>

//               {/* Site Name */}
//               <div>
//                 <label htmlFor="siteName" className="block text-sm mb-2 dark:text-white">
//                   Site Name <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="siteName"
//                   {...register("siteName", { required: "Site name is required" })}
//                   className="py-3 px-4 block w-full border rounded-lg text-sm focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                   placeholder="example-site"
//                 />
//                 {formErrors.siteName && (
//                   <p className="text-xs text-red-600 mt-2">{formErrors.siteName.message}</p>
//                 )}
//               </div>

//               {/* Company Name */}
//               <div>
//                 <label htmlFor="companyName" className="block text-sm mb-2 dark:text-white">
//                   Company Name <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="companyName"
//                   {...register("companyName", { required: "Company name is required" })}
//                   className="py-3 px-4 block w-full border rounded-lg text-sm focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
//                   placeholder="Awesome Inc."
//                 />
//                 {formErrors.companyName && (
//                   <p className="text-xs text-red-600 mt-2">{formErrors.companyName.message}</p>
//                 )}
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 className="w-full mt-4 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg bg-[#774A67] text-white hover:bg-[#774A67] disabled:opacity-50"
//               >
//                 {signing ? <Loader /> : "Create account"}
//               </button>
//             </div>
//           </form>
//         </div>

//         <div className="py-3 flex items-center text-xs text-gray-400 uppercase mt-3 before:flex-[1_1_0%] before:border-t before:border before:me-6 after:flex-[1_1_0%] after:border-t after:border border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
//           Or
//         </div>

//         <div className="text-center">
//           <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//             Already have an account?
//             <a
//               className="text-blue-600 hover:underline font-medium"
//               href=""
//               onClick={(e) => {
//                 e.preventDefault();
//                 toggleSignUp();
//                 console.log("🔁 Switched to sign-in form."); // UI switch
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
