// endpoint to fetch job search results from Remotive API
// endpoint : GET /api/opportunities
// params :
/*
search - Search by job title and description (string)
limit - Number of listings to return (number, range: 1-100)
company_name - Filter by company name (string)
category - Filter by job category (string)
*/

// ========== STATE MANAGEMENT ==========




class JobSearchState {
  constructor() {
    this.currentPage = 1;
    this.itemsPerPage = 10; // Changed to 10 jobs per page
    this.allJobs = [];
    this.filteredJobs = [];
    this.searchQuery = "";
    this.activeFilters = {
      type: "",
      experience: "",
      location: "",
      category: "", // Added category filter
      limit: "100", // Added limit filter (default 100)
    };
    this.savedJobIds = new Set();
    this.isLoading = false;
    this.hasError = false;
  }

  resetFilters() {
    this.searchQuery = "";
    this.activeFilters = { type: "", experience: "", location: "", category: "", limit: "100" };
    this.currentPage = 1;
  }

  setSearchQuery(query) {
    this.searchQuery = query;
    this.currentPage = 1;
  }

  setFilter(filterType, value) {
    this.activeFilters[filterType] = value;
    this.currentPage = 1;
  }

  toggleSavedJob(jobId) {
    if (this.savedJobIds.has(jobId)) {
      this.savedJobIds.delete(jobId);
      return false;
    } else {
      this.savedJobIds.add(jobId);
      return true;
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      return true;
    }
    return false;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      return true;
    }
    return false;
  }

  getCurrentPageJobs() {
    const startIdx = (this.currentPage - 1) * this.itemsPerPage;
    const endIdx = startIdx + this.itemsPerPage;
    return this.filteredJobs.slice(startIdx, endIdx);
  }

  getTotalPages() {
    return Math.ceil(this.filteredJobs.length / this.itemsPerPage);
  }
}

const state = new JobSearchState();

// ========== HELPER FUNCTIONS ==========

function getJobTypeClass(typeArray) {
  const type = Array.isArray(typeArray) ? typeArray[0] : typeArray;
  const typeMap = {
    "full-time": "full-time",
    "part-time": "part-time",
    contract: "contract",
    internship: "internship",
  };
  return typeMap[type] || "full-time";
}

function getJobTypeLabel(typeArray) {
  const type = Array.isArray(typeArray) ? typeArray[0] : typeArray;
  const labelMap = {
    "full-time": "Full Time",
    "part-time": "Part Time",
    contract: "Contract",
    internship: "Internship",
  };
  return labelMap[type] || type;
}

function formatSalary(job) {
  if (!job.salaryMin && !job.salaryMax) return "Competitive";

  const currency = job.salaryCurrency || "USD";
  const symbol = currency === "USD" ? "$" : currency;
  const period = job.salaryPeriod || "year";

  const formatNum = (num) => {
    if (period === "hour" || period === "day") return num;
    return num >= 1000 ? `${Math.floor(num / 1000)}k` : num;
  };

  if (job.salaryMin && job.salaryMax && job.salaryMin !== job.salaryMax) {
    return `${symbol}${formatNum(job.salaryMin)} - ${symbol}${formatNum(job.salaryMax)}${period === "hour" ? "/hr" : ""}`;
  } else {
    const salary = job.salaryMin || job.salaryMax;
    return `${symbol}${formatNum(salary)}${period === "hour" ? "/hr" : ""}`;
  }
}

