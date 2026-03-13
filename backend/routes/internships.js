const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/search', async (req, res) => {
  try {
    const {
      keyword = 'internship',
      location = '',
      page = 1,
      category = ''
    } = req.query;

    const searchQuery = category
      ? `${keyword} ${category} internship`
      : `${keyword} internship`;

    // Try India first, fallback to GB if no results
    const countries = ['in', 'gb'];
    let internships = [];
    let totalCount = 0;

    for (const country of countries) {
      try {
        const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;
        const response = await axios.get(url, {
          params: {
            app_id: process.env.ADZUNA_APP_ID,
            app_key: process.env.ADZUNA_APP_KEY,
            results_per_page: 20,
            what: searchQuery,
            where: location || undefined
          }
        });

        const results = response.data.results || [];
        totalCount = response.data.count || 0;

        internships = results.map(job => {
          const salaryMin = job.salary_min ? Math.round(job.salary_min) : null;
          const salaryMax = job.salary_max ? Math.round(job.salary_max) : null;
          
          let salary = 'Stipend Based';
          if (salaryMin && salaryMax) {
            salary = country === 'in' 
              ? `₹${salaryMin.toLocaleString('en-IN')} - ₹${salaryMax.toLocaleString('en-IN')}`
              : `£${salaryMin.toLocaleString()} - £${salaryMax.toLocaleString()}`;
          } else if (salaryMin) {
            salary = country === 'in'
              ? `₹${salaryMin.toLocaleString('en-IN')}`
              : `£${salaryMin.toLocaleString()}`;
          }

          return {
            id: job.id || String(Math.random()),
            title: job.title || 'Internship',
            company: (job.company && job.company.display_name) || 'Company',
            location: (job.location && job.location.display_name) || 'India',
            salary: salary,
            description: job.description || '',
            url: job.redirect_url || '#',
            category: (job.category && job.category.label) || 'General',
            postedDate: job.created || new Date().toISOString(),
            contractType: job.contract_type || 'Internship',
            country: country
          };
        });

        if (internships.length > 0) break;
      } catch (countryError) {
        console.log(`No results for country ${country}, trying next...`);
        continue;
      }
    }

    res.json({
      internships,
      total: totalCount,
      page: parseInt(page),
      pages: Math.ceil(totalCount / 20)
    });

  } catch (error) {
    console.error('Internships error:', error.message);
    res.status(500).json({
      message: 'Error fetching internships',
      error: error.message
    });
  }
});

router.get('/categories', async (req, res) => {
  const categories = [
    'Software Engineering', 'Data Science', 'Marketing', 'Finance',
    'Design', 'Business', 'Healthcare', 'Research', 'Education',
    'Engineering', 'Sales', 'HR', 'Legal', 'Media', 'Nonprofit'
  ];
  res.json(categories);
});

module.exports = router;
