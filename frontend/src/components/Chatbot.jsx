import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiCpu, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const steps = [
  {
    id: 'welcome',
    message: "👋 Hi! I'm InternBot!\n\nI'll help you find the perfect internship in just a few steps. Let's start!",
    question: "What type of role are you looking for?",
    options: [
      { label: '💻 Software / IT', value: 'software developer' },
      { label: '📊 Data Science / AI', value: 'data science' },
      { label: '📢 Marketing', value: 'marketing' },
      { label: '🎨 Design / UI UX', value: 'design' },
      { label: '💼 Finance / Accounting', value: 'finance' },
      { label: '🧠 HR / Management', value: 'hr management' },
      { label: '🔬 Research / Science', value: 'research' },
      { label: '📱 Sales / BD', value: 'sales' },
    ],
    key: 'role'
  },
  {
    id: 'location',
    question: "📍 Which city do you prefer?",
    options: [
      { label: '🏙️ Bangalore', value: 'Bangalore' },
      { label: '🌆 Mumbai', value: 'Mumbai' },
      { label: '🏛️ Delhi / NCR', value: 'Delhi' },
      { label: '💻 Hyderabad', value: 'Hyderabad' },
      { label: '🌊 Chennai', value: 'Chennai' },
      { label: '🏰 Pune', value: 'Pune' },
      { label: '🏠 Remote / Work from Home', value: 'Remote' },
      { label: '🗺️ Any Location', value: '' },
    ],
    key: 'location'
  },
  {
    id: 'salary',
    question: "💰 What's your salary preference?",
    options: [
      { label: '💵 Paid only', value: 'paid' },
      { label: '📋 Any (Paid or Unpaid)', value: 'any' },
    ],
    key: 'salary'
  },
  {
    id: 'experience',
    question: "🎓 What's your experience level?",
    options: [
      { label: '🌱 Fresher (0 experience)', value: 'fresher' },
      { label: '📚 Student (currently studying)', value: 'student' },
      { label: '⭐ Some experience (1-6 months)', value: 'experienced' },
      { label: '🎯 Any level', value: 'any' },
    ],
    key: 'experience'
  }
];