function extractSkillsFromHTML(html) {
  // Extract potential skills from job description
  const skillKeywords = [
    "React",
    "Node.js",
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "AWS",
    "Docker",
    "Kubernetes",
    "SQL",
    "MongoDB",
    "Git",
    "Agile",
    "REST API",
    "GraphQL",
  ];
  const foundSkills = [];

  skillKeywords.forEach((skill) => {
    if (html.toLowerCase().includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  return foundSkills.slice(0, 5); // Return max 5 skills
}

function getWorkMode(jobGeo) {
  // Determine work mode from location
  if (jobGeo.toLowerCase().includes("anywhere") || jobGeo.toLowerCase().includes("remote")) {
    return "remote";
  }
  return "onsite";
}

function extractExcerpt(description) {
  // Remove HTML tags and extract first 55 characters
  const text = description.replace(/<[^>]*>/g, "").trim();
  return text.length > 55 ? text.substring(0, 55) : text;
}

function extractJobLevel(title, description) {
  // Extract job level from title or description
  const combined = `${title} ${description}`.toLowerCase();
  
  if (combined.includes("senior") || combined.includes("sr.") || combined.includes("lead")) {
    return "Senior";
  }
  if (combined.includes("junior") || combined.includes("jr.") || combined.includes("entry")) {
    return "Entry";
  }
  if (combined.includes("intern") || combined.includes("internship")) {
    return "Entry";
  }
  return "Mid";
}

function parseSalaryMin(salaryString) {
  // Parse minimum salary from string like "$170k - $200k" or "$170,000 - $200,000"
  if (!salaryString) return null;
  
  const match = salaryString.match(/\$([\d,]+)k?/);
  if (match) {
    const value = match[1].replace(/,/g, "");
    return match[0].includes("k") ? parseInt(value) * 1000 : parseInt(value);
  }
  return null;
}

function parseSalaryMax(salaryString) {
  // Parse maximum salary from string like "$170k - $200k" or "$170,000 - $200,000"
  if (!salaryString) return null;
  
  const matches = salaryString.match(/\$([\d,]+)k?/g);
  if (matches && matches.length >= 2) {
    const match = matches[1].match(/\$([\d,]+)k?/);
    if (match) {
      const value = match[1].replace(/,/g, "");
      return match[0].includes("k") ? parseInt(value) * 1000 : parseInt(value);
    }
  } else if (matches && matches.length === 1) {
    return parseSalaryMin(salaryString);
  }
  return null;
}

// ========== FILTERING & SEARCHING ==========

async function fetchJobsFromAPI() {
  try {
    // If search query is empty, show initial state
    if (!state.searchQuery || state.searchQuery.trim() === "") {
      state.isLoading = false;
      state.hasError = false;
      state.allJobs = [];
      state.filteredJobs = [];
      showInitialState();
      const paginationContainer = document.getElementById("jobSearchPagination");
      if (paginationContainer) paginationContainer.style.display = "none";
      return;
    }

    state.isLoading = true;
    state.hasError = false;
    showLoading();

    // Map filters to Remotive API parameters
    const params = {
      limit: parseInt(state.activeFilters.limit) || 100, // Use limit from filter
      search: encodeURIComponent(state.searchQuery), // Encode search query for URL
      category: state.activeFilters.category || "", // Use category from filter
    };
    console.log("Fetching jobs with params:", params);

    const response = await getOpportunities(params);

    if (response.success && response.data) {
      // Transform Remotive API response to match our data structure
      const remotiveJobs = response.data.jobs || [];
      
      state.allJobs = remotiveJobs.map((job) => ({
        id: String(job.id),
        url: job.url,
        jobTitle: job.title,
        companyName: job.company_name,
        companyLogo: job.company_logo_url || job.company_logo,
        jobIndustry: [job.category], // Convert single category to array
        jobType: [job.job_type?.replace("_", "-") || "full-time"], // Convert "full_time" to "full-time"
        jobGeo: job.candidate_required_location || "Remote",
        jobLevel: extractJobLevel(job.title, job.description), // Extract from title/description
        jobExcerpt: extractExcerpt(job.description),
        jobDescription: job.description,
        pubDate: job.publication_date,
        salary: job.salary,
        salaryMin: parseSalaryMin(job.salary),
        salaryMax: parseSalaryMax(job.salary),
        salaryCurrency: "USD",
        salaryPeriod: "year",
        tags: job.tags || [],
      }));
      
      state.isLoading = false;
      state.hasError = false;
      
      // Apply client-side filters
      state.filteredJobs = [...state.allJobs];
      applyClientSideFilters();
    } else {
      state.isLoading = false;
      state.hasError = true;
      renderResults();
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
    state.isLoading = false;
    state.hasError = true;
    renderResults();
  }
}

function applyClientSideFilters() {
  state.filteredJobs = state.allJobs.filter((job) => {
    // Client-side filtering after API results (type, experience, location)
    
    // Type filter
    if (state.activeFilters.type) {
      const jobType = Array.isArray(job.jobType) ? job.jobType[0] : job.jobType;
      if (jobType !== state.activeFilters.type) return false;
    }

    // Experience filter
    if (state.activeFilters.experience) {
      const levelMap = { entry: "Entry", mid: "Mid", senior: "Senior" };
      if (job.jobLevel !== levelMap[state.activeFilters.experience]) return false;
    }

    // Location filter
    if (state.activeFilters.location) {
      const workMode = getWorkMode(job.jobGeo);
      if (workMode !== state.activeFilters.location) return false;
    }

    return true;
  });

  state.currentPage = 1;
  renderResults();
}

function applyFilters(refetch = false) {
  // If category or limit changed, refetch from API
  // Otherwise just apply client-side filters
  if (refetch) {
    fetchJobsFromAPI();
  } else {
    applyClientSideFilters();
  }
}

// ========== RENDERING ==========

function createJobCard(job) {
  const skills = extractSkillsFromHTML(job.jobDescription);
  const salary = formatSalary(job);
  const workMode = getWorkMode(job.jobGeo);
  const isSaved = state.savedJobIds.has(job.id);

 const html  = `
    <div class="job-result-card" data-job-id="${job.id}">
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
        ${job.jobLevel || "Any"} Level
      </div>
    </div>

    <p class="job-result-description">${job.jobExcerpt}</p>

    <div class="job-result-tags">
      ${job.jobIndustry.map((industry) => `<span class="job-tag">${industry}</span>`).join("")}
      ${skills.length > 0 ? skills.map((skill) => `<span class="job-tag">${skill}</span>`).join("") : ""}
    </div>

    <div class="job-result-footer">
      <span class="job-posted-time">Posted ${getPassedTime(job.pubDate)}</span>
      <button class="job-apply-btn" data-job-id="${job.id}">Apply Now</button>
    </div>
    </div>
  `;

  return htmlToElements(html)[0];
}

function showLoading() {
  const resultsContainer = document.getElementById("jobSearchResults");
  showLoader("Searching for jobs...",resultsContainer);
}

function showInitialState() {
  const resultsContainer = document.getElementById("jobSearchResults");
  resultsContainer.innerHTML = `
    <div class="job-search-empty">
      <svg class="job-search-empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        <circle cx="11" cy="11" r="2"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <h3>Ready to Find Your Dream Job?</h3>
      <p>Enter keywords, job titles, or company names in the search bar above to discover thousands of opportunities</p>
      <button class="job-apply-btn" onclick="document.getElementById('jobSearchInput').focus()" style="margin-top: 1rem;">Start Searching</button>
    </div>
  `;
}

function showEmptyState() {
  const resultsContainer = document.getElementById("jobSearchResults");
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
}

function showErrorState() {
  const resultsContainer = document.getElementById("jobSearchResults");
  resultsContainer.innerHTML = `
    <div class="job-search-empty">
      <svg class="job-search-empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h3>Failed to load jobs</h3>
      <p>Please try again later</p>
      <button class="job-apply-btn" onclick="fetchJobsFromAPI()" style="margin-top: 1rem;">Retry</button>
    </div>
  `;
}

function renderResults() {
  const resultsContainer = document.getElementById("jobSearchResults");
  const paginationContainer = document.getElementById("jobSearchPagination");

  if (state.isLoading) {
    showLoading();
    if (paginationContainer) paginationContainer.style.display = "none";
    return;
  }

  if (state.hasError) {
    showErrorState();
    if (paginationContainer) paginationContainer.style.display = "none";
    return;
  }

  if (state.filteredJobs.length === 0) {
    showEmptyState();
    if (paginationContainer) paginationContainer.style.display = "none";
    return;
  }

  const totalPages = state.getTotalPages();
  const jobsToShow = state.getCurrentPageJobs();

  // Render results header
  resultsContainer.innerHTML = `
    <div class="results-header">
      <div class="results-count">
        Found <strong>${state.filteredJobs.length}</strong> ${state.filteredJobs.length === 1 ? "job" : "jobs"}
        ${state.searchQuery ? `for "<strong>${state.searchQuery}</strong>"` : ""}
      </div>
    </div>
  `;

  // Render job cards
  jobsToShow.forEach((job) => {
    const card = createJobCard(job);
    resultsContainer.appendChild(card);
  });

  updatePagination(totalPages);
  attachJobCardListeners();
}

function updatePagination(totalPages) {
  const paginationContainer = document.getElementById("jobSearchPagination");
  const paginationInfo = document.getElementById("paginationInfo");
  const prevBtn = document.getElementById("prevPageBtn");
  const nextBtn = document.getElementById("nextPageBtn");

  if (totalPages <= 1 || !paginationContainer) {
    if (paginationContainer) {
      paginationContainer.style.display = "none";
    }
    return;
  }

  paginationContainer.style.display = "flex";
  paginationInfo.textContent = `Page ${state.currentPage} of ${totalPages}`;

  prevBtn.disabled = state.currentPage === 1;
  nextBtn.disabled = state.currentPage >= totalPages;
}

// ========== EVENT HANDLERS ==========

function attachJobCardListeners() {
  // Save job buttons
  document.querySelectorAll(".save-job-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const jobId = btn.getAttribute("data-job-id");
      toggleSaveJob(jobId);
    });
  });

  // Share job buttons
  document.querySelectorAll(".share-job-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const jobId = btn.getAttribute("data-job-id");
      shareJob(jobId);
    });
  });

  // Apply buttons
  document.querySelectorAll(".job-apply-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const jobId = btn.getAttribute("data-job-id");
      applyToJob(jobId);
    });
  });

  // Job card click to view details
  document.querySelectorAll(".job-result-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      // Only trigger if not clicking on a button
      if (!e.target.closest("button")) {
        const jobId = card.getAttribute("data-job-id");
        viewJobDetails(jobId);
      }
    });
  });
}

