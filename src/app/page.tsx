'use client';

import { useState, FormEvent } from 'react';

/* ─────────── ICONS (inline SVG components) ─────────── */
const SparkleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
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
  {
    icon: '🏠',
    title: 'Standard Cleaning',
    desc: 'Regular maintenance cleaning to keep your home fresh and tidy every week or bi-weekly.',
    items: ['Dusting all surfaces', 'Vacuuming & mopping', 'Kitchen & bathroom sanitization', 'Trash removal'],
  },
  {
    icon: '✨',
    title: 'Deep Cleaning',
    desc: 'A thorough top-to-bottom clean for homes that need extra attention and detail.',
    items: ['Inside appliances', 'Baseboards & light fixtures', 'Window sills & blinds', 'Grout & tile scrubbing'],
  },
  {
    icon: '📦',
    title: 'Move-In / Move-Out',
    desc: 'Get your deposit back or start fresh in a spotless new home.',
    items: ['Full interior deep clean', 'Inside all cabinets & closets', 'Appliance cleaning', 'Garage sweep-out'],
  },
  {
    icon: '🏢',
    title: 'Commercial Cleaning',
    desc: 'Professional office and commercial space cleaning tailored to your business needs.',
    items: ['Office sanitization', 'Break room & restrooms', 'Floor care & vacuuming', 'Custom schedules'],
  },
];

const pricingPlans = [
  {
    name: 'Standard Clean',
    price: 'From $120',
    frequency: 'per visit',
    features: [
      'All rooms dusted & wiped',
      'Floors vacuumed & mopped',
      'Bathrooms sanitized',
      'Kitchen cleaned & shined',
      'Trash taken out',
    ],
    popular: false,
  },
  {
    name: 'Deep Clean',
    price: 'From $199',
    frequency: 'per visit',
    features: [
      'Everything in Standard',
      'Inside oven & fridge',
      'Baseboards & light fixtures',
      'Window sills & blinds',
      'Grout & tile detailing',
      'Cabinet exteriors',
    ],
    popular: true,
  },
  {
    name: 'Move In/Out',
    price: 'From $299',
    frequency: 'per visit',
    features: [
      'Everything in Deep Clean',
      'Inside all cabinets & drawers',
      'Closet interiors',
      'Appliance deep clean',
      'Garage sweep',
      'Wall spot cleaning',
    ],
    popular: false,
  },
];

