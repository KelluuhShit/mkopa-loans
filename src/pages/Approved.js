// approved.js
import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

const Approved = ({ onBack }) => {
  const [userData, setUserData] = useState({});
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 0, seconds: 0 });

  // Load user data from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('okoaChapaaUser') || '{}');
    setUserData(stored);
  }, []);

  // 48-hour countdown timer
  useEffect(() => {
    const targetTime = Date.now() + 48 * 60 * 60 * 1000; // Now + 48 hours

    const timer = setInterval(() => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!userData.firstName) {
    return <div className="text-center pt-28 text-lg">Loading your approval details...</div>;
  }

  const loanAmount = (userData.requestedAmount || userData.amount || 0).toLocaleString();
  
  const securityFee = (userData.securityFee || userData.fee || 0).toLocaleString();

  return (
    <>
      <Toaster position="top-center" />

      <section className="pt-20 pb-20 min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-md mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="mb-8 text-primary hover:text-secondary font-medium flex items-center gap-2 text-base"
          >
            <i className="fas fa-arrow-left"></i> Back to Home
          </button>

          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            {/* Success Checkmark */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <i className="fas fa-check text-6xl text-green-600"></i>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary mt-6">
                Loan Approved!
              </h1>
              <p className="text-lg text-gray-700 mt-3">
                Congratulations, <strong>{userData.firstName}</strong>! Your loan has been successfully approved.
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl p-8 mb-10 shadow-lg">
              <p className="text-lg font-semibold mb-4">Your funds will be sent in:</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-4xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-sm uppercase tracking-wider">Hours</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-sm uppercase tracking-wider">Minutes</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-sm uppercase tracking-wider">Seconds</div>
                </div>
              </div>
              <p className="mt-6 text-lg font-medium">
                Funds will be disbursed to: <br />
                <span className="text-2xl font-bold">+254 {userData.mpesaPhone}</span>
              </p>
            </div>

            {/* Loan Summary */}
            <div className="space-y-6 text-left">
              <h2 className="text-2xl font-bold text-primary text-center mb-6">Loan Summary</h2>

              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-sm text-gray-600">Approved Loan Amount</p>
                <p className="text-3xl font-bold text-primary">KES {loanAmount}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-sm text-gray-600">Security Fee Paid</p>
                <p className="text-2xl font-bold text-green-600">KES {securityFee}</p>
              </div>

              <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-5">
                <p className="text-sm text-gray-600">Total to Repay (in 60 days)</p>
                <p className="text-3xl font-bold text-primary">
                  KES {(userData.totalRepay || 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-secondary/10 rounded-2xl p-5">
                <p className="text-sm text-gray-600">Loan Tracking ID</p>
                <p className="font-mono text-xl font-bold text-secondary">{userData.loanTrackingId}</p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
                <p className="text-sm text-blue-700 font-medium text-center">
                  <i className="fas fa-info-circle mr-2"></i>
                  You will receive an M-Pesa message once the funds are sent within the next 48 hours.
                </p>
              </div>
            </div>

            {/* Reassurance */}
            <div className="mt-12 space-y-4 text-center text-gray-700">
              <p className="flex items-center justify-center gap-3">
                <i className="fas fa-shield-alt text-green-600 text-xl"></i>
                <span className="font-medium">100% Secure & Guaranteed</span>
              </p>
              <p className="flex items-center justify-center gap-3">
                <i className="fas fa-headset text-green-600 text-xl"></i>
                <span className="font-medium">Support available 24/7</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Approved;