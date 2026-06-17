export default function CTA() {
  return (
    <section className="bg-black px-12 py-20 text-center">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-8">
          <svg className="w-8 h-8" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gradW" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb" />
                <stop offset="1" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
            <polygon points="40,8 10,68 22,68 40,28 58,68 70,68" fill="url(#gradW)" />
            <rect x="22" y="50" width="36" height="9" rx="3" fill="#60a5fa" />
            <rect x="32" y="16" width="18" height="22" rx="2.5" fill="white" fillOpacity="0.9" />
            <circle cx="58" cy="58" r="11" fill="#16a34a" />
            <polyline points="52,58 56.5,63 64,52" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-lg font-semibold text-white tracking-tight">Acadly</span>
        </div>

        <h2 className="font-serif text-4xl text-white mb-4 leading-tight">
          Ready to <em className="italic text-white/55">simplify</em> assignment submission?
        </h2>

        <p className="text-base text-white/50 leading-relaxed mb-9">
          Join thousands of educators and students already using Acadly to streamline their academic workflows. Get started today and experience the difference.
        </p>

        <div className="flex gap-3 justify-center">
          <a
            href="/register"
            className="px-6 py-2.5 bg-white rounded-lg text-black text-sm font-semibold no-underline transition-all hover:bg-gray-100 hover:translate-y-px"
          >
            Get Started Free
          </a>
          <a
            href="/login"
            className="px-6 py-2.5 rounded-lg border border-white/20 text-white/65 text-sm font-medium no-underline transition-all hover:border-white/50 hover:text-white"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
