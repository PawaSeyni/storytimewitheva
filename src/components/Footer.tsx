import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🐾</span>
              <span className="text-white font-bold text-lg">Story Time with Eva</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Where stories come to life! Magical bilingual books and activities for curious young minds.
            </p>
            <div className="flex items-center gap-1 mt-3">
              {'⭐⭐⭐⭐⭐'.split('').map((s, i) => (
                <span key={i} className="text-yellow-400 text-sm">{s}</span>
              ))}
              <span className="text-gray-400 text-sm ml-1">4.9/5</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/books', label: 'Books' },
                { to: '/activities', label: 'Activities' },
                { to: '/resources', label: 'Parent Resources' },
                { to: '/about', label: 'About Eva' },
                { to: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-purple-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect with Eva</h4>
            <p className="text-sm text-gray-400 mb-4">
              Join our community for weekly tips, new stories, and exclusive activities!
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors text-lg">
                📘
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors text-lg">
                📷
              </a>
              <a href="https://www.amazon.com/author/evagallo" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors text-lg">
                📚
              </a>
            </div>
            <div className="mt-4">
              <a
                href="mailto:hello@storytimewitheva.com"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                hello@storytimewitheva.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© 2025 Story Time with Eva. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
