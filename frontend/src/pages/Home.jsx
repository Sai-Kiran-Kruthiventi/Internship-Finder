import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiBookmark, FiBriefcase, FiTrendingUp, FiMessageSquare } from 'react-icons/fi';

const features = [
  { icon: FiSearch, title: 'Real Internships', desc: 'Thousands of verified, real internship listings updated daily from top companies.' },
  { icon: FiBookmark, title: 'Save & Track', desc: 'Bookmark your favorite internships and manage your applications in one place.' },
  { icon: FiMessageSquare, title: 'AI Assistant', desc: 'Our AI chatbot helps you find and filter perfect internship matches instantly.' },
  { icon: FiTrendingUp, title: 'Career Growth', desc: 'Get personalized internship recommendations based on your skills and preferences.' }
];

const stats = [
  { value: '50,000+', label: 'Active Internships' },
  { value: '10,000+', label: 'Companies' },
  { value: '95%', label: 'Placement Rate' },
  { value: '4.9★', label: 'User Rating' }
];

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-bg text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Dream<br />
            <span className="text-yellow-300">Internship Today</span>
          </h1>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Thousands of real internship opportunities from top companies. Get hired with AI-powered matching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/internships" className="px-8 py-4 bg-white text-indigo-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg">
              Browse Internships
            </Link>
            <Link to="/register" className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{s.value}</div>
              <div className="text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-gray-500 text-center mb-14 text-lg">A complete platform built for students and recent graduates</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm card-hover">
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
                  <f.icon className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Launch Your Career?</h2>
          <p className="text-gray-400 mb-10 text-lg">Join thousands of students who found their perfect internship.</p>
          <Link to="/register" className="inline-block px-8 py-4 gradient-bg rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg">
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-4 text-center text-gray-400 text-sm">
        <p>© 2024 InternHub. All rights reserved. Real internships powered by Adzuna API.</p>
      </footer>
    </div>
  );
};

export default Home;