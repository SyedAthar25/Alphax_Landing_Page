import { rootStore } from "@store/index";
// import { motion } from 'framer-motion';
import Icons from "../Hero/icons";
// import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const toggleStarted = rootStore(({ toggleStarted }) => toggleStarted);
  return (
    // final changes
    <nav
      className="fixed z-[99] filter top-0 left-0 right-0 py-4 md:py-5 
  px-4 md:px-10 max-w-[110rem] flex items-center justify-between 
  bg-white text-[#020303] dark:bg-[#02030330] dark:text-white rounded-md 
  bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20"
    >
      <a
        className="cursor-pointer font-bold text-xl md:text-3xl font-mono pl-4 md:pl-0"
        href=""
      >
        <img src="src/images/alpha.jpg" alt="logo" className="h-12 w-22" />
      </a>

      <a
        className="get-started-btn bg-[#774A67] text-xs py-2 px-3 md:text-sm md:py-3 md:px-4 rounded-lg text-white font-semibold shadow-md hover:shadow-[0_0_15px_#774A67] focus:outline-none focus:ring-2 focus:ring-[#774A67] focus:shadow-[0_0_15px_#774A67] transition duration-300"
        href=""
        onClick={(e) => {
          e.preventDefault();
          toggleStarted();
        }}
      >
        Sign In
        <Icons.GetStartedChevronRight />
      </a>
    </nav>
  );
};

export default Navbar;
