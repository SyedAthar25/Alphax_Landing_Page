import { ENDPOINTS, fetcher } from "@api/useAxiosSWR";
import Loader from "@components/common/Loader";
import { EMAIL_PATTERN } from "@constants/index";
import { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignUpResponse } from "types/auth.request";

type Props = {
  toggleSignUp: () => void;
};

const SignUpForm = ({ toggleSignUp }: Props) => {
  // hooks
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

  // states
  const [signing, setSigning] = useState(false);

  // methods
  const onSubmit = async (data: Record<string, string>) => {
    setSigning(true);
    try {
      const response: SignUpResponse = await fetcher.post(ENDPOINTS.signup, {
        ...data,
      });

      if (response.message === "User created successfully") {
        setTimeout(() => {
          reset();
          setSigning(false);
          enqueueSnackbar(`Welcome to AlphaX Saas, ${data.email}! Please login.`, {
            variant: "success",
          });
          toggleSignUp();
        }, 200);
      }
    } catch (error) {
      setSigning(false);
      enqueueSnackbar(
        ((error as AxiosError)?.response?.data as { message: string })?.message ||
          (error as Error).message ||
          "Internal error. Please try again later",
        {
          variant: "error",
        }
      );
    }
  };

  return (
    <div className="mt-7 w-full mx-4 lg:mx-0 md:max-w-[450px] bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="p-4 sm:p-7">
        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white text-center">
          Create account
        </h1>

        <div className="mt-5">
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-y-4">

              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm mb-2 dark:text-white">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  placeholder="John"
                  {...register("firstName", { required: "First name is required" })}
                />
                {formErrors.firstName && (
                  <p className="text-xs text-red-600 mt-2">{formErrors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm mb-2 dark:text-white">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  placeholder="Doe"
                  {...register("lastName", { required: "Last name is required" })}
                />
                {formErrors.lastName && (
                  <p className="text-xs text-red-600 mt-2">{formErrors.lastName.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm mb-2 dark:text-white">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  placeholder="your@email.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: EMAIL_PATTERN,
                      message: "Email has invalid format",
                    },
                  })}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-600 mt-2">{formErrors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm mb-2 dark:text-white">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  placeholder="Enter a secure password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must have at least 6 characters",
                    },
                  })}
                />
                {formErrors.password && (
                  <p className="text-xs text-red-600 mt-2">{formErrors.password.message}</p>
                )}
              </div>

              {/* Site Name */}
              <div>
                <label htmlFor="siteName" className="block text-sm mb-2 dark:text-white">
                  Site Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="siteName"
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  placeholder="example-site"
                  {...register("siteName", { required: "Site name is required" })}
                />
                {formErrors.siteName && (
                  <p className="text-xs text-red-600 mt-2">{formErrors.siteName.message}</p>
                )}
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm mb-2 dark:text-white">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  placeholder="Awesome Inc."
                  {...register("companyName", { required: "Company name is required" })}
                />
                {formErrors.companyName && (
                  <p className="text-xs text-red-600 mt-2">{formErrors.companyName.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-[#774A67] text-white hover:bg-[#774A67] disabled:opacity-50"
              >
                {signing ? <Loader /> : "Create account"}
              </button>
            </div>
          </form>
        </div>

        <div className="py-3 flex items-center text-xs text-gray-400 uppercase mt-3 before:flex-[1_1_0%] before:border-t before:border before:me-6 after:flex-[1_1_0%] after:border-t after:border border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
          Or
        </div>

        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <a
              className="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href=""
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
