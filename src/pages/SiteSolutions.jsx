import { useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'

const NAVY = '#1b3a72'
const NAVY_DEEP = '#0f2450'
const SKY = '#2da8e0'
const SKY_LIGHT = '#8fd3f4'
const SILVER = '#8a8d93'
const MIST = '#f3f8fc'
const INK = '#14203a'

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('SBDC Building, 2 Columbus Rd, Verulam, KwaZulu-Natal, South Africa')

const stats = [
  { big: '1–2', small: 'weeks for a service website' },
  { big: '2–4', small: 'weeks for an e-commerce store' },
  { big: '24/7', small: 'support, every day' },
  { big: 'SSL', small: 'security on every site we host' },
]

const segments = [
  { level: 1, title: 'Small Businesses', desc: 'Scalable solutions for growing companies.' },
  { level: 2, title: 'Medium Enterprises', desc: 'Robust systems for established operations.' },
  { level: 3, title: 'Large Corporations', desc: 'Enterprise-grade infrastructure at scale.' },
]

const services = [
  { name: 'Web Development', desc: 'Custom websites and web applications built for performance and scale.' },
  { name: 'E-commerce', desc: 'Online stores with secure payments, ready to take real orders.' },
  { name: 'Mobile Applications', desc: 'Native and cross-platform apps designed around how your business actually works.' },
  { name: 'Custom Software', desc: 'Business systems built to fit the way you operate, not the other way round.' },
  { name: 'System Architecture', desc: 'Solid technical foundations that grow with your business instead of breaking under it.' },
  { name: 'Integrations', desc: 'Seamless connections between your tools, data, and third-party services.' },
]

const hosting = [
  { title: 'Hosting', desc: 'Fast, reliable hosting for your website or system, billed monthly.' },
  { title: 'Domains', desc: 'We register and manage your domain name so you never have to chase renewals.' },
  { title: 'Custom business email', desc: 'Professional email addresses on your own domain.' },
  { title: 'SSL security', desc: 'SSL certificates keep your site secure and trusted by visitors and browsers.' },
  { title: 'Support and maintenance plans', desc: 'Monthly plans tailored to what you need, so your site stays secure, fast and up to date.' },
  { title: '24/7 support', desc: 'Real support from the team that built it, not a ticket queue.' },
]

const process = [
  { n: '01', title: 'Discovery', desc: 'We learn your business, your problem, and what success actually looks like.' },
  { n: '02', title: 'Design', desc: 'Architecture and interface planning, so the build starts on solid ground.' },
  { n: '03', title: 'Build', desc: 'Development with regular check-ins, not a black box until the big reveal.' },
  { n: '04', title: 'Launch', desc: 'A controlled, tested rollout, not a risky flip-the-switch moment.' },
  { n: '05', title: 'Support', desc: 'Ongoing hosting, maintenance and support once you are live.' },
]

const pricingSteps = [
  { n: '1', title: 'Free consultation', desc: 'Discuss your project requirements with our team.' },
  { n: '2', title: 'Custom proposal', desc: 'Receive a detailed quote tailored to your needs.' },
  { n: '3', title: 'Flexible payment', desc: 'Pay in installments that work for you.' },
]

const portfolio = [
  {
    name: 'Dirose Enterprise',
    url: 'https://www.diroseenterprise.co.za',
    desc: 'A professional website for an underwear manufacturer, showcasing their range and making it easy for retailers and customers to get in touch.',
  },
  {
    name: 'Distinct Embroidery',
    url: 'https://www.distinctembroidery.co.za',
    desc: 'A website for an embroidery and printing company serving chainstores, presenting their services and 20+ years of experience.',
  },
  {
    name: 'R&R Agencies',
    url: 'https://www.rragencies.co.za',
    desc: 'The main company website covering every division, with a contact form that sends enquiries straight to email.',
  },
  {
    name: 'R&R Sports and Lifestyle',
    url: 'https://www.randragencies.online',
    desc: 'A full e-commerce store for a sport and lifestyle clothing brand, with secure online payments and a WhatsApp chatbot.',
  },
  {
    name: 'Astorra',
    url: 'https://www.astorra.co.za',
    desc: 'A modular business management platform where companies install only the tools they need, from a free tier up to enterprise.',
  },
]

const faqs = [
  {
    q: 'How long does a website take?',
    a: 'A service website usually takes 1 to 2 weeks and an e-commerce store 2 to 4 weeks. Custom software depends on scope, and we agree a timeline with you in your proposal.',
  },
  {
    q: 'What does hosting include?',
    a: 'Hosting, your domain, custom business email and an SSL certificate, all billed monthly.',
  },
  {
    q: 'Do I own my website?',
    a: 'We own the website and its code, unless you and we agree a price for you to purchase the code. Ask us and we will quote it.',
  },
  {
    q: 'What do the monthly support and maintenance plans cover?',
    a: 'Plans are tailored to what you need, so the price varies from client to client. Support is available 24/7.',
  },
  {
    q: 'Can you build custom software, not just websites?',
    a: 'Yes. We build custom business software and apps designed around how your company works.',
  },
  {
    q: 'How does payment work?',
    a: 'Every project gets a custom quote based on your requirements, timeline and scope. We also offer installments so you can spread the cost.',
  },
]

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;700&display=swap');

.ss {
  --navy: ${NAVY};
  --navy-deep: ${NAVY_DEEP};
  --sky: ${SKY};
  --sky-light: ${SKY_LIGHT};
  --silver: ${SILVER};
  --mist: ${MIST};
  --ink: ${INK};
  --muted: rgba(20, 32, 58, 0.68);
  --muted-light: rgba(232, 242, 252, 0.74);
  background: #fff;
  color: var(--ink);
  font-family: 'DM Sans', system-ui, sans-serif;
  line-height: 1.65;
  overflow-x: clip;
  min-height: 100vh;
  position: relative;
}
.ss *, .ss *::before, .ss *::after { box-sizing: border-box; }
.ss h1, .ss h2, .ss h3, .ss h4, .ss p, .ss ul, .ss address { margin: 0; padding: 0; }
.ss ul { list-style: none; }
.ss address { font-style: normal; }
.ss a { color: inherit; text-decoration: none; }
.ss a:focus-visible, .ss button:focus-visible { outline: 2px solid var(--sky); outline-offset: 4px; border-radius: 8px; }

.ss-bar {
  position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 70; transform-origin: 0 50%;
  background: linear-gradient(90deg, var(--navy), var(--sky), var(--sky-light));
  box-shadow: 0 0 14px rgba(45, 168, 224, 0.7);
}
.ss-back {
  position: fixed; top: 18px; left: 22px; z-index: 60; font-weight: 700; font-size: 0.92rem;
  padding: 9px 18px; border-radius: 999px; color: var(--navy);
  background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(14px);
  border: 1px solid rgba(27, 58, 114, 0.28); box-shadow: 0 8px 24px rgba(15, 36, 80, 0.12);
  transition: transform 250ms ease, border-color 250ms ease;
}
.ss-back:hover { transform: translateX(-3px); border-color: var(--sky); }

.ss-hero {
  position: relative; min-height: 100vh; display: grid; align-items: center; overflow: hidden; isolation: isolate;
  padding: 130px clamp(20px, 6vw, 80px) 100px;
  background:
    radial-gradient(700px circle at 85% 20%, rgba(45, 168, 224, 0.16), transparent 65%),
    radial-gradient(600px circle at 5% 90%, rgba(27, 58, 114, 0.1), transparent 65%),
    linear-gradient(180deg, #fff 0%, var(--mist) 100%);
}
.ss-circuit { position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; pointer-events: none; opacity: 0.55; }
.ss-circuit path { fill: none; stroke: var(--sky); stroke-width: 1.5; stroke-dasharray: 8 10; animation: ss-flow 9s linear infinite; }
.ss-circuit circle { fill: #fff; stroke: var(--sky); stroke-width: 2; }
@keyframes ss-flow { to { stroke-dashoffset: -180; } }
.ss-hero-grid { max-width: 1240px; width: 100%; margin: 0 auto; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: clamp(28px, 6vw, 80px); align-items: center; }
.ss-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--sky); }
.ss-eyebrow::before { content: ''; width: 34px; height: 2px; background: var(--sky); }
.ss-title { margin-top: 1rem; font-family: 'Sora', sans-serif; font-weight: 800; font-size: clamp(2.8rem, 7vw, 5.6rem); line-height: 1.02; letter-spacing: -0.03em; color: var(--navy); }
.ss-title span { display: block; color: var(--silver); }
.ss-slogan { margin-top: 1.3rem; font-family: 'Sora', sans-serif; font-weight: 600; font-size: clamp(1.15rem, 2.4vw, 1.7rem); color: var(--ink); }
.ss-slogan b { color: var(--sky); font-weight: 700; }
.ss-lede { margin-top: 1.1rem; max-width: 34rem; font-size: clamp(1rem, 1.6vw, 1.15rem); color: var(--muted); }
.ss-cta-row { margin-top: 2.2rem; display: flex; gap: 14px; flex-wrap: wrap; }
.ss-btn {
  display: inline-flex; align-items: center; justify-content: center; padding: 14px 30px; border-radius: 999px;
  font-family: 'Sora', sans-serif; font-weight: 600; font-size: 0.98rem; cursor: pointer; border: 1px solid transparent;
  transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms ease, background 250ms ease;
}
.ss-btn:hover { transform: translateY(-3px); }
.ss-btn-navy { background: linear-gradient(120deg, var(--navy), #2a5299); color: #fff; box-shadow: 0 10px 30px rgba(27, 58, 114, 0.32); }
.ss-btn-navy:hover { box-shadow: 0 16px 40px rgba(27, 58, 114, 0.45); }
.ss-btn-line { color: var(--navy); border-color: rgba(27, 58, 114, 0.4); background: rgba(255, 255, 255, 0.6); }
.ss-btn-line:hover { background: #fff; border-color: var(--sky); }
.ss-btn-sky { background: linear-gradient(120deg, var(--sky), var(--sky-light)); color: var(--navy-deep); box-shadow: 0 10px 30px rgba(45, 168, 224, 0.35); }
.ss-btn-sky:hover { box-shadow: 0 16px 40px rgba(45, 168, 224, 0.5); }
.ss-btn-ghost-light { color: #fff; border-color: rgba(255, 255, 255, 0.5); background: transparent; }
.ss-btn-ghost-light:hover { background: rgba(255, 255, 255, 0.12); }
.ss-logo-card {
  position: relative; padding: clamp(20px, 3vw, 36px); border-radius: 36px; background: #fff;
  border: 1px solid rgba(27, 58, 114, 0.12); box-shadow: 0 40px 90px rgba(15, 36, 80, 0.18);
}
.ss-logo-card::before {
  content: ''; position: absolute; inset: -14px; z-index: -1; border-radius: 44px;
  border: 1px dashed rgba(45, 168, 224, 0.6);
}
.ss-logo-card img { display: block; width: 100%; height: auto; }
.ss-scroll { position: absolute; bottom: 24px; left: 50%; translate: -50% 0; color: var(--navy); font-weight: 700; font-size: 0.9rem; }

.ss-stats { background: var(--navy); color: #fff; }
.ss-stats-in { max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); }
.ss-stat { padding: 34px clamp(16px, 3vw, 40px); border-right: 1px solid rgba(143, 211, 244, 0.22); }
.ss-stat:last-child { border-right: 0; }
.ss-stat strong { display: block; font-family: 'Sora', sans-serif; font-weight: 700; font-size: clamp(1.9rem, 4vw, 2.9rem); line-height: 1.1; color: var(--sky-light); }
.ss-stat span { color: var(--muted-light); font-size: 0.95rem; }

.ss-section { max-width: 1240px; margin: 0 auto; padding: clamp(80px, 11vw, 140px) clamp(20px, 5vw, 64px); }
.ss-h2 { font-family: 'Sora', sans-serif; font-weight: 700; font-size: clamp(2rem, 4.6vw, 3.3rem); line-height: 1.1; letter-spacing: -0.02em; color: var(--navy); max-width: 18ch; }
.ss-h2::after { content: ''; display: block; margin-top: 1.1rem; width: 84px; height: 4px; border-radius: 4px; background: linear-gradient(90deg, var(--navy), var(--sky)); }
.ss-sub { margin-top: 1.2rem; color: var(--muted); max-width: 36rem; }
.ss-tint { background: var(--mist); }
.ss-navy { background: linear-gradient(160deg, var(--navy), var(--navy-deep)); color: #fff; position: relative; overflow: hidden; }
.ss-navy .ss-h2 { color: #fff; }
.ss-navy .ss-h2::after { background: linear-gradient(90deg, var(--sky), var(--sky-light)); }
.ss-navy .ss-sub { color: var(--muted-light); }

.ss-serve { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 3rem; }
.ss-serve-card {
  padding: 32px 28px; border-radius: 26px; background: #fff; border: 1px solid rgba(27, 58, 114, 0.14);
  box-shadow: 0 18px 50px rgba(15, 36, 80, 0.06);
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms ease, box-shadow 300ms ease;
}
.ss-serve-card:hover { transform: translateY(-6px); border-color: var(--sky); box-shadow: 0 26px 60px rgba(45, 168, 224, 0.18); }
.ss-bars { display: flex; align-items: flex-end; gap: 5px; height: 34px; margin-bottom: 1.2rem; }
.ss-bars i { width: 10px; border-radius: 3px; background: rgba(27, 58, 114, 0.15); }
.ss-bars i:nth-child(1) { height: 30%; }
.ss-bars i:nth-child(2) { height: 65%; }
.ss-bars i:nth-child(3) { height: 100%; }
.ss-bars i.on { background: linear-gradient(180deg, var(--sky), var(--navy)); }
.ss-serve-card h3 { font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1.3rem; color: var(--navy); }
.ss-serve-card p { margin-top: 0.4rem; color: var(--muted); }

.ss-services { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 3rem; }
.ss-service {
  position: relative; padding: 30px 26px 28px; border-radius: 24px; background: #fff; overflow: hidden;
  border: 1px solid rgba(27, 58, 114, 0.14);
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms ease;
}
.ss-service::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(180deg, var(--sky), var(--navy)); }
.ss-service:hover { transform: translateY(-5px); border-color: var(--sky); }
.ss-service h3 { font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1.2rem; color: var(--navy); }
.ss-service p { margin-top: 0.5rem; color: var(--muted); }

.ss-host { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(28px, 6vw, 90px); align-items: start; }
.ss-host-head { position: sticky; top: 110px; }
.ss-host-list { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.ss-host-item {
  padding: 26px 24px; border-radius: 22px; background: rgba(255, 255, 255, 0.07); backdrop-filter: blur(10px);
  border: 1px solid rgba(143, 211, 244, 0.26);
  transition: border-color 300ms ease, background 300ms ease, transform 300ms ease;
}
.ss-host-item:hover { border-color: var(--sky-light); background: rgba(255, 255, 255, 0.11); transform: translateY(-4px); }
.ss-host-item h3 { font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1.1rem; color: var(--sky-light); }
.ss-host-item p { margin-top: 0.45rem; color: var(--muted-light); font-size: 0.97rem; }
.ss-note { margin-top: 1.4rem; color: var(--muted-light); font-size: 0.95rem; }

.ss-steps { position: relative; display: grid; grid-template-columns: repeat(5, 1fr); gap: 18px; margin-top: 3.4rem; }
.ss-steps::before {
  content: ''; position: absolute; left: 0; right: 0; top: 27px; height: 2px;
  background: repeating-linear-gradient(90deg, rgba(45, 168, 224, 0.7) 0 10px, transparent 10px 18px);
}
.ss-step { position: relative; padding-top: 70px; }
.ss-step-dot {
  position: absolute; top: 12px; left: 0; width: 32px; height: 32px; border-radius: 50%; background: #fff;
  border: 3px solid var(--sky); box-shadow: 0 0 0 6px rgba(45, 168, 224, 0.15);
}
.ss-step-n { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 2.6rem; line-height: 1; color: transparent; -webkit-text-stroke: 1.5px rgba(27, 58, 114, 0.5); }
.ss-step h3 { margin-top: 0.5rem; font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1.15rem; color: var(--navy); }
.ss-step p { margin-top: 0.35rem; color: var(--muted); font-size: 0.96rem; }

.ss-price { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 3rem; }
.ss-price-card { position: relative; padding: 34px 28px; border-radius: 26px; background: #fff; border: 1px solid rgba(27, 58, 114, 0.14); }
.ss-price-n {
  display: grid; place-items: center; width: 44px; height: 44px; margin-bottom: 1rem; border-radius: 50%;
  font-family: 'Sora', sans-serif; font-weight: 700; color: #fff; background: linear-gradient(135deg, var(--navy), var(--sky));
}
.ss-price-card h3 { font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1.25rem; color: var(--navy); }
.ss-price-card p { margin-top: 0.4rem; color: var(--muted); }
.ss-price-note { margin-top: 2rem; max-width: 46rem; color: var(--muted); }

.ss-work { margin-top: 3rem; border-top: 1px solid rgba(27, 58, 114, 0.16); }
.ss-work-row {
  display: grid; grid-template-columns: 0.9fr 1.6fr auto; gap: 24px; align-items: center; padding: 28px 6px;
  border-bottom: 1px solid rgba(27, 58, 114, 0.16); transition: padding-left 300ms ease, background 300ms ease;
}
.ss-work-row:hover { padding-left: 18px; background: linear-gradient(90deg, rgba(45, 168, 224, 0.08), transparent); }
.ss-work-row h3 { font-family: 'Sora', sans-serif; font-weight: 600; font-size: clamp(1.2rem, 2.2vw, 1.6rem); color: var(--navy); }
.ss-work-row p { color: var(--muted); }
.ss-work-arrow { font-family: 'Sora', sans-serif; font-weight: 600; color: var(--sky); white-space: nowrap; }

.ss-acc { margin-top: 3rem; border-top: 1px solid rgba(27, 58, 114, 0.18); max-width: 860px; }
.ss-acc-row { border-bottom: 1px solid rgba(27, 58, 114, 0.18); }
.ss-acc-btn {
  width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 24px 4px;
  background: none; border: 0; cursor: pointer; text-align: left; color: var(--navy);
  font-family: 'Sora', sans-serif; font-weight: 600; font-size: clamp(1.05rem, 2vw, 1.3rem);
  transition: color 250ms ease, padding 250ms ease;
}
.ss-acc-btn:hover { color: var(--sky); padding-left: 12px; }
.ss-acc-btn i { font-style: normal; font-size: 1.7rem; color: var(--sky); transition: transform 300ms ease; }
.ss-acc-btn[aria-expanded='true'] i { transform: rotate(45deg); }
.ss-acc-body { overflow: hidden; }
.ss-acc-body p { padding: 0 4px 26px; max-width: 46rem; color: var(--muted); }

.ss-contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 3rem; }
.ss-contact-item {
  display: flex; flex-direction: column; gap: 6px; padding: 28px; border-radius: 24px;
  background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(143, 211, 244, 0.28);
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms ease, background 300ms ease;
}
a.ss-contact-item:hover { transform: translateY(-5px); border-color: var(--sky-light); background: rgba(255, 255, 255, 0.12); }
.ss-contact-item h3 { font-size: 0.82rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--sky-light); }
.ss-contact-item span, .ss-contact-item address { font-size: 1.05rem; overflow-wrap: anywhere; }

.ss-footer { background: var(--navy-deep); color: var(--muted-light); padding: 40px clamp(20px, 5vw, 64px) 48px; }
.ss-footer-in { max-width: 1240px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px 32px; font-size: 0.92rem; }
.ss-footer-links { display: flex; flex-wrap: wrap; gap: 8px 24px; }
.ss-footer-links a:hover { color: var(--sky-light); }

@media (max-width: 900px) {
  .ss-hero-grid, .ss-host { grid-template-columns: 1fr; }
  .ss-logo-card { max-width: 380px; }
  .ss-host-head { position: static; }
  .ss-stats-in { grid-template-columns: 1fr 1fr; }
  .ss-stat:nth-child(2) { border-right: 0; }
  .ss-stat:nth-child(-n + 2) { border-bottom: 1px solid rgba(143, 211, 244, 0.22); }
  .ss-serve, .ss-services, .ss-price, .ss-contact-grid { grid-template-columns: 1fr; }
  .ss-host-list { grid-template-columns: 1fr; }
  .ss-steps { grid-template-columns: 1fr; gap: 26px; }
  .ss-steps::before { left: 15px; right: auto; top: 0; bottom: 0; width: 2px; height: auto; background: repeating-linear-gradient(180deg, rgba(45, 168, 224, 0.7) 0 10px, transparent 10px 18px); }
  .ss-step { padding: 0 0 0 56px; }
  .ss-step-dot { top: 4px; }
  .ss-work-row { grid-template-columns: 1fr; gap: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .ss *, .ss *::before { transition-duration: 0.01ms !important; }
  .ss-circuit path { animation: none; }
}
`

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Circuit() {
  return (
    <svg className="ss-circuit" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d="M1200 140 H1010 L960 190 H820" />
      <path d="M1200 260 H1080 L1030 310 H900 L860 350" />
      <path d="M1200 420 H1040 L990 470 H760" />
      <path d="M1200 600 H1110 L1060 650 H940" />
      <path d="M0 640 H160 L210 590 H340" />
      <path d="M0 720 H120 L170 770 H300" />
      <circle cx="820" cy="190" r="7" />
      <circle cx="860" cy="350" r="7" />
      <circle cx="760" cy="470" r="7" />
      <circle cx="940" cy="650" r="7" />
      <circle cx="340" cy="590" r="7" />
      <circle cx="300" cy="770" r="7" />
    </svg>
  )
}

function Hero() {
  return (
    <section className="ss-hero">
      <Circuit />
      <div className="ss-hero-grid">
        <div>
          <motion.span className="ss-eyebrow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            A division of R&amp;R Agencies
          </motion.span>
          <motion.h1
            className="ss-title"
            initial={{ opacity: 0, y: 34, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            R&amp;R
            <span>Site Solutions</span>
          </motion.h1>
          <motion.p className="ss-slogan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}>
            We Build. We Host. <b>You Grow.</b>
          </motion.p>
          <motion.p className="ss-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}>
            Websites, e-commerce stores, mobile apps and custom software, with hosting, domains, business email and round-the-clock support to keep it all running.
          </motion.p>
          <motion.div className="ss-cta-row" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8 }}>
            <a href="mailto:info@rragencies.co.za" className="ss-btn ss-btn-navy">Get a free quote</a>
            <a href="#work" className="ss-btn ss-btn-line">See our work</a>
          </motion.div>
        </div>
        <motion.div className="ss-logo-card" initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <img src="/logos/site-solutions.png" alt="R&R Site Solutions logo" />
        </motion.div>
      </div>
      <motion.div className="ss-scroll" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
        scroll ↓
      </motion.div>
    </section>
  )
}

function Stats() {
  return (
    <div className="ss-stats">
      <div className="ss-stats-in">
        {stats.map((s, i) => (
          <motion.div
            className="ss-stat"
            key={s.big}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <strong>{s.big}</strong>
            <span>{s.small}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Serve() {
  return (
    <section className="ss-section">
      <Reveal>
        <h2 className="ss-h2">Who we serve</h2>
      </Reveal>
      <div className="ss-serve">
        {segments.map((s, i) => (
          <motion.div
            className="ss-serve-card"
            key={s.title}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className="ss-bars" aria-hidden="true">
              {[1, 2, 3].map(n => (
                <i key={n} className={n <= s.level ? 'on' : ''} />
              ))}
            </div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Services() {
  return (
    <div className="ss-tint">
      <section className="ss-section">
        <Reveal>
          <h2 className="ss-h2">What we build</h2>
        </Reveal>
        <div className="ss-services">
          {services.map((s, i) => (
            <motion.div
              className="ss-service"
              key={s.name}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
            >
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Hosting() {
  return (
    <div className="ss-navy">
      <section className="ss-section">
        <div className="ss-host">
          <div className="ss-host-head">
            <Reveal>
              <h2 className="ss-h2">We host it too</h2>
              <p className="ss-sub">Once your site is live, we keep it fast, secure and online, so you can get on with running your business.</p>
              <p className="ss-note">Hosting is billed monthly. Support and maintenance plans are tailored to what you need.</p>
            </Reveal>
          </div>
          <div className="ss-host-list">
            {hosting.map((h, i) => (
              <motion.div
                className="ss-host-item"
                key={h.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: (i % 2) * 0.08 }}
              >
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function Process() {
  return (
    <section className="ss-section">
      <Reveal>
        <h2 className="ss-h2">Our process</h2>
      </Reveal>
      <div className="ss-steps">
        {process.map((s, i) => (
          <motion.div
            className="ss-step"
            key={s.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: i * 0.08 }}
          >
            <span className="ss-step-dot" />
            <div className="ss-step-n">{s.n}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <div className="ss-tint">
      <section className="ss-section">
        <Reveal>
          <h2 className="ss-h2">Transparent pricing</h2>
          <p className="ss-sub">Every project is unique, so we provide a customised quote based on your requirements, timeline and scope.</p>
        </Reveal>
        <div className="ss-price">
          {pricingSteps.map((s, i) => (
            <motion.div
              className="ss-price-card"
              key={s.title}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              <span className="ss-price-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
        <p className="ss-price-note">A service website typically takes 1 to 2 weeks and an e-commerce store 2 to 4 weeks.</p>
      </section>
    </div>
  )
}

function Work() {
  return (
    <section className="ss-section" id="work">
      <Reveal>
        <h2 className="ss-h2">Our work</h2>
      </Reveal>
      <div className="ss-work">
        {portfolio.map((p, i) => (
          <motion.a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="ss-work-row"
            key={p.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <h3>{p.name}</h3>
            <p>{p.desc}</p>
            <span className="ss-work-arrow">Visit site →</span>
          </motion.a>
        ))}
      </div>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="ss-tint">
      <section className="ss-section">
        <Reveal>
          <h2 className="ss-h2">Common questions</h2>
        </Reveal>
        <div className="ss-acc">
          {faqs.map((f, i) => (
            <div className="ss-acc-row" key={f.q}>
              <button className="ss-acc-btn" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                {f.q}
                <i>+</i>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    className="ss-acc-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Contact() {
  return (
    <div className="ss-navy" id="contact">
      <section className="ss-section">
        <Reveal>
          <h2 className="ss-h2">Ready to launch your digital future?</h2>
          <div className="ss-cta-row">
            <a href="mailto:info@rragencies.co.za" className="ss-btn ss-btn-sky">Get a free quote</a>
            <a href="https://wa.me/27813365266" target="_blank" rel="noreferrer" className="ss-btn ss-btn-ghost-light">WhatsApp us</a>
          </div>
        </Reveal>
        <div className="ss-contact-grid">
          <a href="tel:0813365266" className="ss-contact-item">
            <h3>Call</h3>
            <span>081 336 5266</span>
          </a>
          <a href="mailto:info@rragencies.co.za" className="ss-contact-item">
            <h3>Email</h3>
            <span>info@rragencies.co.za</span>
          </a>
          <a href="https://wa.me/27813365266" target="_blank" rel="noreferrer" className="ss-contact-item">
            <h3>WhatsApp</h3>
            <span>Message us on 081 336 5266</span>
          </a>
          <div className="ss-contact-item">
            <h3>Support</h3>
            <span>Available 24/7</span>
          </div>
          <a href={MAPS_URL} target="_blank" rel="noreferrer" className="ss-contact-item">
            <h3>Visit</h3>
            <address>
              SBDC Building, Unit 13<br />
              2 Columbus Rd, Verulam<br />
              KwaZulu-Natal, South Africa
            </address>
          </a>
        </div>
      </section>
    </div>
  )
}

export default function SiteSolutions() {
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.4 })

  return (
    <div className="ss">
      <style>{STYLES}</style>
      <motion.div className="ss-bar" style={{ scaleX: bar }} />
      <Link to="/" className="ss-back">← Back to hub</Link>

      <main>
        <Hero />
        <Stats />
        <Serve />
        <Services />
        <Hosting />
        <Process />
        <Pricing />
        <Work />
        <Faq />
        <Contact />
      </main>

      <footer className="ss-footer">
        <div className="ss-footer-in">
          <span>© 2026 R&amp;R Site Solutions, a division of R&amp;R Agencies. All rights reserved.</span>
          <div className="ss-footer-links">
            <a href="mailto:info@rragencies.co.za">info@rragencies.co.za</a>
            <Link to="/">R&amp;R Agencies</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}