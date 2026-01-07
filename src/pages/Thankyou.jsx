import React from 'react';

const Thankyou = ({ onClose }) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-green-600 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
        <p className="text-gray-600 mb-6">Restaurant added successfully!</p>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default Thankyou;
