import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import InternshipCard from '../components/InternshipCard';
import Loader from '../components/Loader';
import { FiBookmark } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const SavedInternships = () => {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/saved').then(res => {
      setSaved(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleUnsave = (id) => {
    setSaved(prev => prev.filter(s => s.internshipId !== id));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Saved Internships</h1>
        <p className="text-gray-500 mt-1">{saved.length} saved internship{saved.length !== 1 ? 's' : ''}</p>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-20">
          <FiBookmark size={56} className="mx-auto text-gray-200 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No saved internships yet</h2>
          <p className="text-gray-400 mb-6">Start exploring and save internships you're interested in.</p>
          <Link to="/internships" className="px-6 py-3 gradient-bg text-white rounded-xl font-semibold hover:opacity-90">
            Browse Internships
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map(item => (
            <InternshipCard
              key={item.internshipId}
              internship={{
                id: item.internshipId,
                title: item.title,
                company: item.company,
                location: item.location,
                salary: item.salary,
                description: item.description,
                url: item.url,
                category: item.category,
                postedDate: item.postedDate
              }}
              isSaved={true}
              onUnsave={handleUnsave}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedInternships;