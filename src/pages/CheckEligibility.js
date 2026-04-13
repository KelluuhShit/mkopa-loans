import React, { useState, useEffect } from 'react';
import BorrowLoans from './BorrowLoans';

const CheckEligibility = () => {
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [verificationPhase, setVerificationPhase] = useState('numbers');
  const [progress, setProgress] = useState(0);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showBorrowLoans, setShowBorrowLoans] = useState(false); // Controls BorrowLoans page
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);

  const [randomNumber] = useState(() => Math.floor(10000 + Math.random() * 90000));

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [county, setCounty] = useState('');
  const [monthlyIncomeRange, setMonthlyIncomeRange] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');

  const [timeGreeting, setTimeGreeting] = useState('');
  const [minLoanAmount] = useState(() => Math.floor(30000 + Math.random() * 20000));
  const [maxLoanAmount] = useState(() => Math.floor(50001 + Math.random() * 20000));

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeGreeting('Good Morning');
    else if (hour < 17) setTimeGreeting('Good Afternoon');
    else setTimeGreeting('Good Evening');
  }, []);

  const counties = [
    'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita–Taveta',
    'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru',
    'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni',
    'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang’a', 'Kiambu',
    'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu',
    'Elgeyo-Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru',
    'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga',
    'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori',
    'Kisii', 'Nyamira', 'Nairobi City'
  ];

  const incomeRanges = [
    { value: '0-9999', label: '0 - 9,999' },
    { value: '10000-20000', label: '10,000 - 20,000' },
    { value: '20001-30000', label: '20,001 - 30,000' },
    { value: '30001-40000', label: '30,001 - 40,000' },
    { value: '40001-50000', label: '40,001 - 50,000' },
    { value: '50001-60000', label: '50,001 - 60,000' },
    { value: '60001-70000', label: '60,001 - 70,000' },
    { value: '70001-80000', label: '70,001 - 80,000' },
    { value: '80001+', label: '80,001 and above' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || phone.length !== 9) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowModal(true);
      setVerificationPhase('numbers');

      setTimeout(() => {
        setVerificationPhase('progress');
        let current = 0;
        const interval = setInterval(() => {
          current += 10;
          setProgress(current);
          if (current >= 100) {
            clearInterval(interval);
            setTimeout(() => setVerificationPhase('success'), 300);
          }
        }, 400);
      }, 1500);
    }, 2000);
  };

  const handleContinue = () => {
    setShowModal(false);
    setShowApplicationForm(true);
    setStep(1);
  };

  const handleBackToEligibility = () => {
    setShowApplicationForm(false);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) setStep(2);
  };

  const handlePrevStep = () => {
    if (step === 2) setStep(1);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setIsFinalSubmitting(true);

    setTimeout(() => {
      const firstName = fullName.trim().split(' ')[0];
      const userData = {
        fullName,
        firstName,
        idNumber,
        mpesaPhone,
        county,
        monthlyIncomeRange,
        loanPurpose,
        timeGreeting,
        minLoanAmount,
        maxLoanAmount,
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem('zkpesaloansUser', JSON.stringify(userData));

      setIsFinalSubmitting(false);
      setShowApplicationForm(false);
      setShowSuccessModal(true);
    }, 3000);
  };

  const handleBorrowLoan = () => {
    setShowSuccessModal(false);
    setShowBorrowLoans(true);
  };

  const handleBackFromBorrow = () => {
    setShowBorrowLoans(false);
    setShowSuccessModal(true); // Optional: return to success modal
  };

  const userData = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('zkpesaloansUser') || '{}')
    : {};

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">ZK Pesa Loans</h1>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-primary hover:text-secondary font-medium transition">Home</a>
            <a href="/" className="text-primary hover:text-secondary font-medium transition">About</a>
            <a href="/" className="text-primary hover:text-secondary font-medium transition">How It Works</a>
            <a href="/" className="text-primary hover:text-secondary font-medium transition">Contact</a>
          </div>
        </div>
      </nav>

      {/* Eligibility Screen */}
      {!showApplicationForm && !showSuccessModal && !showBorrowLoans && (
        <section className="pt-28 pb-20 min-h-screen bg-gradient-to-b from-background to-white">
          <div className="max-w-xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-6 text-center">
              Check Your Loan Eligibility
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-10 text-center">
              Enter your phone number to see how much you can borrow instantly.
            </p>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
              <div className="mb-8">
                <label className="block text-left text-base sm:text-lg font-semibold text-gray-800 mb-3">
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-5 sm:px-6 py-4 sm:py-5 rounded-l-2xl border border-r-0 border-gray-300 bg-gray-50 text-gray-700 text-base sm:text-lg font-medium">
                    +254
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    placeholder="712345678"
                    required
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 text-base sm:text-lg border border-gray-300 rounded-r-2xl focus:outline-none focus:ring-4 focus:ring-secondary/30 focus:border-secondary transition"
                    maxLength="9"
                    disabled={isSubmitting}
                  />
                </div>
                <p className="text-left text-xs sm:text-sm text-gray-600 mt-3">
                  We'll send an OTP to this number for verification
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="text-center">
                  <i className="fas fa-lock text-3xl sm:text-4xl text-secondary mb-2"></i>
                  <p className="text-xs sm:text-sm font-medium">Secure</p>
                </div>
                <div className="text-center">
                  <i className="fas fa-bolt text-3xl sm:text-4xl text-secondary mb-2"></i>
                  <p className="text-xs sm:text-sm font-medium">Instant Check</p>
                </div>
                <div className="text-center">
                  <i className="fas fa-shield-alt text-3xl sm:text-4xl text-secondary mb-2"></i>
                  <p className="text-xs sm:text-sm font-medium">No Credit Impact</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || phone.length !== 9}
                className="w-full btn-primary text-lg sm:text-xl py-5 sm:py-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-3"></i>
                    Checking...
                  </>
                ) : (
                  'Check Eligibility Now'
                )}
              </button>

              
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-700 text-base sm:text-lg mb-4">Trusted by over 50,000+ Kenyans</p>
              <div className="flex justify-center gap-6 sm:gap-8 text-3xl sm:text-4xl">
                <i className="fas fa-star text-accent"></i>
                <i className="fas fa-star text-accent"></i>
                <i className="fas fa-star text-accent"></i>
                <i className="fas fa-star text-accent"></i>
                <i className="fas fa-star text-accent"></i>
              </div>
              <p className="text-base sm:text-lg font-semibold mt-3">4.8★ Rating</p>
            </div>
          </div>
        </section>
      )}

      {/* Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-10 sm:p-12 max-w-md w-full text-center animate-fade-in">
            {verificationPhase === 'numbers' && (
              <div>
                <p className="text-base sm:text-lg text-gray-700 mb-8">Verifying your number...</p>
                <div className="mb-8">
                  <div className="inline-block text-4xl sm:text-5xl font-bold text-primary bg-gray-100 px-8 sm:px-10 py-5 sm:py-6 rounded-3xl shadow-lg animate-pulse">
                    {randomNumber}
                  </div>
                </div>
              </div>
            )}

            {verificationPhase === 'progress' && (
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-primary mb-10 animate-glow">
                  Verifying
                </p>
                <div className="w-full bg-gray-200 rounded-full h-8 sm:h-10 overflow-hidden shadow-inner mb-6">
                  <div
                    className="h-full bg-secondary transition-all duration-500 ease-out rounded-full shadow-lg"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-base sm:text-lg text-gray-600">{progress}% Complete</p>
              </div>
            )}

            {verificationPhase === 'success' && (
              <div className="animate-fade-in">
                <i className="fas fa-check-circle text-8xl sm:text-9xl text-secondary mb-8 animate-bounce"></i>
                <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
                  Verified Successfully!
                </h3>
                <p className="text-base sm:text-lg text-gray-700 mb-10">
                  Your phone number is confirmed.
                </p>
                <button
                  onClick={handleContinue}
                  className="btn-primary text-lg sm:text-xl py-5 px-10 sm:px-12 rounded-2xl"
                >
                  Continue to Application
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Application Form */}
      {showApplicationForm && (
        <section className="pt-28 pb-20 min-h-screen bg-gradient-to-b from-background to-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <button
              onClick={handleBackToEligibility}
              className="mb-8 text-primary hover:text-secondary font-medium flex items-center gap-2 text-base sm:text-lg"
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>

            <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-10 sm:mb-12">
                Complete Your Loan Application
              </h2>

              <div className="flex justify-center mb-10 sm:mb-12">
                <div className="flex items-center">
                  <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white ${step >= 1 ? 'bg-secondary' : 'bg-gray-300'}`}>
                    1
                  </div>
                  <div className={`w-24 sm:w-40 h-2 sm:h-3 mx-3 sm:mx-4 ${step >= 2 ? 'bg-secondary' : 'bg-gray-300'}`}></div>
                  <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white ${step >= 2 ? 'bg-secondary' : 'bg-gray-300'}`}>
                    2
                  </div>
                </div>
              </div>

              <form onSubmit={step === 1 ? handleNextStep : handleFinalSubmit}>
                {step === 1 && (
                  <>
                    <div className="mb-8">
                      <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-3">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full px-6 py-5 text-base sm:text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/30"
                        placeholder="e.g. John Mwangi Kimani"
                      />
                    </div>

                    <div className="mb-8">
                      <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-3">
                        National ID Number
                      </label>
                      <input
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        required
                        maxLength="10"
                        className="w-full px-6 py-5 text-base sm:text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/30"
                        placeholder="12345678"
                      />
                    </div>

                    <div className="mb-10">
                      <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-3">
                        M-Pesa Registered Phone Number
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-6 py-5 rounded-l-2xl border border-r-0 border-gray-300 bg-gray-50 text-gray-700 text-base sm:text-lg font-medium">
                          +254
                        </span>
                        <input
                          type="tel"
                          value={mpesaPhone}
                          onChange={(e) => setMpesaPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                          required
                          maxLength="9"
                          className="w-full px-6 py-5 text-base sm:text-lg border border-gray-300 rounded-r-2xl focus:outline-none focus:ring-4 focus:ring-secondary/30"
                          placeholder="712345678"
                        />
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="mb-8">
                      <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-3">
                        County of Residence
                      </label>
                      <select
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        required
                        className="w-full px-6 py-5 text-base sm:text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/30"
                      >
                        <option value="">Select your county</option>
                        {counties.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-8">
                      <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-3">
                        Average Monthly Income (KES)
                      </label>
                      <select
                        value={monthlyIncomeRange}
                        onChange={(e) => setMonthlyIncomeRange(e.target.value)}
                        required
                        className="w-full px-6 py-5 text-base sm:text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/30"
                      >
                        <option value="">Select income range</option>
                        {incomeRanges.map((range) => (
                          <option key={range.value} value={range.value}>{range.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-10">
                      <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-3">
                        Loan Purpose
                      </label>
                      <select
                        value={loanPurpose}
                        onChange={(e) => setLoanPurpose(e.target.value)}
                        required
                        className="w-full px-6 py-5 text-base sm:text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/30"
                      >
                        <option value="">Select purpose</option>
                        <option>Emergency</option>
                        <option>School Fees</option>
                        <option>Business Capital</option>
                        <option>Rent</option>
                        <option>Medical Bills</option>
                        <option>Personal Use</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="flex justify-between mt-10 sm:mt-12">
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="btn-secondary text-base sm:text-lg py-5 px-10 sm:px-12 rounded-2xl"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isFinalSubmitting}
                    className="btn-primary text-base sm:text-lg py-5 px-10 sm:px-12 rounded-2xl ml-auto relative disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isFinalSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-3"></i>
                        Submitting...
                      </>
                    ) : (
                      <>{step === 1 ? 'Next' : 'Submit Application'}</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Success Modal */}
      {showSuccessModal && userData.firstName && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-sm w-full text-center animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-8 text-5xl sm:text-6xl text-secondary">
              <i className="fas fa-lock"></i>
              <span className="text-4xl sm:text-5xl text-gray-400">-</span>
              <i className="fas fa-user"></i>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-5">
              Application Received!
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              <strong>{userData.timeGreeting}, {userData.firstName}.</strong><br /><br />
              Your Loan Request for <strong>{userData.loanPurpose || 'Personal Use'}</strong> has been Received Successfully.<br /><br />
              You are eligible to get loans of up to <strong>KES {userData.maxLoanAmount.toLocaleString()}</strong>.<br />
              Typical range: <strong>KES {userData.minLoanAmount.toLocaleString()} - {userData.maxLoanAmount.toLocaleString()}</strong>
            </p>

            <button
              onClick={handleBorrowLoan}
              className="btn-primary text-base sm:text-lg py-4 px-10 rounded-2xl"
            >
              Borrow Loan Now
            </button>
          </div>
        </div>
      )}

      {/* BorrowLoans Page */}
      {showBorrowLoans && (
        <BorrowLoans userData={userData} onBack={handleBackFromBorrow} />
      )}

      <style jsx>{`
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 15px #28A745; }
          50% { text-shadow: 0 0 35px #28A745, 0 0 50px #28A745; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25px); }
        }
        .animate-glow { animation: glow 1.5s infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-bounce { animation: bounce 1s infinite; }
      `}</style>
    </>
  );
};

export default CheckEligibility;