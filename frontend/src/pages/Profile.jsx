import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiUser, FiSave, FiPlus, FiX } from 'react-icons/fi';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [roleInput, setRoleInput] = useState('');

  useEffect(() => {
    api.get('/profile').then(res => {
      setProfile(res.data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/profile', profile);
      setProfile(res.data);
      toast.success('Profile saved!');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile({ ...profile, skills: [...(profile.skills || []), skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  const addRole = () => {
    if (roleInput.trim() && !profile.preferredRoles.includes(roleInput.trim())) {
      setProfile({ ...profile, preferredRoles: [...(profile.preferredRoles || []), roleInput.trim()] });
      setRoleInput('');
    }
  };

  const removeRole = (role) => {
    setProfile({ ...profile, preferredRoles: profile.preferredRoles.filter(r => r !== role) });
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-5 py-2.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-60"
        >
          <FiSave size={18} />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2"><FiUser /><span>Basic Information</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
              <input type="text" value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
              <input type="text" value={profile.location || ''} onChange={e => setProfile({...profile, location: e.target.value})}
                placeholder="City, Country" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Bio</label>
              <textarea value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})}
                rows={3} placeholder="Tell companies about yourself..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 resize-none" />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Degree</label>
              <input type="text" value={profile.education?.degree || ''} onChange={e => setProfile({...profile, education: {...profile.education, degree: e.target.value}})}
                placeholder="B.Tech, BSc..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Institution</label>
              <input type="text" value={profile.education?.institution || ''} onChange={e => setProfile({...profile, education: {...profile.education, institution: e.target.value}})}
                placeholder="University name" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Graduation Year</label>
              <input type="text" value={profile.education?.graduationYear || ''} onChange={e => setProfile({...profile, education: {...profile.education, graduationYear: e.target.value}})}
                placeholder="2025" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
          <div className="flex gap-2 mb-4">
            <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="Add a skill (e.g. Python, React...)" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500" />
            <button onClick={addSkill} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
              <FiPlus />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(profile.skills || []).map(skill => (
              <span key={skill} className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                <span>{skill}</span>
                <button onClick={() => removeSkill(skill)}><FiX size={14} /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Preferred Roles */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferred Roles</h2>
          <div className="flex gap-2 mb-4">
            <input type="text" value={roleInput} onChange={e => setRoleInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addRole()}
              placeholder="Software Engineer, Data Analyst..." className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500" />
            <button onClick={addRole} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
              <FiPlus />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(profile.preferredRoles || []).map(role => (
              <span key={role} className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                <span>{role}</span>
                <button onClick={() => removeRole(role)}><FiX size={14} /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Links & Resume</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">LinkedIn URL</label>
              <input type="url" value={profile.linkedin || ''} onChange={e => setProfile({...profile, linkedin: e.target.value})}
                placeholder="https://linkedin.com/in/yourname" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">GitHub URL</label>
              <input type="url" value={profile.github || ''} onChange={e => setProfile({...profile, github: e.target.value})}
                placeholder="https://github.com/yourname" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Resume URL (Google Drive, Dropbox link)</label>
              <input type="url" value={profile.resume || ''} onChange={e => setProfile({...profile, resume: e.target.value})}
                placeholder="https://drive.google.com/..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;