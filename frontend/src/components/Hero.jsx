import { Link } from 'react-router-dom';
import heroBgDark from '../assets/hero-bg.png';
import heroBgLight from '../assets/hero-bg-light.png';

const Hero = () => {
  return (
    <div className="relative h-[500px] md:h-[600px] w-full shadow-xl overflow-hidden">
      
      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0">
        {/* Light Mode Image (Hidden in Dark Mode) */}
        <img 
          src={heroBgLight} 
          alt="Background" 
          className="w-full h-full object-cover object-center block dark:hidden"
        />
        
        {/* Dark Mode Image (Hidden in Light Mode) */}
        <img 
          src={heroBgDark} 
          alt="Background" 
          className="w-full h-full object-cover object-center hidden dark:block"
        />

        {/* Gradient Overlay: 
            - Light Mode: White fade on left so text is readable
            - Dark Mode: Black fade on left 
        */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/30 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent"></div>
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="w-full md:w-1/2 pl-4 md:pl-12">
          
          {/* Text Color: Dark in Light Mode, White in Dark Mode */}
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-sm text-gray-900 dark:text-white">
            Future Tech <br />
            <span className="text-blue-600 dark:text-blue-400">Is Here</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 drop-shadow-sm max-w-md text-gray-700 dark:text-gray-200">
            Discover the latest in high-performance electronics. Designed for the modern professional.
          </p>
          
          <Link 
            to="/search/electronics" 
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-white dark:text-blue-900 dark:hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg transform hover:scale-105 inline-block"
          >
            Shop Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;