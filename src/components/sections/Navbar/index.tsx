import { rootStore } from "@store/index";
import Icons from "../Hero/icons";
// import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const toggleStarted = rootStore(({ toggleStarted }) => toggleStarted);
  return (
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
        <img src="src/images/alphaxsaas.jpg" alt="logo" className="h-12 w-22" />
      </a>
      <a
        className="get-started-btn bg-gradient-to-r from-[#774A67] to-[#774A67] hover:from-[#774A67] hover:to-[#774A67] text-xs py-2 px-3 md:text-sm md:py-3 md:px-4"
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
