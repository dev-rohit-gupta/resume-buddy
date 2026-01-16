// ========== DUMMY DATA FOR JOB SEARCH ==========
/*
    Each job object contains the following properties from Jobicy API:
 "id": Unique Job ID,
 "url": Job link,
 "jobTitle": Job title,
 "companyName": Company name,
 "companyLogo": Company logo link,
 "jobIndustry": Job function (industry) - array,
 "jobType": Job type (full-time, contract, part-time or internship) - array
 "jobGeo": Geographic restriction for employment (or Anywhere if not applicable), 
 "jobLevel": Seniority level (or Any if not applicable), 
 "jobExcerpt": Excerpt job description (max 55 characters), 
 "jobDescription": Full job description (HTML), 
 "pubDate": Publication date and time (UTC+00:00) - ISO string,
 "salaryMin": Min salary (if applicable),
 "salaryMax": Max salary (if applicable),
 "salaryCurrency": ISO 4217 salary currency code (if applicable)
 "salaryPeriod": The period for which the salary is paid (e.g., hourly, daily, year...)
*/
const DUMMY_JOBS = [
  {
    id: "1",
    url: "https://example.com/job/1",
    jobTitle: "Senior Software Engineer",
    companyName: "Tech Innovations Inc.",
    companyLogo: "https://via.placeholder.com/50",
    jobIndustry: ["Software Development", "Technology"],
    jobType: ["full-time"],
    jobGeo: "San Francisco, CA",
    jobLevel: "Senior",
    jobExcerpt: "Build scalable applications with cutting-edge tech",
    jobDescription: "<p>We're looking for a Senior Software Engineer to join our growing team. You'll be working on cutting-edge technologies and building scalable applications that impact millions of users.</p><p>Requirements: 5+ years experience, React, Node.js, AWS expertise.</p>",
    pubDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    salaryMin: 120000,
    salaryMax: 180000,
    salaryCurrency: "USD",
    salaryPeriod: "year",
    saved: false
  },
  {
    id: "2",
    url: "https://example.com/job/2",
    jobTitle: "Frontend Developer Intern",
    companyName: "StartUp Innovations",
    companyLogo: "https://via.placeholder.com/50",
    jobIndustry: ["Web Development"],
    jobType: ["internship"],
    jobGeo: "Anywhere",
    jobLevel: "Entry",
    jobExcerpt: "Learn modern web development in a startup environment",
    jobDescription: "<p>Join our dynamic team as a Frontend Developer Intern. You'll work alongside experienced developers and learn modern web development practices while building real-world applications.</p>",
    pubDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    salaryMin: 20,
    salaryMax: 20,
    salaryCurrency: "USD",
    salaryPeriod: "hour",
    saved: false
  },
  {
    id: "3",
    url: "https://example.com/job/3",
    jobTitle: "Full Stack Developer",
    companyName: "Digital Solutions Corp",
    companyLogo: "https://via.placeholder.com/50",
    jobIndustry: ["Web Development", "Software Development"],
    jobType: ["full-time"],
    jobGeo: "New York, NY",
    jobLevel: "Mid",
    jobExcerpt: "Design and develop web apps with modern tech stack",
    jobDescription: "<p>Seeking a talented Full Stack Developer to design, develop, and maintain web applications. You'll work on both frontend and backend components using modern technologies.</p>",
    pubDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    salaryMin: 90000,
    salaryMax: 130000,
    salaryCurrency: "USD",
    salaryPeriod: "year",
    saved: true
  },
  {
    id: "4",
    url: "https://example.com/job/4",
    jobTitle: "DevOps Engineer",
    companyName: "Cloud Systems Ltd",
    companyLogo: "https://via.placeholder.com/50",
    jobIndustry: ["Cloud Computing", "DevOps"],
    jobType: ["contract"],
    jobGeo: "Anywhere",
    jobLevel: "Mid",
    jobExcerpt: "Build and maintain CI/CD pipelines for cloud infrastr",
    jobDescription: "<p>Looking for a DevOps Engineer to help build and maintain our CI/CD pipelines. You'll be responsible for automating infrastructure and ensuring smooth deployments.</p>",
    pubDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    salaryMin: 70,
    salaryMax: 90,
    salaryCurrency: "USD",
    salaryPeriod: "hour",
    saved: false
  },
  {
    id: "5",
    url: "https://example.com/job/5",
    jobTitle: "Mobile App Developer",
    companyName: "AppCraft Studios",
    companyLogo: "https://via.placeholder.com/50",
    jobIndustry: ["Mobile Development"],
    jobType: ["full-time"],
    jobGeo: "Seattle, WA",
    jobLevel: "Mid",
    jobExcerpt: "Create innovative mobile apps for iOS and Android",
    jobDescription: "<p>Join our mobile team to create innovative iOS and Android applications. You'll work on user-centric designs and implement features that delight our users.</p>",
    pubDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    salaryMin: 100000,
    salaryMax: 140000,
    salaryCurrency: "USD",
    salaryPeriod: "year",
    saved: false
  },
  {
    id: "6",
    url: "https://example.com/job/6",
    jobTitle: "Data Scientist",
    companyName: "Analytics Pro",
    companyLogo: "https://via.placeholder.com/50",
    jobIndustry: ["Data Science", "Machine Learning"],
    jobType: ["full-time"],
    jobGeo: "Boston, MA",
    jobLevel: "Senior",
    jobExcerpt: "Analyze datasets and build ML models for data-driven d",
    jobDescription: "<p>We're seeking a Data Scientist to analyze complex datasets and build predictive models. You'll work with cutting-edge machine learning techniques and drive data-driven decisions.</p>",
    pubDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    salaryMin: 130000,
    salaryMax: 170000,
    salaryCurrency: "USD",
    salaryPeriod: "year",
    saved: false
  },
  {
    id: "7",
    url: "https://example.com/job/7",
    jobTitle: "UI/UX Designer",
    companyName: "Creative Minds Agency",
    companyLogo: "https://via.placeholder.com/50",
    jobIndustry: ["Design", "User Experience"],
    jobType: ["part-time"],
    jobGeo: "Anywhere",
    jobLevel: "Mid",
    jobExcerpt: "Design intuitive and beautiful user interfaces",
    jobDescription: "<p>Looking for a creative UI/UX Designer to design intuitive and beautiful user interfaces. You'll collaborate with developers to bring designs to life.</p>",
    pubDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    salaryMin: 50,
    salaryMax: 70,
    salaryCurrency: "USD",
    salaryPeriod: "hour",
    saved: true
  },
  {
    id: "8",
    url: "https://example.com/job/8",
    jobTitle: "Backend Developer",
    companyName: "Server Solutions Inc",
    companyLogo: "https://via.placeholder.com/50",
    jobIndustry: ["Software Development"],
    jobType: ["full-time"],
    jobGeo: "Chicago, IL",
    jobLevel: "Entry",
    jobExcerpt: "Entry-level position for server-side development",
    jobDescription: "<p>Entry-level Backend Developer position to work on server-side applications. Perfect opportunity for recent graduates to grow their skills in a supportive environment.</p>",
    pubDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    salaryMin: 70000,
    salaryMax: 95000,
    salaryCurrency: "USD",
    salaryPeriod: "year",
    saved: false
  },
  {
    id: "9",
    url: "https://example.com/job/9",
    jobTitle: "QA Engineer",
    companyName: "Quality First Tech",
    companyLogo: "https://via.placeholder.com/50",
    jobIndustry: ["Quality Assurance", "Testing"],
    jobType: ["full-time"],
    jobGeo: "Anywhere",
    jobLevel: "Mid",
    jobExcerpt: "Ensure software quality through manual and automated t",
    jobDescription: "<p>Join our QA team to ensure the quality of our software products. You'll design test cases, perform manual and automated testing, and work closely with developers.</p>",
    pubDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    salaryMin: 85000,
    salaryMax: 115000,
    salaryCurrency: "USD",
    salaryPeriod: "year",
    saved: false
  },
  {
    id: "10",
    url: "https://example.com/job/10",
    jobTitle: "Software Engineering Intern",
    companyName: "Future Tech Labs",
    companyLogo: "https://via.placeholder.com/50",
    jobIndustry: ["Software Development"],
    jobType: ["internship"],
    jobGeo: "San Jose, CA",
    jobLevel: "Entry",
    jobExcerpt: "Summer internship for CS students in fast-paced startu",
    jobDescription: "<p>Summer internship opportunity for computer science students. Work on real projects and learn from experienced engineers in a fast-paced startup environment.</p>",
    pubDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    salaryMin: 25,
    salaryMax: 25,
    salaryCurrency: "USD",
    salaryPeriod: "hour",
    saved: false
  }
];

