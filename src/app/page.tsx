'use client';

import { useState, FormEvent } from 'react';

/* ─────────── ICONS ─────────── */
const SparkleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
  </svg>
);

const CheckIcon = ({ className = "w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L7 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
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
    desc: 'Keep your place looking fresh with a regular clean that covers all the basics — every nook and cranny!',
    items: ['Dusting all surfaces', 'Vacuuming & mopping', 'Kitchen & bathroom sanitization', 'Beds made', 'Trash removal'],
    gradient: 'from-blue-500/20 to-cyan-500/20',
    border: 'hover:border-blue-500/50',
    iconBg: 'bg-blue-500/10',
  },
  {
    icon: '✨',
    title: 'Deep Cleaning',
    desc: 'For when your space needs some serious love. We go top-to-bottom and leave no spot untouched.',
    items: ['Inside appliances', 'Laundry washed & folded', 'Bedding washed & changed', 'Baseboards & light fixtures', 'Window sills & blinds', 'Grout & tile scrubbing'],
    gradient: 'from-violet-500/20 to-purple-500/20',
    border: 'hover:border-violet-500/50',
    iconBg: 'bg-violet-500/10',
  },
  {
    icon: '📦',
    title: 'Move-In / Move-Out',
    desc: 'Moving is stressful enough — let us handle the cleaning so you can focus on the fun stuff!',
    items: ['Full interior deep clean', 'Inside all cabinets & closets', 'Appliance cleaning', 'Garage sweep-out'],
    gradient: 'from-orange-500/20 to-amber-500/20',
    border: 'hover:border-orange-500/50',
    iconBg: 'bg-orange-500/10',
  },
  {
    icon: '🏢',
    title: 'Commercial Cleaning',
    desc: 'A clean workspace = happy team. We keep your office spotless so everyone can do their best work.',
    items: ['Office sanitization', 'Break room & restrooms', 'Floor care & vacuuming', 'Custom schedules'],
    gradient: 'from-emerald-500/20 to-teal-500/20',
    border: 'hover:border-emerald-500/50',
    iconBg: 'bg-emerald-500/10',
  },
];

