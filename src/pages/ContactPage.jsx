import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, MapPin, GraduationCap, Send, ArrowRight, ArrowUpRight, Heart, CheckCircle } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import Footer from '../components/Footer';

function FadeBlock({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children, dot }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-slate-600 dark:text-slate-500">
        {children}
      </span>
    </div>
  );
}

const CONTACT_CARDS = [
  {
    icon: Mail,
    title: 'Email',
    lines: ['pulse@iiuc.ac.bd', 'oslab@iiuc.ac.bd'],
    sub: 'We reply within 48 hours',
  },
  {
    icon: MapPin,
    title: 'Location',
    lines: ['CSE Department, IIUC', 'Kumira, Chittagong 4318'],
    sub: 'Bangladesh',
  },
  {
    icon: GraduationCap,
    title: 'Lab',
    lines: ['Operating Systems Lab', 'Room 405, Academic Building'],
    sub: 'Mon–Fri, 9:00 AM – 5:00 PM',
  },
];

function EkgDivider() {
  return (
    <div className="border-y border-slate-200 dark:border-slate-700 bg-white dark:bg-[#16212c] overflow-hidden">
      <svg viewBox="0 0 1200 90" width="100%" height="90" preserveAspectRatio="none" aria-hidden="true">
        <polyline points="0,45 220,45 250,45 268,10 286,80 304,45 340,45 420,45 448,45 466,20 484,70 502,45 540,45 1200,45" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1.5" />
        <polyline points="0,45 220,45 250,45 268,10 286,80 304,45 340,45 420,45 448,45 466,20 484,70 502,45 540,45 1200,45" fill="none" className="stroke-brand-light dark:stroke-brand-dark animate-ekg-sweep [stroke-dasharray:18_400]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="100" />
      </svg>
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-20 sm:pt-28 pb-12 w-full">
        <FadeBlock>
          <Eyebrow>Contact</Eyebrow>
        </FadeBlock>
        <FadeBlock delay={100}>
          <h1 className="m-0 font-heading font-normal text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-[4.25rem] lg:leading-[1.03] tracking-tight text-slate-900 dark:text-slate-100 mb-5">
            Get in touch
          </h1>
        </FadeBlock>
        <FadeBlock delay={200}>
          <p className="m-0 max-w-2xl text-slate-700 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            Have a question about the project, the algorithms, or how to contribute? We&apos;d love to hear from you — whether you&apos;re a student, a researcher, or someone who just cares about better emergency care.
          </p>
        </FadeBlock>
      </section>

      <EkgDivider />

      {/* Contact Info */}
      <section className="max-w-6xl mx-auto px-5 py-16 sm:py-24 w-full">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTACT_CARDS.map((c, i) => (
            <FadeBlock key={c.title} delay={i * 80}>
              <div className="group bg-white dark:bg-[#16212c] border border-slate-200 dark:border-slate-700 rounded-xl p-5 sm:p-6 h-full hover:border-brand-light/50 dark:hover:border-brand-dark/50 transition-colors duration-300">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <c.icon size={18} className="text-brand-light dark:text-brand-dark" />
                </div>
                <h2 className="m-0 mb-2 text-base font-bold text-slate-900 dark:text-slate-100">{c.title}</h2>
                <div className="mb-2">
                  {c.lines.map((line) => (
                    <p key={line} className="m-0 text-[14px] text-slate-700 dark:text-slate-300 leading-snug">{line}</p>
                  ))}
                </div>
                <p className="m-0 text-[12px] text-slate-500 dark:text-slate-500">{c.sub}</p>
              </div>
            </FadeBlock>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="bg-white dark:bg-[#16212c] border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-5 py-16 sm:py-24 w-full">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-14 items-start">
            <FadeBlock>
              <Eyebrow>Visit</Eyebrow>
              <h2 className="m-0 mb-4 text-2xl sm:text-3xl font-heading font-normal leading-tight text-slate-900 dark:text-slate-100">
                Find us on campus
              </h2>
              <p className="m-0 text-slate-700 dark:text-slate-400 text-[15px] leading-relaxed mb-4">
                The OS Lab is located in the Computer Science &amp; Engineering department at International Islamic University Chittagong. Visitors and collaborators are welcome — reach out ahead of time and we&apos;ll make sure someone is available to show you around.
              </p>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-brand-light dark:text-brand-dark" />
                <span className="font-mono text-[11px] text-slate-600 dark:text-slate-500">Kumira, Chittagong, Bangladesh</span>
              </div>
              <NavLink
                to="mailto:pulse@iiuc.ac.bd"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-light dark:text-brand-dark no-underline hover:underline mt-4"
              >
                pulse@iiuc.ac.bd <ArrowUpRight size={14} />
              </NavLink>
            </FadeBlock>

            <FadeBlock delay={150}>
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.2021602809523!2d91.718503475509!3d22.496597079545925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad2777a615585d%3A0xdcf908f6e4f3a713!2sInternational%20Islamic%20University%20Chittagong!5e0!3m2!1sen!2sbd!4v1783935177779!5m2!1sen!2sbd"
                  width="100%"
                  height="340"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="International Islamic University Chittagong campus location"
                  className="w-full"
                />
              </div>
            </FadeBlock>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-6xl mx-auto px-5 py-16 sm:py-24 w-full">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14">
          <FadeBlock>
            <Eyebrow>Send a message</Eyebrow>
            <h2 className="m-0 mb-3 text-2xl sm:text-3xl font-heading font-normal leading-tight text-slate-900 dark:text-slate-100">
              We&apos;d love to hear from you
            </h2>
            <p className="m-0 text-slate-700 dark:text-slate-400 text-[15px] leading-relaxed">
              Whether it&apos;s a question about the scheduling algorithms, a suggestion for improvement, or just saying hello — drop us a message and we&apos;ll get back to you.
            </p>
          </FadeBlock>

          <FadeBlock delay={150}>
            {submitted ? (
              <div className="bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-xl p-8 sm:p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-green-500" />
                </div>
                <h3 className="m-0 mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">Message sent</h3>
                <p className="m-0 text-slate-600 dark:text-slate-400 text-[14px] leading-relaxed max-w-sm mx-auto">
                  Thanks for reaching out. We typically respond within 48 hours during the academic term.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block font-mono text-[10px] uppercase tracking-[0.15em] text-slate-600 dark:text-slate-500 mb-1.5">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-light/40 dark:focus:ring-brand-dark/40 focus:border-brand-light dark:focus:border-brand-dark transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-mono text-[10px] uppercase tracking-[0.15em] text-slate-600 dark:text-slate-500 mb-1.5">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-light/40 dark:focus:ring-brand-dark/40 focus:border-brand-light dark:focus:border-brand-dark transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block font-mono text-[10px] uppercase tracking-[0.15em] text-slate-600 dark:text-slate-500 mb-1.5">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    className="w-full bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-light/40 dark:focus:ring-brand-dark/40 focus:border-brand-light dark:focus:border-brand-dark transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-mono text-[10px] uppercase tracking-[0.15em] text-slate-600 dark:text-slate-500 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here…"
                    className="w-full bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-light/40 dark:focus:ring-brand-dark/40 focus:border-brand-light dark:focus:border-brand-dark transition-all resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-brand-light dark:bg-brand-dark text-white dark:text-[#04201d] font-bold text-sm px-5 py-2.5 rounded-lg hover:brightness-110 transition-all cursor-pointer border-0"
                >
                  Send message <Send size={14} />
                </button>
              </form>
            )}
          </FadeBlock>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-white dark:bg-[#16212c] border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-5 py-16 sm:py-20 w-full text-center">
          <FadeBlock>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Heart size={22} className="text-red-500" />
            </div>
            <h2 className="m-0 mb-3 text-2xl sm:text-3xl font-heading font-normal leading-tight text-slate-900 dark:text-slate-100">
              This project is open source
            </h2>
            <p className="m-0 max-w-lg mx-auto text-slate-700 dark:text-slate-400 text-[15px] leading-relaxed mb-6">
              Pulse is built in the open. Found a bug? Want to add a new scheduling algorithm? Contributions are welcome.
            </p>
            <NavLink
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-brand-light dark:bg-brand-dark text-white dark:text-[#04201d] no-underline font-bold text-sm px-5 py-2.5 rounded-lg hover:brightness-110 transition-all"
            >
              Open dashboard <ArrowRight size={16} />
            </NavLink>
          </FadeBlock>
        </div>
      </section>

      <Footer />
    </div>
  );
}