// ========== STATE MANAGEMENT ==========

let currentPage = 1;
const itemsPerPage = 5;
let filteredJobs = [...DUMMY_JOBS];
let searchQuery = "";
let activeFilters = {
  type: "",
  experience: "",
  location: ""
};

// ========== HELPER FUNCTIONS ==========

function getJobTypeClass(typeArray) {
  const type = Array.isArray(typeArray) ? typeArray[0] : typeArray;
  const typeMap = {
    'full-time': 'full-time',
    'part-time': 'part-time',
    'contract': 'contract',
    'internship': 'internship'
  };
  return typeMap[type] || 'full-time';
}

function getJobTypeLabel(typeArray) {
  const type = Array.isArray(typeArray) ? typeArray[0] : typeArray;
  const labelMap = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    'contract': 'Contract',
    'internship': 'Internship'
  };
  return labelMap[type] || type;
}

function formatSalary(job) {
  if (!job.salaryMin && !job.salaryMax) return 'Competitive';
  
  const currency = job.salaryCurrency || 'USD';
  const symbol = currency === 'USD' ? '$' : currency;
  const period = job.salaryPeriod || 'year';
  
  const formatNum = (num) => {
    if (period === 'hour' || period === 'day') return num;
    return num >= 1000 ? `${Math.floor(num / 1000)}k` : num;
  };
  
  if (job.salaryMin && job.salaryMax && job.salaryMin !== job.salaryMax) {
    return `${symbol}${formatNum(job.salaryMin)} - ${symbol}${formatNum(job.salaryMax)}${period === 'hour' ? '/hr' : ''}`;
  } else {
    const salary = job.salaryMin || job.salaryMax;
    return `${symbol}${formatNum(salary)}${period === 'hour' ? '/hr' : ''}`;
  }
}