function toggleSaveJob(jobId) {
  const wasSaved = state.toggleSavedJob(jobId);
  showToast(wasSaved ? "Job saved!" : "Job removed from saved");
  renderResults();
}

function shareJob(jobId) {
  const job = state.allJobs.find((j) => j.id === jobId);
  if (job) {
    const shareText = `Check out this job: ${job.jobTitle} at ${job.companyName}\n${job.url}`;
    navigator.clipboard.writeText(shareText).then(() => {
      showToast("Job link copied to clipboard!");
    });
  }
}

function applyToJob(jobId) {
  const job = state.allJobs.find((j) => j.id === jobId);
  if (job) {
    showToast(`Applying to ${job.jobTitle}...`);
    setTimeout(() => {
      window.open(job.url, "_blank");
    }, 500);
  }
}

function viewJobDetails(jobId) {
  const job = state.allJobs.find((j) => j.id === jobId);
  if (job) {
    console.log("Viewing job details:", job);
    showToast(`Opening ${job.jobTitle} details...`);
  }
}

function showToast(message) {
  // Simple toast notification
  const toast = document.createElement("div");
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
    toast.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ========== INITIALIZATION ==========

function initJobSearchModal() {
  const searchInput = document.getElementById("jobSearchInput");
  const searchBtn = document.getElementById("jobSearchBtn");
  const categoryFilter = document.getElementById("categoryFilter");
  const limitFilter = document.getElementById("limitFilter");
  const typeFilter = document.getElementById("jobTypeFilter");
  const experienceFilter = document.getElementById("experienceFilter");
  const locationFilter = document.getElementById("locationFilter");
  const prevBtn = document.getElementById("prevPageBtn");
  const nextBtn = document.getElementById("nextPageBtn");

  // Search functionality (refetch from API)
  searchBtn.addEventListener("click", () => {
    state.setSearchQuery(searchInput.value.trim());
    applyFilters(true); // Refetch from API
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      state.setSearchQuery(searchInput.value.trim());
      applyFilters(true); // Refetch from API
    }
  });

  // API filters (category, limit) - refetch from API
  categoryFilter.addEventListener("change", (e) => {
    state.setFilter("category", e.target.value);
    applyFilters(true); // Refetch from API
  });

  limitFilter.addEventListener("change", (e) => {
    state.setFilter("limit", e.target.value);
    applyFilters(true); // Refetch from API
  });

  // Client-side filters (type, experience, location) - no refetch
  typeFilter.addEventListener("change", (e) => {
    state.setFilter("type", e.target.value);
    applyFilters(false); // Client-side filter only
  });

  experienceFilter.addEventListener("change", (e) => {
    state.setFilter("experience", e.target.value);
    applyFilters(false); // Client-side filter only
  });

  locationFilter.addEventListener("change", (e) => {
    state.setFilter("location", e.target.value);
    applyFilters(false); // Client-side filter only
  });

  // Pagination
  prevBtn.addEventListener("click", () => {
    if (state.prevPage()) {
      renderResults();
      document.getElementById("jobSearchResults").scrollTop = 0;
    }
  });

  nextBtn.addEventListener("click", () => {
    if (state.nextPage()) {
      renderResults();
      document.getElementById("jobSearchResults").scrollTop = 0;
    }
  });

  // Listen for modal open event to load initial data
  const modal = document.getElementById("jobSearchModal");
  modal.addEventListener("show.bs.modal", () => {
    // Show initial state if no search query, otherwise show results or fetch
    if (!state.searchQuery || state.searchQuery.trim() === "") {
      showInitialState();
      const paginationContainer = document.getElementById("jobSearchPagination");
      if (paginationContainer) paginationContainer.style.display = "none";
    } else if (state.allJobs.length === 0) {
      fetchJobsFromAPI();
    } else {
      renderResults();
    }
  });

  // Reset filters when modal closes
  modal.addEventListener("hidden.bs.modal", () => {
    searchInput.value = "";
    state.resetFilters();
    categoryFilter.value = "";
    limitFilter.value = "100";
    typeFilter.value = "";
    experienceFilter.value = "";
    locationFilter.value = "";
  });
}

// Add CSS animation for toast
const style = document.createElement("style");
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
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initJobSearchModal);
} else {
  initJobSearchModal();
}
