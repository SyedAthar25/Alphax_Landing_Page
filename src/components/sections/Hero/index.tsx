import { rootStore } from "@store/index";
import Icons from "./icons";
import "./style.css";

const Hero = () => {
  const toggleStarted = rootStore(({ toggleStarted }) => toggleStarted);

  return (
    <section className="wrapper relative overflow-hidden">
      {/* Background Image */}
      <img
        src="/images/Colorful_bg.png"
        alt="Colorful Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-90 pointer-events-none"
      />

      {/* Optional Blur + Brightness Overlay */}
      <div className="absolute inset-0 backdrop-brightness-95 backdrop-blur-sm z-10"></div>

      {/* Foreground Content */}
      <div className="relative z-20 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-[20dvh] mb-10 sm:mb-20">
        {/* main headline */}
        <div className="mt-5 max-w-4xl text-center mx-auto">
          <h1 className="block font-bold text-gray-800 text-5xl md:text-6xl lg:text-7xl dark:text-gray-200 glow-text1">
            Rethink Your{" "}
            <span className="block font-bold text-[#774A67] text-6xl md:text-7xl lg:text-8xl dark:text-gray-200 glow-text1">
              Business Management
            </span>
          </h1>
          <style>
            {`
              .glow-text1 {
                text-shadow:
                  1px 1px 2px #582f4b,
                  2px 2px 4px #774A67,
                  3px 3px 6px #9e628b;
              }
            `}
          </style>
        </div>

        {/* sub headline */}
        <div className="mt-5 max-w-4xl text-center mx-auto">
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            AlphaX is a system that empowers your business through efficient
            marketing, seamless subscriber tracking, and robust management
            capabilities.
          </p>
        </div>

        {/* get started */}
        <div className="mt-8 gap-3 flex justify-center flex-col-reverse sm:flex-row">
          <a
            className="get-started-btn bg-[#774A67] hover:bg-[#774A67] py-3 px-6 text-white rounded-lg shadow-md text-sm font-semibold hover:shadow-[0_0_15px_#774A67] focus:outline-none focus:ring-2 focus:ring-[#774A67] focus:shadow-[0_0_15px_#774A67] transition duration-300"
            href=""
            onClick={(e) => {
              e.preventDefault();
              toggleStarted();
            }}
          >
            Get started
            <Icons.GetStartedChevronRight />
          </a>
        </div>

        {/* Optional extra buttons */}
        <div className="mt-6 sm:mt-12 lg:mt-16 flex gap-5 md:gap-12 justify-center flex-col sm:flex-row"></div>
      </div>
    </section>
  );
};

export default Hero;


{/* ratings */ }
{/* <div className="flex gap-0 justify-between sm:gap-8 sm:justify-center scale-95 md:scale-100">
            <div className="pt-2">
              <div className="flex space-x-1">
                <Icons.FullStar />
                <Icons.FullStar />
                <Icons.FullStar />
                <Icons.FullStar />
                <Icons.HalfStar />
              </div>

              <p className="mt-3 text-sm text-gray-800 dark:text-gray-200">
                <span className="font-bold">4.6</span> /5 - from 12k reviews
              </p>

              <div className="mt-5">
                <Icons.Google />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex space-x-1">
                <Icons.FullStar />
                <Icons.FullStar />
                <Icons.FullStar />
                <Icons.FullStar />
                <Icons.FullStar />
              </div>

              <p className="mt-3 text-sm text-gray-800 dark:text-gray-200">
                <span className="font-bold">4.8</span> /5 - from 5k reviews
              </p>

              <div className="mt-5">
                <Icons.Forbes />
              </div>
            </div>
          </div> */}
{/* partners */ }
{/* <div className="flex gap-8 scale-95 md:scale-100">
            <div className="pb-5">
              <div className="">
                <span className="text-xs font-medium text-gray-800 uppercase dark:text-gray-200">
                  Trusted by:
                </span>
                <div className="mt-4 flex gap-x-8">
                  <Icons.Airbnb />
                  <Icons.Fitbit />
                  <Icons.Vidados />
                </div>
              </div>
            </div>
          </div> */}

{/* <div className="mt-8 gap-3 flex justify-center flex-col-reverse sm:flex-row"> */ }
{/* <a
            className="get-started-btn bg-gradient-to-r from-[#774A67] to-[#774A67] hover:from-[#774A67] hover:to-[#774A67]"
            href=""
            onClick={(e) => {
              e.preventDefault();
              toggleStarted();
            }}
          >
            Get started
            <Icons.GetStartedChevronRight />
          </a> */}
{/* <button type="button" className="group yarn-add-wrapper">
            $ yarn add AlphaX Saas
            <span className="flex justify-center items-center bg-gray-200 rounded-md w-7 h-7 dark:bg-gray-700 dark:text-gray-400">
              <Icons.YarnAddCopy />
            </span>
          </button> */}
{/* </div> */ }
{/* package manager */ }
{/* <div className="mt-5 flex justify-center items-center gap-x-1 sm:gap-x-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Package Manager:
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            yarn
          </span>
          <Icons.PackageSlash />
          <a
            className="inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 hover:underline font-medium"
            href=""
          >
            Installation Guide
            <Icons.InstallationChevronRight />
          </a>
        </div> */}
{/* rating and partners */ }