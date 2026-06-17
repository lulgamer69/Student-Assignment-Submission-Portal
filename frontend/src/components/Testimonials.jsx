export default function Testimonials() {
  const testimonials = [
    {
      stars: '⭐⭐⭐⭐⭐',
      quote: 'Acadly has completely transformed how we manage assignments. Students love the simplicity!',
      author: 'Sarah Chen',
      role: 'Computer Science Professor'
    },
    {
      stars: '⭐⭐⭐⭐⭐',
      quote: 'Finally a platform that understands what students actually need. Best decision for our institution.',
      author: 'Marcus Johnson',
      role: 'Academic Dean'
    },
    {
      stars: '⭐⭐⭐⭐⭐',
      quote: 'The feedback features are incredible. My submission improvements have been noticeable.',
      author: 'Emily Rodriguez',
      role: 'Engineering Student'
    }
  ];

  return (
    <section className="bg-gray-50 px-12 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-gray-500 tracking-wide mb-3">💬 What Users Say</p>
          <h2 className="text-4xl font-serif leading-tight mb-4">
            Loved by Educators and Students
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {testimonials.map((testi, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-7 hover:border-gray-300 hover:shadow-md transition-all cursor-default"
            >
              <div className="text-amber-500 text-sm letter-spacing-wide mb-3">
                {testi.stars}
              </div>
              <p className="text-sm leading-relaxed text-gray-600 mb-5">
                "{testi.quote}"
              </p>
              <div className="pt-4 border-t border-gray-200">
                <div className="font-semibold text-sm text-gray-900">{testi.author}</div>
                <div className="text-xs text-gray-500 mt-0.5">{testi.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