function extractSkillsFromHTML(html) {
  // Extract potential skills from job description
  const skillKeywords = ['React', 'Node.js', 'Python', 'Java', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'Git', 'Agile', 'REST API', 'GraphQL'];
  const foundSkills = [];
  
  skillKeywords.forEach(skill => {
    if (html.toLowerCase().includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  return foundSkills.slice(0, 5); // Return max 5 skills
}

function getWorkMode(jobGeo) {
  // Determine work mode from location
  if (jobGeo.toLowerCase().includes('anywhere') || jobGeo.toLowerCase().includes('remote')) {
    return 'remote';
  }
  return 'onsite';
}

// ========== FILTERING & SEARCHING ==========

function applyFilters() {
  filteredJobs = DUMMY_JOBS.filter(job => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const jobType = Array.isArray(job.jobType) ? job.jobType[0] : job.jobType;
      const matchesSearch = 
        job.jobTitle.toLowerCase().includes(query) ||
        job.companyName.toLowerCase().includes(query) ||
        job.jobIndustry.some(industry => industry.toLowerCase().includes(query)) ||
        job.jobDescription.toLowerCase().includes(query) ||
        job.jobExcerpt.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // Type filter
    if (activeFilters.type) {
      const jobType = Array.isArray(job.jobType) ? job.jobType[0] : job.jobType;
      if (jobType !== activeFilters.type) return false;
    }

    // Experience filter
    if (activeFilters.experience) {
      const levelMap = { 'entry': 'Entry', 'mid': 'Mid', 'senior': 'Senior' };
      if (job.jobLevel !== levelMap[activeFilters.experience]) return false;
    }

    // Location filter
    if (activeFilters.location) {
      const workMode = getWorkMode(job.jobGeo);
      if (workMode !== activeFilters.location) return false;
    }

    return true;
  });

  currentPage = 1;
  renderResults();
}

// ========== RENDERING FUNCTIONS ==========

function createJobCard(job) {
  const card = document.createElement('div');
  card.className = 'job-result-card';
  card.setAttribute('data-job-id', job.id);
  
  const skills = extractSkillsFromHTML(job.jobDescription);
  const salary = formatSalary(job);
  const workMode = getWorkMode(job.jobGeo);

  card.innerHTML = `
    <div class="job-result-header">
      <div class="job-result-main">
        <h3 class="job-result-title">
          ${job.jobTitle}
          <span class="job-type-badge ${getJobTypeClass(job.jobType)}">
            ${getJobTypeLabel(job.jobType)}
          </span>
        </h3>
        <p class="job-result-company">${job.companyName}</p>
        <div class="job-result-location">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          ${job.jobGeo}
        </div>
      </div>
      <div class="job-result-actions">
        <button class="action-btn save-job-btn ${job.saved ? 'saved' : ''}" data-job-id="${job.id}" title="${job.saved ? 'Saved' : 'Save job'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${job.saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
          </svg>
        </button>
        <button class="action-btn share-job-btn" data-job-id="${job.id}" title="Share job">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
        </button>
      </div>
    </div>

    <div class="job-result-details">
      <div class="job-detail-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        ${workMode.charAt(0).toUpperCase() + workMode.slice(1)}
      </div>
      <div class="job-detail-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
        ${salary}
      </div>
      <div class="job-detail-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <polyline points="16 11 18 13 22 9"></polyline>
        </svg>
        ${job.jobLevel || 'Any'} Level
      </div>
    </div>

    <p class="job-result-description">${job.jobExcerpt}</p>

    <div class="job-result-tags">
      ${job.jobIndustry.map(industry => `<span class="job-tag">${industry}</span>`).join('')}
      ${skills.length > 0 ? skills.map(skill => `<span class="job-tag">${skill}</span>`).join('') : ''}
    </div>

    <div class="job-result-footer">
      <span class="job-posted-time">Posted ${getPassedTime(job.pubDate)}</span>
      <button class="job-apply-btn" data-job-id="${job.id}">Apply Now</button>
    </div>
  `;

  return card;
}

function showLoading() {
  const resultsContainer = document.getElementById('jobSearchResults');
  resultsContainer.innerHTML = `
    <div class="job-search-loading">
      <div class="spinner"></div>
      <p>Searching for jobs...</p>
    </div>
  `;
}

function showEmptyState() {
  const resultsContainer = document.getElementById('jobSearchResults');
  resultsContainer.innerHTML = `
    <div class="job-search-empty">
      <svg class="job-search-empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <h3>No jobs found</h3>
      <p>Try adjusting your search or filters to find what you're looking for</p>
    </div>
  `;
  
  document.getElementById('jobSearchPagination').style.display = 'none';
}

function renderResults() {
  const resultsContainer = document.getElementById('jobSearchResults');
  
  if (filteredJobs.length === 0) {
    showEmptyState();
    return;
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const jobsToShow = filteredJobs.slice(startIdx, endIdx);

  // Render results header
  resultsContainer.innerHTML = `
    <div class="results-header">
      <div class="results-count">
        Found <strong>${filteredJobs.length}</strong> ${filteredJobs.length === 1 ? 'job' : 'jobs'}
        ${searchQuery ? `for "<strong>${searchQuery}</strong>"` : ''}
      </div>
    </div>
  `;

  // Render job cards
  jobsToShow.forEach(job => {
    const card = createJobCard(job);
    resultsContainer.appendChild(card);
  });

  // Update pagination
  updatePagination(totalPages);

  // Attach event listeners
  attachJobCardListeners();
}

function updatePagination(totalPages) {
  const paginationContainer = document.getElementById('jobSearchPagination');
  const paginationInfo = document.getElementById('paginationInfo');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');

  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }

  paginationContainer.style.display = 'flex';
  paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// ========== EVENT HANDLERS ==========

function attachJobCardListeners() {
  // Save job buttons
  document.querySelectorAll('.save-job-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const jobId = btn.getAttribute('data-job-id');
      toggleSaveJob(jobId);
    });
  });

  // Share job buttons
  document.querySelectorAll('.share-job-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const jobId = btn.getAttribute('data-job-id');
      shareJob(jobId);
    });
  });

  // Apply buttons
  document.querySelectorAll('.job-apply-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const jobId = btn.getAttribute('data-job-id');
      applyToJob(jobId);
    });
  });

  // Job card click to view details
  document.querySelectorAll('.job-result-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Only trigger if not clicking on a button
      if (!e.target.closest('button')) {
        const jobId = card.getAttribute('data-job-id');
        viewJobDetails(jobId);
      }
    });
  });
}