const Chatbot = ({ onFilter, onSearch, internships = [] }) => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [messages, setMessages] = useState([]);
  const [finished, setFinished] = useState(false);
  const [searching, setSearching] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (open && messages.length === 0) {
      initChat();
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initChat = () => {
    setCurrentStep(0);
    setSelections({});
    setFinished(false);
    setMessages([
      {
        role: 'bot',
        text: steps[0].message,
        question: steps[0].question,
        options: steps[0].options,
        stepIndex: 0
      }
    ]);
  };

  const handleOption = (option, stepIndex) => {
    if (stepIndex !== currentStep) return;

    const step = steps[stepIndex];
    const newSelections = { ...selections, [step.key]: option.value };
    setSelections(newSelections);

    // Add user selection as message
    setMessages(prev => [
      ...prev,
      { role: 'user', text: option.label }
    ]);

    const nextStepIndex = stepIndex + 1;

    if (nextStepIndex < steps.length) {
      // Move to next step
      setTimeout(() => {
        setCurrentStep(nextStepIndex);
        setMessages(prev => [
          ...prev,
          {
            role: 'bot',
            text: null,
            question: steps[nextStepIndex].question,
            options: steps[nextStepIndex].options,
            stepIndex: nextStepIndex
          }
        ]);
      }, 400);
    } else {
      // All steps done - search internships
      setTimeout(() => {
        setCurrentStep(nextStepIndex);
        setFinished(true);
        searchInternships(newSelections);
      }, 400);
    }
  };

  const searchInternships = (sel) => {
    setSearching(true);

    setMessages(prev => [
      ...prev,
      {
        role: 'bot',
        text: `🔍 Searching for *${sel.role}* internships${sel.location ? ` in *${sel.location}*` : ''}...\n\nPlease wait!`
      }
    ]);

    // Filter internships based on selections
    let filtered = [...internships];

    // Filter by role
    if (sel.role) {
      const roleWords = sel.role.toLowerCase().split(' ');
      const roleFiltered = filtered.filter(i =>
        roleWords.some(word =>
          (i.title && i.title.toLowerCase().includes(word)) ||
          (i.category && i.category.toLowerCase().includes(word)) ||
          (i.description && i.description.toLowerCase().includes(word))
        )
      );
      if (roleFiltered.length > 0) filtered = roleFiltered;
    }

    // Filter by location
    if (sel.location) {
      const locFiltered = filtered.filter(i =>
        i.location && i.location.toLowerCase().includes(sel.location.toLowerCase())
      );
      if (locFiltered.length > 0) filtered = locFiltered;
    }

    // Filter by salary
    if (sel.salary === 'paid') {
      const paidFiltered = filtered.filter(i =>
        i.salary &&
        !i.salary.toLowerCase().includes('unpaid') &&
        !i.salary.toLowerCase().includes('stipend based')
      );
      if (paidFiltered.length > 0) filtered = paidFiltered;
    }

    setTimeout(() => {
      setSearching(false);
      if (filtered.length > 0) {
        if (onFilter) {
          onFilter({ filtered_ids: filtered.map(i => String(i.id)), reason: 'chatbot filter' });
        }
        setMessages(prev => [
          ...prev,
          {
            role: 'bot',
            text: `✅ Found *${filtered.length} internships* matching your preferences!\n\n📍 Location: ${sel.location || 'Any'}\n💼 Role: ${sel.role}\n💰 Salary: ${sel.salary === 'paid' ? 'Paid only' : 'Any'}\n\nScroll up to see the results! 👆`,
            showRestart: true
          }
        ]);
      } else {
        // If no local results, trigger a new search
        if (onSearch) {
          onSearch({ keyword: sel.role, location: sel.location });
        }
        setMessages(prev => [
          ...prev,
          {
            role: 'bot',
            text: `🔄 No exact matches in current results.\n\nI've updated the search for *"${sel.role}"* ${sel.location ? `in *${sel.location}*` : ''}.\n\nNew internships are loading! 👆`,
            showRestart: true
          }
        ]);
      }
    }, 1500);
  };

  const restart = () => {
    initChat();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-bg text-white shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center"
      >
        {open ? <FiX size={22} /> : <FiMessageSquare size={22} />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[580px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">

          {/* Header */}
          <div className="gradient-bg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <FiCpu className="text-white" size={20} />
              </div>
              <div>
                <p className="text-white font-semibold">InternBot</p>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-white/70 text-xs">Smart Internship Assistant</p>
                </div>
              </div>
            </div>
            <button
              onClick={restart}
              className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Restart"
            >
              <FiRefreshCw className="text-white" size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 chatbot-scroll bg-gray-50">
            {!user ? (
              <div className="text-center py-10">
                <FiCpu size={40} className="mx-auto text-indigo-300 mb-3" />
                <p className="text-gray-500 text-sm">Please login to use InternBot!</p>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={i}>
                    {/* Bot message */}
                    {msg.role === 'bot' && (
                      <div className="flex items-start space-x-2">
                        <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 mt-1">
                          <FiCpu className="text-white" size={12} />
                        </div>
                        <div className="flex-1">
                          {msg.text && (
                            <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2.5 text-sm text-gray-800 shadow-sm border border-gray-100 mb-2 whitespace-pre-wrap">
                              {msg.text.replace(/\*/g, '')}
                            </div>
                          )}
                          {msg.question && (
                            <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2.5 text-sm font-semibold text-gray-800 shadow-sm border border-gray-100 mb-2">
                              {msg.question}
                            </div>
                          )}
                          {msg.options && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {msg.options.map((opt, j) => (
                                <button
                                  key={j}
                                  onClick={() => handleOption(opt, msg.stepIndex)}
                                  disabled={msg.stepIndex !== currentStep}
                                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                                    msg.stepIndex !== currentStep
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      : 'bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-sm'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                          {msg.showRestart && (
                            <button
                              onClick={restart}
                              className="mt-3 w-full py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                            >
                              <FiRefreshCw size={14} />
                              <span>Search Again</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* User message */}
                    {msg.role === 'user' && (
                      <div className="flex justify-end">
                        <div className="bg-indigo-600 text-white px-3 py-2 rounded-2xl rounded-br-sm text-sm max-w-[70%]">
                          {msg.text}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {searching && (
                  <div className="flex items-start space-x-2">
                    <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                      <FiCpu className="text-white" size={12} />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-white text-center">
            <p className="text-xs text-gray-300">InternBot • Smart Internship Finder ✨</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
