import React, { useState } from 'react';
import {
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiBriefcase,
  FiBookmark,
  FiExternalLink
} from 'react-icons/fi';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const InternshipCard = ({ internship, isSaved: initialSaved, onUnsave }) => {
  const [saved, setSaved] = useState(initialSaved || false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      if (saved) {
        await api.delete(`/saved/${internship.id}`);
        setSaved(false);
        toast.success('Removed from saved');
        if (onUnsave) onUnsave(internship.id);
      } else {
        await api.post('/saved', {
          internshipId: internship.id,
          title: internship.title,
          company: internship.company,
          location: internship.location,
          salary: internship.salary,
          description: internship.description,
          url: internship.url,
          category: internship.category,
          postedDate: internship.postedDate
        });
        setSaved(true);
        toast.success('Saved!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recently posted';
    }
  };

  const applyUrl = internship.url || '#';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 card-hover shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight truncate pr-2">
              {internship.title}
            </h3>
            <p className="text-indigo-600 font-medium mt-0.5">
              {internship.company}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            aria-label={saved ? 'Unsave internship' : 'Save internship'}
            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${saved ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500 hover:bg-indigo-100 hover:text-indigo-600'}`}
          >
            <FiBookmark size={18} className={saved ? 'fill-current' : ''} />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <FiMapPin size={14} className="mr-1.5 flex-shrink-0" />
            <span className="truncate">{internship.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <FiDollarSign size={14} className="mr-1.5 flex-shrink-0" />
            <span>{internship.salary || 'Salary not specified'}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <FiCalendar size={14} className="mr-1.5 flex-shrink-0" />
            <span>{formatDate(internship.postedDate)}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <FiBriefcase size={14} className="mr-1.5 flex-shrink-0" />
            <span>{internship.category || 'General'}</span>
          </div>
        </div>

        {internship.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {internship.description}
          </p>
        )}
      </div>

      <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity space-x-2 mt-2">
        <span>Apply Now</span>
        <FiExternalLink size={14} />
      </a>
    </div>
  );
};

export default InternshipCard;