function toggleSaveJob(jobId) {
  const job = DUMMY_JOBS.find(j => j.id === jobId);
  if (job) {
    job.saved = !job.saved;
    renderResults();
    
    // Show feedback
    const message = job.saved ? 'Job saved!' : 'Job removed from saved';
    showToast(message);
  }
}

function shareJob(jobId) {
  const job = DUMMY_JOBS.find(j => j.id === jobId);
  if (job) {
    // In real implementation, this would open a share dialog
    // For now, just copy to clipboard
    const shareText = `Check out this job: ${job.jobTitle} at ${job.companyName}\n${job.url}`;
    navigator.clipboard.writeText(shareText).then(() => {
      showToast('Job link copied to clipboard!');
    });
  }
}

function applyToJob(jobId) {
  const job = DUMMY_JOBS.find(j => j.id === jobId);
  if (job) {
    // In real implementation, this would navigate to the job application page
    showToast(`Applying to ${job.jobTitle}...`);
    
    // Simulate opening external link
    setTimeout(() => {
      window.open(job.url, '_blank');
    }, 500);
  }
}

function viewJobDetails(jobId) {
  const job = DUMMY_JOBS.find(j => j.id === jobId);
  if (job) {
    // In real implementation, this might open a detailed view modal or navigate to job page
    console.log('Viewing job details:', job);
    showToast(`Opening ${job.jobTitle} details...`);
  }
}