const testimonials = [
  {
    name: 'Sarah M.',
    text: "Austin's team made my home look brand new. I've tried other services before, but none come close to the attention to detail here. Absolutely love it!",
    rating: 5,
  },
  {
    name: 'James R.',
    text: "We use them for our office bi-weekly and the space always looks incredible. Professional, on time, and very reasonably priced. Highly recommend!",
    rating: 5,
  },
  {
    name: 'Maria L.',
    text: "The move-out clean saved me so much stress. They got every corner spotless and I got my full deposit back. Will definitely use again!",
    rating: 5,
  },
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2 text-brand-700 font-bold text-xl">
          <SparkleIcon className="w-7 h-7 text-brand-500" />
          <span>Austin&apos;s Pristine</span>
        </a>
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-gray-600 hover:text-brand-600 font-medium text-sm transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#quote" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5">
            Free Quote
          </a>
        </div>
        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-600 p-2">
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 pb-6 pt-2 space-y-1">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-gray-700 hover:text-brand-600 font-medium border-b border-gray-50">
              {l.label}
            </a>
          ))}
          <a href="#quote" onClick={() => setOpen(false)} className="block text-center bg-brand-500 text-white px-5 py-3 rounded-full text-sm font-semibold mt-4">
            Free Quote
          </a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative gradient-bg sparkle-pattern overflow-hidden pt-32 pb-20 lg:pt-44 lg:pb-32 px-5 sm:px-8">
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-brand-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-brand-700 mb-6 border border-brand-100">
            <SparkleIcon className="w-4 h-4" />
            Trusted by 200+ happy homes
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            A Spotless Home,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-sky-500">
              Every Time.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
            Professional cleaning services you can trust. Austin and his team deliver meticulous, reliable cleaning so you can enjoy your space without the hassle.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a href="#quote" className="inline-flex items-center justify-center bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-full text-base font-semibold shadow-xl shadow-brand-500/25 transition-all hover:shadow-2xl hover:shadow-brand-500/30 hover:-translate-y-0.5">
              Get Your Free Quote
              <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </a>
            <a href="#services" className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-full text-base font-semibold border border-gray-200 shadow-sm transition-all hover:-translate-y-0.5">
              View Services
            </a>
          </div>
          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              Licensed & Insured
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              Satisfaction Guaranteed
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              Eco-Friendly Products
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="section-padding bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-brand-500 font-semibold text-sm uppercase tracking-widest">What We Offer</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">Our Cleaning Services</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">From routine upkeep to deep cleans, we handle it all so you don&apos;t have to.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((s) => (
            <div key={s.title} className="group relative bg-gray-50 hover:bg-white rounded-2xl p-8 border border-gray-100 hover:border-brand-200 transition-all hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1">
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-500 mb-5 leading-relaxed">{s.desc}</p>
              <ul className="space-y-2.5">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-600 text-sm">
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
    <section id="pricing" className="section-padding gradient-bg sparkle-pattern">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-brand-500 font-semibold text-sm uppercase tracking-widest">Pricing</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">Transparent, Honest Pricing</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">No hidden fees. Prices depend on home size and condition. Get an exact quote in minutes.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className={`relative bg-white rounded-2xl p-8 border transition-all hover:shadow-xl hover:-translate-y-1 ${plan.popular ? 'border-brand-300 shadow-xl shadow-brand-500/10 scale-[1.02]' : 'border-gray-100 shadow-sm'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-sky-500 text-white text-xs font-bold uppercase tracking-wider px-5 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">{plan.frequency}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-gray-600 text-sm">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#quote"
                className={`block text-center py-3.5 rounded-full font-semibold text-sm transition-all ${
                  plan.popular
                    ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Get a Quote
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-400 text-sm mt-8">
          * Prices vary based on home size, condition, and location. Recurring clients enjoy discounted rates.
        </p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand-100 to-sky-100 flex items-center justify-center overflow-hidden border border-brand-100">
              <div className="text-center px-8">
                <div className="text-7xl mb-4">🧹</div>
                <p className="text-brand-700 font-semibold text-lg">Austin&apos;s Pristine Cleaning</p>
                <p className="text-brand-500 text-sm mt-1">Making spaces shine since day one</p>
              </div>
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-4 sm:right-4 bg-white rounded-xl shadow-xl p-5 border border-gray-100">
              <div className="text-3xl font-extrabold text-brand-600">200+</div>
              <div className="text-gray-500 text-sm">Happy Customers</div>
            </div>
          </div>

          <div>
            <span className="text-brand-500 font-semibold text-sm uppercase tracking-widest">About Us</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">Meet Austin</h2>
            <p className="mt-6 text-gray-600 leading-relaxed text-lg">
              Hi, I&apos;m Austin — the founder and heart behind Austin&apos;s Pristine Cleaning. I started this business with a simple belief: everyone deserves a clean, comfortable space to come home to.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Our team is fully trained, background-checked, and passionate about delivering results that exceed expectations. We use eco-friendly products that are safe for your family and pets, and we treat every home like it&apos;s our own.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { num: '5+', label: 'Years Experience' },
                { num: '100%', label: 'Satisfaction Rate' },
                { num: '200+', label: 'Homes Cleaned' },
                { num: '50+', label: '5-Star Reviews' },
              ].map(stat => (
                <div key={stat.label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                  <div className="text-2xl font-extrabold text-brand-600">{stat.num}</div>
                  <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
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
    <section id="reviews" className="section-padding bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-brand-500 font-semibold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">What Our Clients Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => <StarIcon key={i} />)}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-sky-400 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">Verified Customer</div>
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
  const [form, setForm] = useState({
    name: '', email: '', phone: '', service: '', bedrooms: '', bathrooms: '', message: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <section id="quote" className="section-padding gradient-bg sparkle-pattern">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-100">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Thank You!</h3>
            <p className="text-gray-500 text-lg">Austin will review your request and get back to you within 24 hours with a personalized quote.</p>
            <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', bedrooms: '', bathrooms: '', message: '' }); }} className="mt-6 text-brand-500 hover:text-brand-600 font-semibold text-sm">
              Submit Another Request
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="section-padding gradient-bg sparkle-pattern">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left info */}
          <div className="lg:col-span-2">
            <span className="text-brand-500 font-semibold text-sm uppercase tracking-widest">Free Quote</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">Get Your Personalized Quote</h2>
            <p className="mt-4 text-gray-500 text-lg leading-relaxed">
              Tell us about your space and we&apos;ll get back to you with a detailed, no-obligation quote within 24 hours.
            </p>
            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
                  <ClockIcon />
                </div>
                <span>Response within 24 hours</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
                  <CheckIcon />
                </div>
                <span>No obligation, 100% free</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
                  <SparkleIcon className="w-5 h-5" />
                </div>
                <span>Customized to your needs</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 sm:p-10 shadow-xl border border-gray-100 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input type="text" required value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none text-sm" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="(555) 123-4567" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Type *</label>
                  <select required value={form.service} onChange={e => update('service', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none text-sm bg-white text-gray-700">
                    <option value="">Select a service</option>
                    <option value="standard">Standard Cleaning</option>
                    <option value="deep">Deep Cleaning</option>
                    <option value="move">Move-In / Move-Out</option>
                    <option value="commercial">Commercial Cleaning</option>
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bedrooms</label>
                  <select value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none text-sm bg-white text-gray-700">
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5+">5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bathrooms</label>
                  <select value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none text-sm bg-white text-gray-700">
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4+">4+</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Details</label>
                <textarea rows={4} value={form.message} onChange={e => update('message', e.target.value)} placeholder="Tell us about your space, any special requests, preferred scheduling..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none text-sm resize-none" />
              </div>
              <button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white py-4 rounded-full font-semibold text-base shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5">
                Request My Free Quote
              </button>
              <p className="text-center text-gray-400 text-xs">No spam, no obligation. We&apos;ll only use this to send your quote.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section-padding bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-brand-500 font-semibold text-sm uppercase tracking-widest">Contact</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">Get In Touch</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 max-w-3xl mx-auto">
          {[
            { icon: <PhoneIcon />, label: 'Call Us', value: '(555) 123-4567', href: 'tel:+15551234567' },
            { icon: <MailIcon />, label: 'Email Us', value: 'austin@pristineclean.com', href: 'mailto:austin@pristineclean.com' },
            { icon: <MapPinIcon />, label: 'Service Area', value: 'Greater Metro Area', href: undefined },
          ].map(c => (
            <div key={c.label} className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 mx-auto mb-4">
                {c.icon}
              </div>
              <div className="text-sm text-gray-400 mb-1">{c.label}</div>
              {c.href ? (
                <a href={c.href} className="text-gray-900 font-semibold hover:text-brand-600 transition-colors text-sm">
                  {c.value}
                </a>
              ) : (
                <div className="text-gray-900 font-semibold text-sm">{c.value}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <SparkleIcon className="w-6 h-6 text-brand-400" />
            Austin&apos;s Pristine Cleaning
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
            <a href="#quote" className="hover:text-white transition-colors">Get a Quote</a>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} Austin&apos;s Pristine Cleaning. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ─────────── MAIN PAGE ─────────── */
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
