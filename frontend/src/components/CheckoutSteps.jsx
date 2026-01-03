import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <nav className="flex justify-center mb-8">
      <ul className="flex items-center space-x-4 text-sm md:text-base">
        <li>
          {step1 ? <Link to="/login" className="text-blue-600 font-bold">Sign In</Link> : <span className="text-gray-400">Sign In</span>}
        </li>
        <li><span className="text-gray-400">{'>'}</span></li>
        <li>
          {step2 ? <Link to="/shipping" className="text-blue-600 font-bold">Shipping</Link> : <span className="text-gray-400">Shipping</span>}
        </li>
        <li><span className="text-gray-400">{'>'}</span></li>
        <li>
          {step3 ? <Link to="/payment" className="text-blue-600 font-bold">Payment</Link> : <span className="text-gray-400">Payment</span>}
        </li>
        <li><span className="text-gray-400">{'>'}</span></li>
        <li>
          {step4 ? <Link to="/placeorder" className="text-blue-600 font-bold">Place Order</Link> : <span className="text-gray-400">Place Order</span>}
        </li>
      </ul>
    </nav>
  );
};

export default CheckoutSteps;