function showToast(message) {
  // Simple toast notification
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--text-primary);
    color: var(--text-white);
    padding: 12px 20px;
    border-radius: var(--border-radius-lg);
    font-size: var(--font-size-sm);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ========== INITIALIZATION ==========

function initJobSearchModal() {
  const searchInput = document.getElementById('jobSearchInput');
  const searchBtn = document.getElementById('jobSearchBtn');
  const typeFilter = document.getElementById('jobTypeFilter');
  const experienceFilter = document.getElementById('experienceFilter');
  const locationFilter = document.getElementById('locationFilter');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');

  // Search functionality
  searchBtn.addEventListener('click', () => {
    searchQuery = searchInput.value.trim();
    applyFilters();
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchQuery = searchInput.value.trim();
      applyFilters();
    }
  });

  // Filter functionality
  typeFilter.addEventListener('change', (e) => {
    activeFilters.type = e.target.value;
    applyFilters();
  });

  experienceFilter.addEventListener('change', (e) => {
    activeFilters.experience = e.target.value;
    applyFilters();
  });

  locationFilter.addEventListener('change', (e) => {
    activeFilters.location = e.target.value;
    applyFilters();
  });

  // Pagination
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderResults();
      document.getElementById('jobSearchResults').scrollTop = 0;
    }
  });

  nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderResults();
      document.getElementById('jobSearchResults').scrollTop = 0;
    }
  });

  // Listen for modal open event to load initial data
  const modal = document.getElementById('jobSearchModal');
  modal.addEventListener('show.bs.modal', () => {
    // Simulate loading
    showLoading();
    setTimeout(() => {
      renderResults();
    }, 800);
  });

  // Reset filters when modal closes
  modal.addEventListener('hidden.bs.modal', () => {
    searchInput.value = 'Software Engineer';
    searchQuery = '';
    activeFilters = { type: '', experience: '', location: '' };
    typeFilter.value = '';
    experienceFilter.value = '';
    locationFilter.value = '';
    currentPage = 1;
    filteredJobs = [...DUMMY_JOBS];
  });
}

// Add CSS animation for toast
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initJobSearchModal);
} else {
  initJobSearchModal();
}
