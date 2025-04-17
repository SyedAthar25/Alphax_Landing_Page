import React, { useState } from "react";
import Icons from "./icons";
import "./style.css";

const Fotter = () => {
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    "English (US)",
    "Arabic (العربية)",
    "Español",
    "Français",
    "Deutsch",
    "中文 (简体)",
    "हिन्दी",
    "Português",
  ];

  return (
    // Final Changes
    <footer className="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
      {/* footer links */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
        <div className="col-span-full hidden lg:col-span-1 lg:block">
          <a
            aria-label="Brand"
            className="font-mono flex-none text-xl font-semibold dark:text-white"
            href="#"
          >
            AlphaX
          </a>
          <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            © 2025 AlphaX.
          </p>
        </div>

        {/* Footer Columns */}
        {[
          {
            title: "Product",
            links: ["Pricing", "Changelog", "Docs", "Download"],
          },
          {
            title: "Industries",
            links: [
              "Finance and insurance",
              "Construction",
              "Manufacturing",
              "Metal fabrication",
              "Food and beverage stores",
              "Food Manufacturing",
            ],
          },
          {
            title: "Company",
            links: [
              "About us",
              "Blog",
              "Careers",
              "Customers",
              "Newsroom",
              "Sitemap",
            ],
          },
          {
            title: "Resources",
            links: ["Community", "Help & Support", "API", "Customization"],
          },
        ].map((section) => (
          <div key={section.title}>
            <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
              {section.title}
            </h4>
            <div className="mt-3 grid space-y-3 text-sm">
              {section.links.map((link) => (
                <p key={link}>
                  <a className="footer-items" href="#">
                    {link}
                    {link === "Careers" && (
                      <span className="inline text-blue-600 dark:text-blue-500">
                        {" "}
                        — We're hiring
                      </span>
                    )}
                  </a>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* languages and socials */}
      <div className="pt-5 mt-5 border-t border-gray-200 dark:border-gray-700">
        <div className="sm:flex sm:justify-between sm:items-center">
          {/* Language switcher & legal links */}
          <div className="flex items-center gap-x-3">
            {/* Language dropdown */}
            <div className="relative inline-flex">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="inline-flex items-center gap-1 px-3 py-1 border rounded-md border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-800 dark:text-gray-200"
              >
                🌐 English (US)
                <svg
                  className={`w-3 h-3 ml-1 transition-transform ${isLangOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isLangOpen && (
                <ul className="absolute top-full left-0 mt-2 z-10 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md text-sm text-gray-700 dark:text-gray-200">
                  {languages.map((lang) => (
                    <li key={lang}>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        {lang}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Legal links */}
            <div className="space-x-4 text-sm ms-4">
              <a className="footer-items" href="#">
                Terms
              </a>
              <a className="footer-items" href="#">
                Privacy
              </a>
              <a className="footer-items" href="#">
                Status
              </a>
            </div>
          </div>

          {/* Socials + mobile brand */}
          <div className="flex justify-between items-center">
            <div className="mt-3 sm:hidden">
              <a
                className="font-mono flex-none text-xl font-semibold dark:text-white"
                href="#"
                aria-label="Brand"
              >
                AlphaX
              </a>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                © 2025 AlphaX.
              </p>
            </div>

            <div className="flex space-x-4">
              <a className="text-gray-500 hover:text-blue-600 dark:hover:text-white transition" href="#">
                {/* Twitter */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 19c7.547 0 11.675-6.155 11.675-11.5v-.525A8.18 8.18 0 0022 4.308a8.19 8.19 0 01-2.357.637A4.077 4.077 0 0021.448 3c-.798.463-1.683.8-2.623.982a4.104 4.104 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.017 4.017 0 001.27 5.472 4.06 4.06 0 01-1.86-.508v.051a4.109 4.109 0 003.292 4.021 4.1 4.1 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 17.544a11.616 11.616 0 006.29 1.843" />
                </svg>
              </a>
              <a className="text-gray-500 hover:text-blue-600 dark:hover:text-white transition" href="#">
                {/* Facebook */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 10-11.625 9.875v-6.987H8v-2.888h2.375V9.845c0-2.354 1.407-3.656 3.565-3.656 1.033 0 2.113.184 2.113.184v2.325H15.75c-1.243 0-1.63.775-1.63 1.57v1.883H18l-.375 2.888h-2.505v6.987A10.003 10.003 0 0022 12z" />
                </svg>
              </a>
              <a className="text-gray-500 hover:text-pink-500 dark:hover:text-white transition" href="#">
                {/* Instagram */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm4.75-1.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Fotter;
























// import Icons from "./icons";
// import "./style.css";

// const Fotter = () => {
//   return (
//     <footer className="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
//       {/* footer links 4 columns */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
//         <div className="col-span-full hidden lg:col-span-1 lg:block">
//           <a
//             aria-label="Brand"
//             className="font-mono flex-none text-xl font-semibold dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
//             href=""
//           >
//             AlphaX
//           </a>
//           <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
//             © 2025 AlphaX.
//           </p>
//         </div>

//         <div>
//           <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
//             Product
//           </h4>

//           <div className="mt-3 grid space-y-3 text-sm">
//             <p>
//               <a className="footer-items" href="">
//                 Pricing
//               </a>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Changelog
//               </a>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Docs
//               </a>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Download
//               </a>
//             </p>
//           </div>
//         </div>
//         {/*  */}
//         <div>
//           <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
//             Industries
//           </h4>

//           <div className="mt-3 grid space-y-3 text-sm">
//             <p>
//               <a className="footer-items" href="">
//                 Finance and insurance
//               </a>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Construction
//               </a>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Manufacturing
//               </a>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Metal fabrication
//               </a>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Food and beverage stores
//               </a>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Food Manufacturing
//               </a>
//             </p>
//           </div>
//         </div>
//         {/*  */}
//         <div>
//           <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
//             Company
//           </h4>

//           <div className="mt-3 grid space-y-3 text-sm">
//             <p>
//               <a className="footer-items" href="">
//                 About us
//               </a>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Blog
//               </a>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Careers
//               </a>{" "}
//               <span className="inline text-blue-600 dark:text-blue-500">
//                 — We're hiring
//               </span>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Customers
//               </a>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Newsroom
//               </a>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Sitemap
//               </a>
//             </p>
//           </div>
//         </div>

//         <div>
//           <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
//             Resources
//           </h4>

//           <div className="mt-3 grid space-y-3 text-sm">
//             <p>
//               <a className="footer-items" href="">
//                 Community
//               </a>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Help & Support
//               </a>
//             </p>
//             <p>
//               <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
//                 Development
//               </h4>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Api
//               </a>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Customization
//               </a>
//             </p>
//           </div>
//         </div>

//         {/* <div> */}
//         {/* <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
//             Development
//           </h4> */}

//         <div className="mt-3 grid space-y-3 text-sm">
//           {/* <p>
//               <a className="footer-items" href="">
//                 Api
//               </a>
//             </p> */}
//           {/* <p>
//               <a className="footer-items" href="">
//                 Customization
//               </a>
//             </p> */}
//           {/* <p>
//               <a className="footer-items" href="">
              
//               </a>{" "}
//               <span className="inline text-blue-600 dark:text-blue-500">
//                 — New
//               </span>
//             </p> */}
//           {/* </div> */}
//           {/* 
//           <h4 className="mt-7 text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
//             Industries
//           </h4>

//           <div className="mt-3 grid space-y-3 text-sm">
//             <p>
//               <a className="footer-items" href="">
//                 Financial Services
//               </a>
//             </p>
//             <p>
//               <a className="footer-items" href="">
//                 Education
//               </a>
//             </p>
//           </div> */}
//         </div>
//       </div>
//       {/* languages and socials */}
//       <div className="pt-5 mt-5 border-t border-gray-200 dark:border-gray-700">
//         <div className="sm:flex sm:justify-between sm:items-center">
//           {/* languages */}
//           <div className="flex items-center gap-x-3">
//             {/* language switcher */}
//             <div className="hs-dropdown relative inline-flex [--placement:top-left]">
//               {/* current selecting language */}
//               <button
//                 type="button"
//                 id="footer-language-dropdown"
//                 className="hs-dropdown-toggle language-dropdown-btn"
//               >
//                 <Icons.English />
//                 English (US)
//                 <Icons.ChevronUp />
//               </button>
//               {/* other language options */}
//               <div
//                 className="hs-dropdown-menu duration language-dropdown-open"
//                 aria-labelledby="footer-language-dropdown"
//               >
//                 <a className="language-option" href="">
//                   <Icons.English />
//                   English (US)
//                 </a>
//                 <a className="language-option" href="">
//                   <Icons.Chinese />
//                   中文 (繁體)
//                 </a>
//               </div>
//             </div>
//             {/* terms and conditions */}
//             <div className="space-x-4 text-sm ms-4">
//               <a className="footer-items" href="">
//                 Terms
//               </a>
//               <a className="footer-items" href="">
//                 Privacy
//               </a>
//               <a className="footer-items" href="">
//                 Status
//               </a>
//             </div>
//           </div>
//           {/* socials */}
//           <div className="flex justify-between items-center">
//             <div className="mt-3 sm:hidden">
//               <a
//                 className="font-mono flex-none text-xl font-semibold dark:text-white"
//                 href=""
//                 aria-label="Brand"
//               >
//                 AlphaX
//               </a>
//               <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
//                 © 2025 AlphaX.
//               </p>
//             </div>

//             <div className="space-x-4">
//               <a className="social-icon" href="">
//                 <Icons.Twitter />
//               </a>
//               <a className="social-icon" href="">
//                 <Icons.GitHub />
//               </a>
//               <a className="social-icon" href="">
//                 <Icons.Slack />
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Fotter;
