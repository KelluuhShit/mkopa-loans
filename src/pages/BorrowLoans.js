import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BorrowLoans = ({ onBack }) => {
  const userData = JSON.parse(localStorage.getItem('okoaChapaaUser') || '{}');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const navigate = useNavigate(); // React Router navigation

  const loanOptions = [
    { amount: 5500, fee: 100 },
    { amount: 6800, fee: 150 },
    { amount: 7800, fee: 170 },
    { amount: 9800, fee: 200 },
    { amount: 11200, fee: 230 },
    { amount: 16800, fee: 250 },
    { amount: 21200, fee: 270 },
    { amount: 25600, fee: 400 },
    { amount: 30000, fee: 470 },
    { amount: 35400, fee: 590 },
    { amount: 39800, fee: 730 },
    { amount: 44200, fee: 1010 },
    { amount: 48600, fee: 1600 },
    { amount: 60600, fee: 2050 },
  ];

  const availableLoans = loanOptions.filter(
    (loan) => loan.amount <= (userData.maxLoanAmount || 70000)
  );

  const totalRepay = selectedLoan ? selectedLoan.amount + selectedLoan.fee : 0;

  const handleRequestLoan = () => {
    if (!selectedLoan || isRequesting) return;

    setIsRequesting(true);

    // Save selected loan details for SecureLoans page
    const updatedUserData = {
      ...userData,
      requestedAmount: selectedLoan.amount,
      securityFee: selectedLoan.fee,
      totalRepay: totalRepay,
    };
    localStorage.setItem('okoaChapaaUser', JSON.stringify(updatedUserData));

    // 3-second processing simulation
    setTimeout(() => {
      setIsRequesting(false);
      // Navigate to /secure-loans using React Router
      navigate('/secure-loans');
    }, 3000);
  };

  return (
    <section className="pt-28 pb-32 min-h-screen bg-gradient-to-b from-background to-white relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button
          onClick={onBack}
          className="mb-8 text-primary hover:text-secondary font-medium flex items-center gap-2 text-base sm:text-lg"
        >
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 pb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-6">
            Select Your Loan Amount
          </h2>
          <p className="text-center text-lg sm:text-xl text-gray-700 mb-10">
            Hello <strong>{userData.firstName || 'Customer'}</strong>! Choose an amount below.
          </p>

          {/* Loan Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {availableLoans.map((loan) => (
              <button
                key={loan.amount}
                onClick={() => setSelectedLoan(loan)}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedLoan?.amount === loan.amount
                    ? 'border-secondary bg-secondary/10 shadow-xl scale-105'
                    : 'border-gray-300 bg-white hover:border-secondary/50 hover:shadow-md'
                }`}
              >
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                  KES {loan.amount.toLocaleString()}
                </div>
                <div className="text-base sm:text-lg text-gray-600">
                  Security Fee: <strong>KES {loan.fee.toLocaleString()}</strong>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Total: KES {(loan.amount + loan.fee).toLocaleString()}
                </div>
                {selectedLoan?.amount === loan.amount && (
                  <div className="mt-4 text-center">
                    <i className="fas fa-check-circle text-3xl text-secondary"></i>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      {selectedLoan && (
        <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl">
          <div className="p-6 sm:p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedLoan(null)}
              className="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 text-2xl sm:text-3xl transition shadow-md"
              aria-label="Close bottom sheet"
            >
              ×
            </button>

            {/* Pull indicator */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>

            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-primary">
              Your Selected Loan
            </h3>

            <div className="space-y-5 text-base sm:text-lg mb-8">
              <div className="flex justify-between">
                <span className="text-gray-700">You will receive</span>
                <span className="font-bold text-primary text-xl">
                  KES {selectedLoan.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Security Fee</span>
                <span className="font-bold">KES {selectedLoan.fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-primary pt-5 border-t-2 border-gray-200">
                <span>Total to Repay</span>
                <span>KES {totalRepay.toLocaleString()}</span>
              </div>
              <div className="text-center text-gray-600">
                Due in <strong>60 days</strong>
              </div>
            </div>

            {/* Request Button with 3-Second Loader */}
            <button
              onClick={handleRequestLoan}
              disabled={isRequesting}
              className="w-full btn-primary text-lg sm:text-xl py-6 rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed relative"
            >
              {isRequesting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-3"></i>
                  Processing Request...
                </>
              ) : (
                `Request KES ${totalRepay.toLocaleString()} Now`
              )}
            </button>

            <p className="text-center text-xs sm:text-sm text-gray-600 mt-5">
              Money sent instantly to your M-Pesa upon approval
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default BorrowLoans;