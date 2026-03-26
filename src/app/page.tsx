'use client';

import { useState, FormEvent } from 'react';

/* ─────────── ICONS ─────────── */
const CheckIcon = ({ className = "w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L7 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const XIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ─────────── DATA ─────────── */
const services = [
  { icon: '🏠', title: 'Standard Cleaning', desc: 'Keep your place looking fresh with a regular clean that covers all the basics — every nook and cranny!', items: ['Dusting all surfaces', 'Vacuuming & mopping', 'Kitchen & bathroom sanitization', 'Beds made', 'Trash removal'], accent: 'border-t-blue-500' },
  { icon: '✨', title: 'Deep Cleaning', desc: 'For when your space needs some serious love. We go top-to-bottom and leave no spot untouched.', items: ['Inside appliances', 'Laundry washed & folded', 'Bedding washed & changed', 'Baseboards & light fixtures', 'Window sills & blinds', 'Grout & tile scrubbing'], accent: 'border-t-teal-500' },
  { icon: '📦', title: 'Move-In / Move-Out', desc: 'Moving is stressful enough — let us handle the cleaning so you can focus on the fun stuff!', items: ['Full interior deep clean', 'Inside all cabinets & closets', 'Appliance cleaning', 'Garage sweep-out'], accent: 'border-t-amber-500' },
  { icon: '🏢', title: 'Commercial Cleaning', desc: 'A clean workspace = happy team. We keep your office spotless so everyone can do their best work.', items: ['Office sanitization', 'Break room & restrooms', 'Floor care & vacuuming', 'Custom schedules'], accent: 'border-t-emerald-500' },
];

const pricingPlans = [
  { name: 'Standard Clean', emoji: '🧹', price: '$130', features: ['All rooms dusted & wiped', 'Floors vacuumed & mopped', 'Bathrooms sanitized', 'Kitchen cleaned & shined', 'Beds made', 'Trash taken out'], popular: false },
  { name: 'Deep Clean', emoji: '🫧', price: '$230', features: ['Everything in Standard', 'Laundry washed & folded', 'Bedding washed & changed', 'Inside oven & fridge', 'Baseboards & light fixtures', 'Window sills & blinds', 'Grout & tile detailing', 'Cabinet exteriors'], popular: true },
  { name: 'Move In/Out', emoji: '📦', price: '$299', features: ['Everything in Deep Clean', 'Inside all cabinets & drawers', 'Closet interiors', 'Appliance deep clean', 'Garage sweep', 'Wall spot cleaning'], popular: false },
];

const testimonials = [
  { name: 'Sarah M.', location: 'Grenada, MS', text: "Austin and his crew are the real deal! My home has never looked this good. I actually look forward to coming home after cleaning day now.", rating: 5 },
  { name: 'James R.', location: 'Greenwood, MS', text: "We use them for our office every other week — always on time, super friendly, and the place smells amazing after. 10/10 would recommend!", rating: 5 },
  { name: 'Maria L.', location: 'Winona, MS', text: "The move-out clean saved my life (and my deposit). They got every corner spotless. Already booked them for my new place!", rating: 5 },
];

/* ─────────── SECTIONS ─────────── */

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2 font-extrabold text-xl text-gray-900">
          <span className="text-2xl">🫧</span>
          Austin&apos;s Cleaning
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-gray-500 hover:text-blue-600 font-medium text-sm">
              {l.label}
            </a>
          ))}
          <a href="#quote" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md shadow-blue-600/20 hover:shadow-lg hover:-translate-y-0.5">
            Free Quote
          </a>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-600 p-2">
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 pb-6 pt-2 space-y-1 shadow-lg">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-gray-700 hover:text-blue-600 font-medium border-b border-gray-50">{l.label}</a>
          ))}
          <a href="#quote" onClick={() => setOpen(false)} className="block text-center bg-blue-600 text-white px-5 py-3 rounded-lg text-sm font-semibold mt-4">Free Quote</a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-40 lg:pb-32 px-5 sm:px-8 bg-gradient-to-b from-blue-50 to-white">
      {/* Subtle decorative shapes */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl" />
      {/* Illustrated cleaning supplies */}
      <div className="absolute top-28 right-[8%] hidden lg:block opacity-[0.12] rotate-12">
        <svg width="80" height="120" viewBox="0 0 80 120" fill="none"><rect x="30" y="40" width="20" height="60" rx="4" fill="#3b82f6"/><rect x="26" y="90" width="28" height="12" rx="6" fill="#60a5fa"/><rect x="35" y="10" width="10" height="35" rx="3" fill="#93c5fd"/><circle cx="40" cy="8" r="6" fill="#93c5fd"/></svg>
      </div>
      <div className="absolute top-48 right-[28%] hidden lg:block opacity-[0.08] -rotate-12">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none"><ellipse cx="50" cy="70" rx="30" ry="25" fill="#14b8a6"/><ellipse cx="50" cy="65" rx="26" ry="8" fill="#5eead4"/><rect x="46" y="20" width="8" height="40" rx="4" fill="#99f6e4"/><circle cx="50" cy="16" r="8" stroke="#5eead4" strokeWidth="3" fill="none"/></svg>
      </div>
      <div className="absolute bottom-24 right-[18%] hidden lg:block opacity-[0.10] rotate-6">
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none"><circle cx="45" cy="45" r="30" fill="#dbeafe"/><circle cx="35" cy="35" r="8" fill="#93c5fd" opacity="0.6"/><circle cx="55" cy="30" r="5" fill="#93c5fd" opacity="0.4"/><circle cx="50" cy="55" r="6" fill="#93c5fd" opacity="0.5"/><circle cx="30" cy="52" r="4" fill="#bfdbfe" opacity="0.7"/></svg>
      </div>
      <div className="absolute top-36 right-[4%] hidden lg:block opacity-[0.10] -rotate-6">
        <svg width="70" height="50" viewBox="0 0 70 50" fill="none"><rect x="5" y="15" width="60" height="30" rx="6" fill="#fbbf24" opacity="0.7"/><rect x="10" y="10" width="50" height="10" rx="3" fill="#fcd34d" opacity="0.5"/><line x1="20" y1="25" x2="20" y2="40" stroke="#f59e0b" strokeWidth="2" opacity="0.4"/><line x1="35" y1="25" x2="35" y2="40" stroke="#f59e0b" strokeWidth="2" opacity="0.4"/><line x1="50" y1="25" x2="50" y2="40" stroke="#f59e0b" strokeWidth="2" opacity="0.4"/></svg>
      </div>
      <div className="absolute bottom-40 right-[35%] hidden lg:block opacity-[0.08]">
        <svg width="60" height="100" viewBox="0 0 60 100" fill="none"><rect x="20" y="30" width="20" height="60" rx="3" fill="#a78bfa"/><rect x="15" y="80" width="30" height="12" rx="4" fill="#c4b5fd"/><rect x="27" y="5" width="6" height="30" rx="3" fill="#ddd6fe"/><path d="M10 80 L15 30 L45 30 L50 80" fill="none" stroke="#c4b5fd" strokeWidth="2" opacity="0.5"/></svg>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-semibold text-blue-700 mb-6 border border-blue-100 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Serving Grenada, MS &amp; Surrounding Areas
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 leading-tight tracking-tight">
            We Clean.
            <br />
            <span className="text-blue-600">You Relax.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-500 leading-relaxed max-w-xl">
            Life&apos;s too short to spend it scrubbing floors. Let Austin&apos;s Cleaning handle the dirty work while you kick back and enjoy your spotless space.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a href="#quote" className="group inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-base font-bold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:-translate-y-0.5">
              Get Your Free Quote
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </a>
            <a href="tel:+16629967137" className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg text-base font-semibold border border-gray-200 shadow-sm hover:-translate-y-0.5">
              <PhoneIcon />
              <span className="ml-2">(662) 996-7137</span>
            </a>
          </div>
          <div className="mt-12 flex flex-wrap gap-6 text-sm text-gray-500">
            {['Licensed & Insured', 'Satisfaction Guaranteed', 'Eco-Friendly'].map(badge => (
              <div key={badge} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L7 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="relative px-5 sm:px-8 py-20 lg:py-28 bg-white overflow-hidden">
      {/* Illustrated cleaning art */}
      <div className="absolute top-10 left-[4%] hidden lg:block opacity-[0.07] rotate-12">
        <svg width="60" height="90" viewBox="0 0 60 90" fill="none"><rect x="22" y="30" width="16" height="45" rx="3" fill="#3b82f6"/><rect x="18" y="68" width="24" height="10" rx="5" fill="#60a5fa"/><rect x="27" y="8" width="6" height="26" rx="3" fill="#93c5fd"/><circle cx="30" cy="6" r="5" fill="#93c5fd"/></svg>
      </div>
      <div className="absolute bottom-16 right-[6%] hidden lg:block opacity-[0.06] -rotate-12">
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none"><circle cx="35" cy="35" r="25" fill="#dbeafe"/><circle cx="28" cy="28" r="6" fill="#93c5fd" opacity="0.5"/><circle cx="42" cy="25" r="4" fill="#93c5fd" opacity="0.3"/><circle cx="38" cy="45" r="5" fill="#93c5fd" opacity="0.4"/></svg>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">What We Do</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">Our Services</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">From quick touch-ups to full deep cleans — we&apos;ve got a service for every situation.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.title} className={`bg-white rounded-xl p-7 border border-gray-100 border-t-4 ${s.accent} shadow-sm hover:shadow-lg transition-all hover:-translate-y-1`}>
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-500 mb-4 leading-relaxed text-sm">{s.desc}</p>
              <ul className="space-y-2">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-gray-600 text-sm">
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="relative px-5 sm:px-8 py-20 lg:py-28 bg-gray-50 overflow-hidden">
      {/* Illustrated cleaning art */}
      <div className="absolute top-12 right-[5%] hidden lg:block opacity-[0.06] -rotate-[15deg]">
        <svg width="70" height="80" viewBox="0 0 70 80" fill="none"><ellipse cx="35" cy="55" rx="25" ry="20" fill="#14b8a6"/><ellipse cx="35" cy="50" rx="21" ry="7" fill="#5eead4"/><rect x="31" y="15" width="8" height="32" rx="4" fill="#99f6e4"/><circle cx="35" cy="12" r="6" stroke="#5eead4" strokeWidth="2.5" fill="none"/></svg>
      </div>
      <div className="absolute bottom-16 left-[4%] hidden lg:block opacity-[0.06] rotate-12">
        <svg width="50" height="80" viewBox="0 0 50 80" fill="none"><rect x="20" y="25" width="10" height="45" rx="2" fill="#a78bfa"/><rect x="16" y="65" width="18" height="8" rx="3" fill="#c4b5fd"/><rect x="23" y="5" width="4" height="24" rx="2" fill="#ddd6fe"/></svg>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Pricing</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">Simple, Honest Pricing</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">Mississippi-friendly prices, no hidden fees. Get an exact quote in minutes!</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className={`relative bg-white rounded-xl p-7 border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-100'}`}>
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="text-4xl mb-3">{plan.emoji}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-xs text-gray-400">From</span>
                <span className="text-3xl font-black text-gray-900">{plan.price}</span>
              </div>
              <p className="text-gray-400 text-sm mb-5">per visit</p>
              <ul className="space-y-2.5 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-gray-600 text-sm">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#quote" className={`block text-center py-3 rounded-lg font-semibold text-sm transition-all hover:-translate-y-0.5 ${
                plan.popular
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}>
                Get a Quote
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-400 text-sm mt-8">* Prices vary based on home size, condition, and location. Book recurring and save!</p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="px-5 sm:px-8 py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-100 via-teal-50 to-sky-100 flex items-center justify-center overflow-hidden shadow-lg">
              <div className="text-center px-8">
                <div className="text-8xl mb-4">🧹</div>
                <p className="text-gray-800 font-bold text-xl">Austin&apos;s Cleaning</p>
                <p className="text-blue-600 text-sm mt-1">Proudly serving Grenada, MS</p>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-2 sm:right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="text-2xl font-black text-blue-600">200+</div>
              <div className="text-gray-500 text-xs">Happy Customers</div>
            </div>
            <div className="absolute -top-3 -left-2 sm:left-6 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
              <div className="flex gap-0.5 mb-0.5">
                {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-xs">★</span>)}
              </div>
              <div className="text-gray-500 text-[10px] font-medium">5-Star Rated</div>
            </div>
          </div>

          <div>
            <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">About Us</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">Hey, I&apos;m Austin! 👋</h2>
            <p className="mt-6 text-gray-600 leading-relaxed text-lg">
              I started Austin&apos;s Cleaning right here in Grenada, Mississippi because I believe everyone deserves to come home to a clean, fresh space — without breaking the bank or lifting a finger.
            </p>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Our crew is trained, background-checked, and genuinely cares about doing a great job. We use eco-friendly products that are safe for your family and pets, and we treat every home like our own.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { num: '5+', label: 'Years Experience' },
                { num: '100%', label: 'Satisfaction Rate' },
                { num: '200+', label: 'Homes Cleaned' },
                { num: '50+', label: '5-Star Reviews' },
              ].map(stat => (
                <div key={stat.label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                  <div className="text-xl font-extrabold text-blue-600">{stat.num}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="px-5 sm:px-8 py-20 lg:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Reviews</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">What Our Customers Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-xl p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => <StarIcon key={i} />)}
              </div>
              <p className="text-gray-600 leading-relaxed mb-5 text-sm">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', bedrooms: '', bathrooms: '', message: '' });

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); setSubmitted(true); };
  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const inputClass = "w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-900 placeholder-gray-400";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  if (submitted) {
    return (
      <section id="quote" className="px-5 sm:px-8 py-20 lg:py-28 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-blue-50 rounded-2xl p-12 border border-blue-100">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-3">You&apos;re All Set!</h3>
            <p className="text-gray-500 text-lg">Austin will review your request and get back to you within 24 hours with a personalized quote.</p>
            <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', bedrooms: '', bathrooms: '', message: '' }); }} className="mt-6 text-blue-600 hover:text-blue-700 font-semibold text-sm">Submit Another Request</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="relative px-5 sm:px-8 py-20 lg:py-28 bg-white overflow-hidden">
      {/* Illustrated cleaning art */}
      <div className="absolute top-16 right-[6%] hidden lg:block opacity-[0.06] rotate-12">
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none"><circle cx="35" cy="35" r="25" fill="#dbeafe"/><circle cx="28" cy="28" r="6" fill="#93c5fd" opacity="0.5"/><circle cx="45" cy="30" r="4" fill="#93c5fd" opacity="0.3"/><circle cx="38" cy="48" r="5" fill="#93c5fd" opacity="0.4"/></svg>
      </div>
      <div className="absolute bottom-12 left-[3%] hidden lg:block opacity-[0.06] -rotate-6">
        <svg width="50" height="75" viewBox="0 0 50 75" fill="none"><rect x="18" y="25" width="14" height="38" rx="3" fill="#3b82f6"/><rect x="14" y="57" width="22" height="9" rx="4" fill="#60a5fa"/><rect x="22" y="6" width="6" height="22" rx="3" fill="#93c5fd"/><circle cx="25" cy="4" r="4" fill="#93c5fd"/></svg>
      </div>
      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Free Quote</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">Get Your Free Quote</h2>
            <p className="mt-4 text-gray-500 text-lg leading-relaxed">
              Tell us about your space and we&apos;ll send you a detailed, no-strings-attached quote within 24 hours.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: <ClockIcon />, text: 'Response within 24 hours', color: 'bg-blue-50 text-blue-600' },
                { icon: <CheckIcon className="w-5 h-5 text-teal-600" />, text: 'No obligation, 100% free', color: 'bg-teal-50 text-teal-600' },
                { icon: <PhoneIcon />, text: 'Or call (662) 996-7137', color: 'bg-amber-50 text-amber-600' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 text-gray-600">
                  <div className={`w-9 h-9 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>{item.icon}</div>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-7 sm:p-9 border border-gray-100 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelClass}>Full Name *</label><input type="text" required value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" className={inputClass} /></div>
                <div><label className={labelClass}>Email *</label><input type="email" required value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" className={inputClass} /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelClass}>Phone</label><input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="(662) 996-7137" className={inputClass} /></div>
                <div><label className={labelClass}>Service Type *</label>
                  <select required value={form.service} onChange={e => update('service', e.target.value)} className={inputClass}>
                    <option value="">Pick one!</option>
                    <option value="standard">Standard Cleaning</option>
                    <option value="deep">Deep Cleaning</option>
                    <option value="move">Move-In / Move-Out</option>
                    <option value="commercial">Commercial Cleaning</option>
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelClass}>Bedrooms</label>
                  <select value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} className={inputClass}>
                    <option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5+">5+</option>
                  </select>
                </div>
                <div><label className={labelClass}>Bathrooms</label>
                  <select value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)} className={inputClass}>
                    <option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4+">4+</option>
                  </select>
                </div>
              </div>
              <div><label className={labelClass}>Anything else we should know?</label>
                <textarea rows={3} value={form.message} onChange={e => update('message', e.target.value)} placeholder="Tell us about your space, special requests, preferred days..." className={`${inputClass} resize-none`} />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-bold text-sm shadow-md shadow-blue-600/20 hover:shadow-lg hover:-translate-y-0.5">
                Request My Free Quote
              </button>
              <p className="text-center text-gray-400 text-xs">No spam, no pressure. We&apos;ll only reach out about your quote.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="px-5 sm:px-8 py-20 lg:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Contact</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">Get In Touch</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: <PhoneIcon />, label: 'Call Us', value: '(662) 996-7137', href: 'tel:+16629967137', color: 'bg-blue-50 text-blue-600' },
            { icon: <MailIcon />, label: 'Email Us', value: 'austin@austinscleaning.com', href: 'mailto:austin@austinscleaning.com', color: 'bg-teal-50 text-teal-600' },
            { icon: <MapPinIcon />, label: 'Service Area', value: 'Grenada, MS & Surrounding', href: undefined, color: 'bg-amber-50 text-amber-600' },
          ].map(c => (
            <div key={c.label} className="text-center bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <div className={`w-11 h-11 rounded-lg ${c.color} flex items-center justify-center mx-auto mb-3`}>{c.icon}</div>
              <div className="text-xs text-gray-400 mb-1">{c.label}</div>
              {c.href ? (
                <a href={c.href} className="text-gray-900 font-semibold hover:text-blue-600 text-sm">{c.value}</a>
              ) : (
                <div className="text-gray-900 font-semibold text-sm">{c.value}</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm mb-3">Proudly serving homes and businesses across Mississippi</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Grenada', 'Greenwood', 'Winona', 'Carrollton', 'Duck Hill', 'Holcomb', 'Gore Springs', 'Vaiden'].map(city => (
              <span key={city} className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 font-medium border border-gray-100">{city}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <span>🫧</span> Austin&apos;s Cleaning
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-sm">
            {['Services', 'Pricing', 'About', 'Reviews'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-white">{link}</a>
            ))}
            <a href="#quote" className="hover:text-white">Get a Quote</a>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-7 pt-7 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <span>&copy; {new Date().getFullYear()} Austin&apos;s Cleaning. All rights reserved.</span>
          <span>Grenada, Mississippi & Surrounding Areas</span>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Pricing />
      <About />
      <Reviews />
      <QuoteForm />
      <Contact />
      <Footer />
    </>
  );
}
