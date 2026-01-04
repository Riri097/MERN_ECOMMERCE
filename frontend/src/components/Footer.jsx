import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Line above footer */}
      <div className="border-t border-gray-300 dark:border-gray-700"></div>

      <footer className="bg-gray-100 dark:bg-black text-gray-700 dark:text-gray-300 py-10 mt-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          
          {/* About */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Shop Easy</h2>
            <p className="text-sm dark:text-gray-400">
              Your one-stop shop for electronics, gadgets, and accessories. Easy shopping, fast delivery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Home</a>
              </li>
              <li>
                <a href="/shop" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Shop</a>
              </li>
              <li>
                <a href="/myorders" className="hover:text-blue-600 dark:hover:text-blue-400 transition">My Orders</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Contact</a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Follow Us</h3>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                <FaFacebookF />
              </a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-4 text-center text-sm">
          &copy; {currentYear} Shop Easy. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
