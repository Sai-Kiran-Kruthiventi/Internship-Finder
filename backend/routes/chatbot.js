const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

function filterInternships(msg, internships) {
  const m = msg.toLowerCase();
  let filtered = [...internships];

  const cities = {
    'bangalore': ['bangalore', 'bengaluru'],
    'mumbai': ['mumbai', 'bombay'],
    'delhi': ['delhi', 'new delhi'],
    'noida': ['noida'],
    'gurgaon': ['gurgaon', 'gurugram'],
    'hyderabad': ['hyderabad'],
    'chennai': ['chennai'],
    'pune': ['pune'],
    'kolkata': ['kolkata'],
    'remote': ['remote', 'work from home', 'wfh']
  };

  for (const [city, keywords] of Object.entries(cities)) {
    if (keywords.some(k => m.includes(k))) {
      const cityFiltered = filtered.filter(i =>
        keywords.some(k => i.location && i.location.toLowerCase().includes(k))
      );
      if (cityFiltered.length > 0) { filtered = cityFiltered; break; }
    }
  }

  const roles = {
    'software|developer|coding|programming|frontend|backend|fullstack|web': ['software', 'developer', 'engineer', 'frontend', 'backend', 'web'],
    'data|machine learning|ml|ai|artificial intelligence': ['data', 'analyst', 'machine learning', 'ml', 'ai'],
    'marketing|digital marketing|seo|social media|content': ['marketing', 'seo', 'social media', 'content', 'digital'],
    'design|ui|ux|graphic': ['design', 'ui', 'ux', 'graphic', 'creative'],
    'finance|accounting|banking': ['finance', 'accounting', 'financial', 'banking'],
    'hr|human resources|recruitment': ['hr', 'human resources', 'recruitment'],
    'sales|business development': ['sales', 'business development'],
    'research|science': ['research', 'science', 'laboratory']
  };

  for (const [keywords, titleKeywords] of Object.entries(roles)) {
    if (keywords.split('|').some(k => m.includes(k))) {
      const roleFiltered = filtered.filter(i =>
        titleKeywords.some(k =>
          (i.title && i.title.toLowerCase().includes(k)) ||
          (i.category && i.category.toLowerCase().includes(k)) ||
          (i.description && i.description.toLowerCase().includes(k))
        )
      );
      if (roleFiltered.length > 0) { filtered = roleFiltered; break; }
    }
  }

  if (m.includes('paid') || m.includes('stipend') || m.includes('salary')) {
    const paidFiltered = filtered.filter(i =>
      i.salary && !i.salary.toLowerCase().includes('unpaid') && !i.salary.toLowerCase().includes('stipend based')
    );
    if (paidFiltered.length > 0) filtered = paidFiltered;
  }

  if (m.includes('latest') || m.includes('newest') || m.includes('recent')) {
    filtered.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
  }

  if (m.includes('highest') || m.includes('high paying') || m.includes('best salary')) {
    filtered.sort((a, b) => {
      const getSalary = (s) => {
        if (!s) return 0;
        const match = s.replace(/[₹$,]/g, '').match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };
      return getSalary(b.salary) - getSalary(a.salary);
    });
  }

  return filtered;
}

router.post('/chat', auth, async (req, res) => {
  try {
    const { message, internshipContext } = req.body;
    const msg = message.toLowerCase();
    const internships = internshipContext || [];
    let reply = '';
    let filterResult = null;

    if (msg.includes('resume') || msg.includes('cv')) {
      reply = `📄 Resume Tips:\n\n1. Keep it to 1 page\n2. Add GitHub/LinkedIn links\n3. List relevant skills\n4. Include college projects\n5. Use action verbs: Built, Developed, Designed\n6. Add GPA if above 8.0\n7. Mention certifications`;
    }
    else if (msg.includes('interview') || msg.includes('prepare')) {
      reply = `🎯 Interview Tips:\n\n1. Research the company\n2. Practice DSA on LeetCode\n3. Prepare your introduction\n4. Have 2-3 projects ready\n5. Ask questions at the end\n6. Be on time\n7. Practice mock interviews`;
    }
    else if (msg.includes('help') || msg === 'hi' || msg === 'hello' || msg === 'hey' || msg.includes('hii')) {
      reply = `👋 Hi! I'm InternBot!\n\nTry asking:\n🏙️ "Software internships in Bangalore"\n📊 "Data science internships in Mumbai"\n🏠 "Remote internships"\n💰 "Paid internships"\n🆕 "Latest internships"\n💵 "Highest paying internships"\n📄 "Resume tips"\n🎯 "Interview tips"`;
    }
    else {
      const filtered = filterInternships(msg, internships);

      if (filtered.length > 0 && filtered.length < internships.length) {
        filterResult = { filtered_ids: filtered.map(i => i.id), reason: message };
        const locationMatch = msg.match(/bangalore|bengaluru|mumbai|delhi|noida|gurgaon|hyderabad|chennai|pune|kolkata|remote/i);
        const roleMatch = msg.match(/software|developer|data|marketing|design|finance|hr|sales|research/i);
        let context = [];
        if (locationMatch) context.push(`📍 ${locationMatch[0]}`);
        if (roleMatch) context.push(`💼 ${roleMatch[0]}`);
        if (msg.includes('paid')) context.push(`💰 Paid only`);
        reply = `✅ Found ${filtered.length} internships!\n${context.join(' | ')}\n\nShowing results now 👇`;
      } else {
        const words = msg.split(' ').filter(w => w.length > 3);
        const matched = internships.filter(i =>
          words.some(word =>
            (i.title && i.title.toLowerCase().includes(word)) ||
            (i.company && i.company.toLowerCase().includes(word))
          )
        );
        if (matched.length > 0) {
          filterResult = { filtered_ids: matched.map(i => i.id), reason: message };
          reply = `🔍 Found ${matched.length} internships matching "${message}"!`;
        } else {
          reply = `🤔 No matches found for "${message}".\n\nTry:\n• "Software internships in Bangalore"\n• "Remote data science internships"\n• "Paid marketing internships"`;
        }
      }
    }

    res.json({ reply, filterResult });
  } catch (error) {
    console.error('Chatbot error:', error.message);
    res.status(500).json({ message: 'Chatbot error', error: error.message });
  }
});

module.exports = router;
