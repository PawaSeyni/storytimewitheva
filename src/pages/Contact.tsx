import { useState } from 'react';
import Seo from '../components/Seo';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      <Seo
        title="Contact"
        description="Get in touch with Story Time with Eva. Questions about the books, school visits, or just want to say hi? Send a message and we'll get back to you."
        path="/contact"
      />
      {/* Header */}
      <section className="bg-gradient-to-b from-pink-50 to-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">📬</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Get in Touch with Eva</h1>
          <p className="text-gray-500 text-lg">We'd love to hear from you! Send us a message and we'll get back to you soon.</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-50">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-700">
                💡 <strong>Tip:</strong> We typically respond within 24-48 hours. For faster answers, check our FAQ section!
              </div>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                  <p className="text-gray-500">Thank you for reaching out. Eva will get back to you within 24-48 hours.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2.5 border-2 border-purple-400 text-purple-600 font-semibold rounded-full hover:bg-purple-50 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      placeholder="Book inquiry, school visit, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-lg"
                  >
                    ✉️ Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center shadow-lg">
              <span className="text-4xl">🐾</span>
              <h3 className="font-bold text-xl mt-2 mb-1">Contact Information</h3>
              <p className="text-purple-100 text-sm">Let's make reading magical together!</p>
            </div>

            {[
              { emoji: '📧', title: 'Email', value: 'hello@storytimewitheva.com', href: 'mailto:hello@storytimewitheva.com' },
              { emoji: '📍', title: 'Location', value: 'Making reading magical worldwide!' },
              { emoji: '⏰', title: 'Response Time', value: 'Within 24-48 hours' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-md border border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">
                    {item.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                    {item.href ? (
                      <a href={item.href} className="text-purple-600 text-sm hover:underline">{item.value}</a>
                    ) : (
                      <p className="text-gray-500 text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-50">
              <p className="font-semibold text-gray-800 text-sm mb-3">Follow Eva</p>
              <div className="flex gap-2">
                <a href="https://www.amazon.com/author/evagallo" target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2 bg-orange-50 border border-orange-200 rounded-xl text-center text-sm hover:bg-orange-100 transition-colors">
                  📚 Amazon
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2 bg-pink-50 border border-pink-200 rounded-xl text-center text-sm hover:bg-pink-100 transition-colors">
                  📷 Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