const pricingPlans = [
  {
    name: 'Standard Clean',
    emoji: '🧹',
    price: '$130',
    pricePrefix: 'From',
    frequency: 'per visit',
    features: ['All rooms dusted & wiped', 'Floors vacuumed & mopped', 'Bathrooms sanitized', 'Kitchen cleaned & shined', 'Beds made', 'Trash taken out'],
    popular: false,
    accent: 'blue',
  },
  {
    name: 'Deep Clean',
    emoji: '🫧',
    price: '$230',
    pricePrefix: 'From',
    frequency: 'per visit',
    features: ['Everything in Standard', 'Laundry washed & folded', 'Bedding washed & changed', 'Inside oven & fridge', 'Baseboards & light fixtures', 'Window sills & blinds', 'Grout & tile detailing', 'Cabinet exteriors'],
    popular: true,
    accent: 'violet',
  },
  {
    name: 'Move In/Out',
    emoji: '📦',
    price: '$299',
    pricePrefix: 'From',
    frequency: 'per visit',
    features: ['Everything in Deep Clean', 'Inside all cabinets & drawers', 'Closet interiors', 'Appliance deep clean', 'Garage sweep', 'Wall spot cleaning'],
    popular: false,
    accent: 'amber',
  },
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2 font-extrabold text-xl">
          <span className="text-2xl">🫧</span>
          <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Austin&apos;s Cleaning</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-gray-400 hover:text-white font-medium text-sm transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#quote" className="relative group bg-gradient-to-r from-blue-500 to-violet-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5">
            Free Quote
          </a>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-400 p-2">
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10 px-5 pb-6 pt-2 space-y-1">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-gray-300 hover:text-white font-medium border-b border-white/5">
              {l.label}
            </a>
          ))}
          <a href="#quote" onClick={() => setOpen(false)} className="block text-center bg-gradient-to-r from-blue-500 to-violet-500 text-white px-5 py-3 rounded-full text-sm font-semibold mt-4">
            Free Quote
          </a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center px-5 sm:px-8 bg-black noise">
      {/* Animated gradient blobs */}
      <div className="mesh-blob absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/30 rounded-full blur-[120px]" />
      <div className="mesh-blob-2 absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/25 rounded-full blur-[120px]" />
      <div className="mesh-blob-3 absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto relative z-10 py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-semibold text-violet-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Serving Mississippi &bull; Grenada &bull; Greenwood &bull; Winona &amp; More
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight">
            We Clean.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animated-gradient-text">
              You Relax.
            </span>
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-gray-400 leading-relaxed max-w-xl">
            Life&apos;s too short to spend it scrubbing floors. Let Austin&apos;s Cleaning handle the dirty work while you kick back and enjoy your spotless space.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a href="#quote" className="group inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-violet-500 text-white px-8 py-4 rounded-full text-base font-bold shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-1">
              Get Your Free Quote
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </a>
            <a href="#services" className="inline-flex items-center justify-center glass text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white/10 hover:-translate-y-0.5">
              See What We Do
            </a>
          </div>
          {/* Trust badges */}
          <div className="mt-14 flex flex-wrap gap-3">
            {['Licensed & Insured', 'Satisfaction Guaranteed', 'Eco-Friendly'].map(badge => (
              <div key={badge} className="flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-gray-400">
                <span className="text-emerald-400">✓</span>
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
    <section id="services" className="relative px-5 sm:px-8 py-24 lg:py-32 bg-black noise">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-violet-400 font-bold text-sm uppercase tracking-widest">What We Do</span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white">Our Services 💪</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">From quick touch-ups to full deep cleans — we&apos;ve got a service for every situation.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.title} className={`group relative glass rounded-2xl p-8 ${s.border} transition-all hover:-translate-y-1`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${s.iconBg} text-3xl mb-5`}>
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                <p className="text-gray-400 mb-5 leading-relaxed">{s.desc}</p>
                <ul className="space-y-2.5">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-300 text-sm">
                      <CheckIcon />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="relative px-5 sm:px-8 py-24 lg:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[150px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-violet-400 font-bold text-sm uppercase tracking-widest">Pricing</span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white">No Surprises. Just Clean. 🧼</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">Mississippi-friendly prices, no hidden fees. Get an exact quote in minutes!</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className={`relative glass rounded-2xl p-8 transition-all hover:-translate-y-2 ${plan.popular ? 'glow-violet border-violet-500/30 scale-[1.02]' : 'hover:border-white/20'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs font-bold uppercase tracking-wider px-5 py-1.5 rounded-full shadow-lg">
                  Fan Favorite
                </div>
              )}
              <div className="text-4xl mb-3">{plan.emoji}</div>
              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm text-gray-500">{plan.pricePrefix}</span>
                <span className="text-4xl font-black text-white">{plan.price}</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">{plan.frequency}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-gray-300 text-sm">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#quote" className={`block text-center py-3.5 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 ${
                plan.popular
                  ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40'
                  : 'glass text-white hover:bg-white/10'
              }`}>
                Get a Quote
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-600 text-sm mt-8">
          * Prices vary based on home size, condition, and location. Book recurring and save!
        </p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative px-5 sm:px-8 py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-violet-900/50 via-blue-900/50 to-cyan-900/30 glass flex items-center justify-center overflow-hidden">
              <div className="text-center px-8">
                <div className="text-8xl mb-4">🧹</div>
                <p className="text-white font-bold text-2xl">Austin&apos;s Cleaning</p>
                <p className="text-violet-300 text-sm mt-2">Proudly serving Grenada, MS</p>
              </div>
            </div>
            {/* Floating cards */}
            <div className="absolute -bottom-6 -right-2 sm:right-4 glass rounded-2xl p-5 glow-violet">
              <div className="text-3xl font-black bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">200+</div>
              <div className="text-gray-400 text-sm">Happy Customers</div>
            </div>
            <div className="absolute -top-4 -left-2 sm:left-4 glass rounded-2xl p-4">
              <div className="flex gap-0.5 mb-1">
                {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
              </div>
              <div className="text-gray-400 text-xs font-medium">5-Star Rated</div>
            </div>
          </div>

          <div>
            <span className="text-violet-400 font-bold text-sm uppercase tracking-widest">About Us</span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white">Hey, I&apos;m Austin! 👋</h2>
            <p className="mt-6 text-gray-400 leading-relaxed text-lg">
              I started Austin&apos;s Cleaning right here in Grenada, Mississippi because I believe everyone deserves to come home to a clean, fresh space — without breaking the bank or lifting a finger.
            </p>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Our crew is trained, background-checked, and genuinely cares about doing a great job. We use eco-friendly products that are safe for your family and pets, and we treat every home like our own. Your space is in good hands!
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { num: '5+', label: 'Years Experience', emoji: '💪' },
                { num: '100%', label: 'Satisfaction Rate', emoji: '🎯' },
                { num: '200+', label: 'Homes Cleaned', emoji: '🏠' },
                { num: '50+', label: '5-Star Reviews', emoji: '⭐' },
              ].map(stat => (
                <div key={stat.label} className="glass rounded-2xl p-4 text-center hover:bg-white/10 transition-all">
                  <div className="text-2xl mb-1">{stat.emoji}</div>
                  <div className="text-2xl font-black text-white">{stat.num}</div>
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
    <section id="reviews" className="relative px-5 sm:px-8 py-24 lg:py-32">
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[400px] bg-cyan-600/10 rounded-full blur-[150px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-violet-400 font-bold text-sm uppercase tracking-widest">Reviews</span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white">Don&apos;t Just Take Our Word For It 😄</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-8 hover:bg-white/10 transition-all hover:-translate-y-1">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => <StarIcon key={i} />)}
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.location}</div>
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

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm text-white placeholder-gray-500";
  const labelClass = "block text-sm font-semibold text-gray-300 mb-1.5";

  if (submitted) {
    return (
      <section id="quote" className="relative px-5 sm:px-8 py-24 lg:py-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[150px]" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="glass rounded-3xl p-12 glow-violet">
            <div className="text-7xl mb-4">🎉</div>
            <h3 className="text-2xl font-black text-white mb-3">Woohoo! You&apos;re All Set!</h3>
            <p className="text-gray-400 text-lg">Austin will check out your request and hit you back within 24 hours with a personalized quote.</p>
            <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', bedrooms: '', bathrooms: '', message: '' }); }} className="mt-6 text-violet-400 hover:text-violet-300 font-semibold text-sm">
              Submit Another Request
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="relative px-5 sm:px-8 py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <span className="text-violet-400 font-bold text-sm uppercase tracking-widest">Free Quote</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">Let&apos;s Get You a Quote! 📋</h2>
            <p className="mt-4 text-gray-500 text-lg leading-relaxed">
              Tell us about your space and we&apos;ll send you a detailed, no-strings-attached quote within 24 hours. Easy peasy!
            </p>
            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-4 text-gray-400">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <ClockIcon />
                </div>
                <span>Response within 24 hours</span>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <span>No obligation, 100% free</span>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <SparkleIcon className="w-5 h-5" />
                </div>
                <span>Customized to your needs</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 sm:p-10 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input type="text" required value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" className={inputClass} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="(662) 996-7137" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Service Type *</label>
                  <select required value={form.service} onChange={e => update('service', e.target.value)} className={inputClass}>
                    <option value="">Pick one!</option>
                    <option value="standard">Standard Cleaning</option>
                    <option value="deep">Deep Cleaning</option>
                    <option value="move">Move-In / Move-Out</option>
                    <option value="commercial">Commercial Cleaning</option>
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Bedrooms</label>
                  <select value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5+">5+</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Bathrooms</label>
                  <select value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4+">4+</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Anything else we should know?</label>
                <textarea rows={4} value={form.message} onChange={e => update('message', e.target.value)} placeholder="Tell us about your space, special requests, preferred days..." className={`${inputClass} resize-none`} />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white py-4 rounded-full font-bold text-base shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5">
                Send It! ✨
              </button>
              <p className="text-center text-gray-600 text-xs">No spam, no pressure. We&apos;ll only reach out about your quote.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative px-5 sm:px-8 py-24 lg:py-32">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-violet-400 font-bold text-sm uppercase tracking-widest">Contact</span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white">Let&apos;s Chat! 💬</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: <PhoneIcon />, label: 'Call Us', value: '(662) 996-7137', href: 'tel:+16629967137', color: 'text-blue-400 bg-blue-500/10' },
            { icon: <MailIcon />, label: 'Email Us', value: 'austin@austinscleaning.com', href: 'mailto:austin@austinscleaning.com', color: 'text-violet-400 bg-violet-500/10' },
            { icon: <MapPinIcon />, label: 'Service Area', value: 'Grenada, MS & Surrounding Areas', href: undefined, color: 'text-amber-400 bg-amber-500/10' },
          ].map(c => (
            <div key={c.label} className="text-center glass rounded-2xl p-6 hover:bg-white/10 transition-all hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-full ${c.color} flex items-center justify-center mx-auto mb-4`}>
                {c.icon}
              </div>
              <div className="text-sm text-gray-500 mb-1">{c.label}</div>
              {c.href ? (
                <a href={c.href} className="text-white font-semibold hover:text-violet-400 transition-colors text-sm">
                  {c.value}
                </a>
              ) : (
                <div className="text-white font-semibold text-sm">{c.value}</div>
              )}
            </div>
          ))}
        </div>

        {/* Areas served */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-4">Proudly serving homes and businesses across Mississippi</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Grenada', 'Greenwood', 'Winona', 'Carrollton', 'Duck Hill', 'Holcomb', 'Gore Springs', 'Vaiden'].map(city => (
              <span key={city} className="glass px-4 py-1.5 rounded-full text-xs text-gray-400 font-medium">
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <span className="text-xl">🫧</span>
            Austin&apos;s Cleaning
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {['Services', 'Pricing', 'About', 'Reviews'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-gray-500 hover:text-white transition-colors">{link}</a>
            ))}
            <a href="#quote" className="text-gray-500 hover:text-white transition-colors">Get a Quote</a>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <span>&copy; {new Date().getFullYear()} Austin&apos;s Cleaning. All rights reserved.</span>
          <span>Grenada, Mississippi & Surrounding Areas</span>
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
