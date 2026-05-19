import { useState } from 'react';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-5xl mb-4">🎁</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Download the FREE 20-Page Bilingual Starter Kit!
        </h2>
        <p className="text-purple-100 text-lg mb-6">
          Join our growing community of parents making reading fun. Get coloring pages,
          reading guides, and bilingual activities delivered straight to your inbox.
        </p>

        <ul className="text-left inline-block text-purple-100 text-sm mb-8 space-y-2">
          {[
            '✓ 20-page bilingual activity pack (English & Spanish)',
            '✓ Age-appropriate book recommendations',
            '✓ Fun story prompts & creative activities',
            '✓ No spam, unsubscribe anytime',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">{item}</li>
          ))}
        </ul>

        {submitted ? (
          <div className="bg-white/20 rounded-2xl p-6 text-white">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-bold text-xl">You're in! Check your inbox.</p>
            <p className="text-purple-100 text-sm mt-1">Your Bilingual Starter Kit is on its way!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-3 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white shadow-md"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
            >
              Get My Free Kit 🎨
            </button>
          </form>
        )}

        <p className="text-purple-200 text-xs mt-4">🔒 We respect your privacy. No spam, ever.</p>
      </div>
    </section>
  );
}
