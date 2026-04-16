import React from 'react';

const Home = () => {
  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">M-Kopa Loans</h1>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-primary hover:text-secondary font-medium transition">Home</a>
            <a href="#about" className="text-primary hover:text-secondary font-medium transition">About</a>
            <a href="#how" className="text-primary hover:text-secondary font-medium transition">How It Works</a>
            <a href="#testimonials" className="text-primary hover:text-secondary font-medium transition">Testimonials</a>
            <a href="#contact" className="text-primary hover:text-secondary font-medium transition">Contact</a>
            <a href="/check-eligibility" className="btn-primary ml-6">Apply Loan</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="pt-32 pb-24 text-center bg-gradient-to-b from-background to-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-secondary font-bold text-xl mb-6">Trusted by 50,000+ Kenyans</p>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 max-w-4xl mx-auto">
            Fast, Reliable Loans When You Need Them Most
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
            M-Kopa Loans Loans helps you handle emergencies with quick approval, flexible repayment, and zero stress.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
            <a href="/check-eligibility" className="btn-primary">Apply Loan Now</a>
            <a href="#how" className="btn-secondary">Learn How It Works</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div>
              <i className="fas fa-clock text-6xl text-secondary mb-4"></i>
              <p className="font-semibold text-lg">5 Min Approval</p>
            </div>
            <div>
              <i className="fas fa-mobile-alt text-6xl text-secondary mb-4"></i>
              <p className="font-semibold text-lg">100% Mobile</p>
            </div>
            <div>
              <i className="fas fa-shield-alt text-6xl text-secondary mb-4"></i>
              <p className="font-semibold text-lg">Secure</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">About Us</h2>
          <h3 className="text-2xl font-semibold mb-8">About M-Kopa Loans Loans</h3>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-16">
            We're a digital loan solution built for Kenyans. Whether it's an emergency, school fees, or business capital, M-Kopa Loans has your back with fast, reliable financing you can trust.
          </p>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {['Fast Approval', 'Transparent Terms', 'Secure Platform', 'Flexible Repayment'].map((title, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-xl">
                <i className={`fas fa-${i===0?'bolt':i===1?'file-invoice-dollar':i===2?'lock':'calendar-alt'} text-4xl text-secondary mb-4`}></i>
                <h4 className="text-xl font-bold mb-3">{title}</h4>
                <p className="text-gray-600">
                  {i===0?'Get approved in 5 minutes':i===1?'No hidden charges':i===2?'Bank-level security':'Weekly, bi-weekly or monthly'}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['50K+ Happy Customers', 'KES 2B+ Loans Disbursed', '5 Min Average Approval', '4.8★ App Rating'].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.split(' ')[0]}</p>
                <p className="text-gray-700">{stat.split(' ').slice(1).join(' ')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Simple Process</h2>
          <h3 className="text-2xl font-semibold mb-8">How It Works</h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-16">
            Getting a loan with M-Kopa Loans is straightforward. Follow these four simple steps.
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: 'user-plus', title: 'Sign Up' },
              { icon: 'edit', title: 'Apply for a Loan' },
              { icon: 'check-circle', title: 'Get Approved' },
              { icon: 'wallet', title: 'Receive Money' }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  0{i+1}
                </div>
                <i className={`fas fa-${step.icon} text-4xl text-secondary mb-4`}></i>
                <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                <p className="text-gray-600">Quick and easy {step.title.toLowerCase()} process.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Testimonials</h2>
          <h3 className="text-2xl font-semibold mb-8">What Our Customers Say</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Grace Wanjiku', location: 'Nairobi', initials: 'GW' },
              { name: 'Kevin Omondi', location: 'Kisumu', initials: 'KO' },
              { name: 'Faith Muthoni', location: 'Mombasa', initials: 'FM' },
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {t.initials}
                </div>
                <p className="italic text-gray-700 mb-6">
                  "{i===0?'M-Kopa Loans imenisaidia sana when things were tight. Approval ilikuwa fast, no stress kabisa!':
                     i===1?'I needed quick cash for an emergency, M-Kopa Loans ilikuwa there. Very legit app.':
                     'Repayment iko flexible, hakuna pressure. I trust this app kabisa.'}"
                </p>
                <p className="font-bold">{t.name}</p>
                <p className="text-gray-600">{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="apply" className="py-20 bg-primary text-white text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Need Help Today? M-Kopa Loans Has You Covered</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            Whether it's an emergency, school fees, or business capital, we're here to help you get back on track.
          </p>
          <a href="/check-eligibility" className="btn-primary inline-block text-xl px-12 py-5">Apply for a Loan Now</a>
          <p className="mt-8 text-lg">No hidden fees • Flexible repayment • Fast approval</p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">M-Kopa Loans</h3>
          <p className="mb-10">Your trusted digital loan partner in Kenya. Fast, secure, and reliable loans when you need them most.</p>
          <div className="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
            
            <div>
              <strong className="block mb-3">Legal</strong>
              
            </div>
            <div>
              <strong className="block mb-3">Contact Us</strong>
              <p>support@mkopaloans.co.ke</p>
              <p>+254 700 123 456</p>
              <p>Westlands, Nairobi, Kenya</p>
            </div>
          </div>
          <p className="mt-12 text-sm">
            © 2024 M-Kopa Loans Loans. All rights reserved.<br/>
            Licensed by the Central Bank of Kenya
          </p>
        </div>
      </footer>
    </>
  );
};

export default Home;