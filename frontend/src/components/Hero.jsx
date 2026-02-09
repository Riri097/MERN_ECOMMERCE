import { Link } from 'react-router-dom';
import heroBg from '../assets/hero-bg.png';

const Hero = () => {
  return (
    <div className="relative h-[500px] md:h-[600px] w-full shadow-xl overflow-hidden">
      
      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0">
        {/* Light Mode Image */}
        <img 
          src={heroBg} 
          alt="Background" 
          className="w-full h-full object-cover object-center block dark:hidden"
        />
        
        {/* Dark Mode Image */}
        <img 
          src={heroBg} 
          alt="Background" 
          className="w-full h-full object-cover object-center hidden dark:block"
        />

        {/* Gradient Overlay: Stronger fade on the left to make text pop */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent dark:from-black/95 dark:via-black/70 dark:to-transparent"></div>
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="w-full md:w-2/3 pl-2 md:pl-12 pt-4">
          
          {/* Top Label */}
          <p className="text-xs md:text-sm font-bold tracking-[0.25em] text-gray-500 dark:text-gray-400 uppercase mb-2">
            Limited Stock, Limited Hours
          </p>

          {/* Massive Title Stack */}
          <div className="flex flex-col leading-[0.9] mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 dark:text-white tracking-tighter drop-shadow-2xl">
              BLACK
            </h1>
            {/* Gradient Text for 'FRIDAY' */}
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-600 to-blue-900 dark:from-white dark:to-gray-500 tracking-tighter drop-shadow-lg">
              FRIDAY
            </h1>
          </div>
          
          {/* Discount Badge & CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            
            {/* The "50% OFF" Badge (Skewed Box) */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md shadow-blue-500/30 shadow-lg flex items-center overflow-hidden transform -skew-x-12 border border-blue-400/30">
              <div className="px-5 py-2 bg-blue-800/50 font-black text-2xl md:text-3xl skew-x-12 border-r border-blue-400/30">
                50% 
              </div>
              <div className="px-5 py-2 font-bold tracking-widest text-sm md:text-base skew-x-12">
                OFF SALE
              </div>
            </div>

            {/* Shop Button */}
            <Link 
              to="/shop" 
              className="group flex items-center gap-2 text-gray-900 dark:text-white font-bold hover:text-blue-600 dark:hover:text-blue-400 transition mt-2 sm:mt-0"
            >
              <span className="border-b-2 border-current pb-1 text-lg">Shop Now</span>
              <span className="group-hover:translate-x-2 transition-transform text-xl">→</span>
            </Link>
          </div>

          {/* Footer Date Info */}
          <div className="mt-10 border-l-4 border-blue-600 pl-4">
            <p className="uppercase tracking-widest text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
              This Friday Only
            </p>
            <p className="text-blue-700 dark:text-blue-400 font-extrabold text-xl">
              NOVEMBER 28, 2025
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;