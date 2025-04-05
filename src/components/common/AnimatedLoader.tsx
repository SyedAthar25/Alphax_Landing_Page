// components/common/AnimatedLoader.tsx
const AnimatedLoader = () => {
    return (
      <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.4s]"></div>
      </div>
    );
  };
  
  export default AnimatedLoader;
  