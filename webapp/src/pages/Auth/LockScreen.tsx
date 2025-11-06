import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LockScreen = () => {
  const [password, setPassword] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const correctPassword = '12345'; // Sample password for unlock
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUnlock = () => {
    navigate('/home'); 
    // if (password === correctPassword) {
    //   setIsLocked(false);
    // } else {
    //   alert('Incorrect password!');
    // }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-800">
      {isLocked ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold text-center mb-4">Lock Screen</h2>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">Enter Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleUnlock}
            className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Unlock
          </button>
        </div>
      ) : (
        <div className="text-center text-white text-3xl">
          <h1>Welcome Back!</h1>
          <p className="mt-2 text-lg">You are now unlocked.</p>
        </div>
      )}
    </div>
  );
};

export default LockScreen;
