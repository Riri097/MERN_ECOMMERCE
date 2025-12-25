import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useVerifyMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const VerifyScreen = () => {
  const [otp, setOtp] = useState('');
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email'); // Get email from URL

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verify, { isLoading }] = useVerifyMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // 1. Verify OTP
      const res = await verify({ email, otp }).unwrap();
      // 2. Log user in immediately
      dispatch(setCredentials({ ...res }));
      navigate('/');
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Verify Email</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          We sent a code to <strong>{email}</strong>
        </p>

        <form onSubmit={submitHandler} className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 text-center text-xl tracking-widest border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            maxLength="6"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            {isLoading ? 'Verifying...' : 'Verify & Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyScreen;