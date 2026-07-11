import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-full">
      <section className="max-w-6xl mx-auto px-5 py-16 flex-1 w-full">
        <div className="font-mono text-[11.5px] tracking-widest uppercase text-brand-light dark:text-brand-dark mb-2.5">
          Contact
        </div>
        <h1 className="m-0 mb-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Get in touch
        </h1>
        <p className="max-w-lg text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed">
          This page is routed and ready — content and layout to be designed.
        </p>
      </section>
      <Footer />
    </div>
  );
}
