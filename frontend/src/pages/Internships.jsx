import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import InternshipCard from '../components/InternshipCard';
import Chatbot from '../components/Chatbot';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [chatFiltered, setChatFiltered] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    category: '',
    page: 1
  });

  const indianCities = [
    'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad',
    'Chennai', 'Pune', 'Kolkata', 'Noida', 'Gurgaon', 'Remote'
  ];

  useEffect(() => {
    api.get('/internships/categories').then(res => setCategories(res.data)).catch(() => {});
    fetchSaved();
  }, []);

  useEffect(() => {
    fetchInternships();
  }, [filters.page]);

  const fetchSaved = async () => {
    try {
      const res = await api.get('/saved');
      setSavedIds(new Set(res.data.map(s => s.internshipId)));
    } catch {}
  };

  const fetchInternships = async (overrideFilters) => {
    setLoading(true);
    setChatFiltered(false);
    const f = overrideFilters || filters;
    try {
      const res = await api.get('/internships/search', {
        params: {
          keyword: f.keyword || 'internship',
          location: f.location,
          category: f.category,
          page: f.page || 1
        }
      });
      setInternships(res.data.internships);
      setFiltered(res.data.internships);
      setTotalPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) {
      toast.error('Failed to fetch internships');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  const handleChatFilter = (filterResult) => {
    if (filterResult?.filtered_ids?.length > 0) {
      const idSet = new Set(filterResult.filtered_ids.map(String));
      const filteredList = internships.filter(i => idSet.has(String(i.id)));
      if (filteredList.length > 0) {
        setFiltered(filteredList);
        setChatFiltered(true);
      }
    }
  };

  const handleChatSearch = (searchParams) => {
    const newFilters = {
      keyword: searchParams.keyword || 'internship',
      location: searchParams.location || '',
      category: '',
      page: 1
    };
    setFilters(newFilters);
    fetchInternships(newFilters);
  };

  const clearChatFilter = () => {
    setFiltered(internships);
    setChatFiltered(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Find Internships in India</h1>
        <p className="text-gray-500">Real internship opportunities across India — updated daily</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Job title, skills, company..."
              value={filters.keyword}
              onChange={e => setFilters({ ...filters, keyword: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
          <select
            value={filters.location}
            onChange={e => setFilters({ ...filters, location: e.target.value })}
            className="md:w-48 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white"
          >
            <option value="">All Cities</option>
            {indianCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={e => setFilters({ ...filters, category: e.target.value })}
            className="md:w-48 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            type="submit"
            className="px-6 py-3 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center space-x-2"
          >
            <FiSearch size={18} />
            <span>Search</span>
          </button>
        </div>

        {/* Quick city buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-sm text-gray-400 self-center">Quick:</span>
          {['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Remote'].map(city => (
            <button
              key={city}
              type="button"
              onClick={() => {
                const newFilters = { ...filters, location: city, page: 1 };
                setFilters(newFilters);
                fetchInternships(newFilters);
              }}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filters.location === city
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600'
              }`}
            >
              {city}
            </button>
          ))}
          {filters.location && (
            <button
              type="button"
              onClick={() => {
                const newFilters = { ...filters, location: '', page: 1 };
                setFilters(newFilters);
                fetchInternships(newFilters);
              }}
              className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-600 hover:bg-red-200"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </form>

      {/* Results info */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-sm">
          {chatFiltered
            ? `🤖 InternBot filtered: ${filtered.length} results`
            : `${total.toLocaleString()} internships found`}
        </p>
        {chatFiltered && (
          <button
            onClick={clearChatFilter}
            className="flex items-center space-x-1 text-indigo-600 hover:underline text-sm"
          >
            <FiRefreshCw size={14} />
            <span>Show all</span>
          </button>
        )}
      </div>

      {loading ? <Loader /> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {filtered.length > 0 ? (
              filtered.map(internship => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  isSaved={savedIds.has(String(internship.id))}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-20">
                <FiSearch size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No internships found.</p>
                <p className="text-gray-400 text-sm mt-1">Try different keywords or use InternBot 🤖</p>
              </div>
            )}
          </div>

          {!chatFiltered && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setFilters(f => ({ ...f, page: Math.max(1, f.page - 1) }))}
                disabled={filters.page === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600 text-sm">
                Page {filters.page} of {totalPages}
              </span>
              <button
                onClick={() => setFilters(f => ({ ...f, page: Math.min(totalPages, f.page + 1) }))}
                disabled={filters.page === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <Chatbot
        onFilter={handleChatFilter}
        onSearch={handleChatSearch}
        internships={internships}
      />
    </div>
  );
};

export default Internships;
