import { rootStore } from "@store/index";
import { motion } from 'framer-motion';
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
      <motion.a
        className="get-started-btn bg-gradient-to-r from-[#774A67] to-[#774A67] text-xs py-2 px-3 md:text-sm md:py-3 md:px-4 rounded-lg text-white shadow-md font-semibold"
        href=""
        initial={{ background: '#5a3950' }}
        animate={{
          background: [
            '#5a3950', // darker
            '#774A67', // base
            '#8e5779', // lighter
            '#774A67',
            '#5a3950',
          ],
          boxShadow: [
            '0 2px 8px rgba(119, 74, 103, 0.2)',
            '0 4px 12px rgba(119, 74, 103, 0.4)',
            '0 2px 8px rgba(119, 74, 103, 0.2)',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
        whileHover={{
          scale: 1.05,
          boxShadow: '0 6px 20px rgba(119, 74, 103, 0.5)',
        }}
        onClick={(e) => {
          e.preventDefault();
          toggleStarted();
        }}
      >
        Sign In
        <Icons.GetStartedChevronRight />
      </motion.a>
    </nav>
  );
};

export default Navbar;
