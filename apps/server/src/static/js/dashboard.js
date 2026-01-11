function loadStats(stats, containerSelector = "#stats-container") {
  const atsScore = stats.career.atsScore;
  const atsCard = createScoreCircle({ score: atsScore, color: getWarningColor(atsScore) });
  const jobMatchCard = createJobMatchCard(stats.jobStats.thisWeek);
  const skillsGapCard = createSkillsGapCard(stats.career.skillGaps);
  const bestRoleCard = createBestRoleCard(stats.career.bestRole);
  const nextBestRoleCard = createNextBestRoleCard(stats.career.nearestNextRole);
  
  let container;
  if (typeof containerSelector === "string") {
    container = document.querySelector(containerSelector);
  } else {
    container = containerSelector;
  }
  // Clear existing content
  container.innerHTML = "";
  //Load components into the container
  
  loadComponents([atsCard, jobMatchCard, bestRoleCard ,nextBestRoleCard], containerSelector);
}
function loadAnalysedJobs(jobs, containerSelector = "section.jobs .opportunities") {
  const container = document.querySelector(containerSelector);
  // Clear existing content
  container.innerHTML = "";
  const jobElements = jobs.suggestions.suggestions.map(({ job, aiResponse, createdAt }) => {
    const card = createAnalysedJobCard({
      title: job.meta.title,
      company: job.meta.companyName,
      skills: job.skills.required.map((s) => s.name),
      match: aiResponse.stats.match,
      createdAt,
    });
    const contentWrapper = document.querySelector("#analyzeModal  #contentWrapper");
    // Add event listener to open modal on click
    card.addEventListener("click", () => {
      insertOpportunityAnalysisResults(aiResponse, contentWrapper);
    });
    return card;
  });
  loadComponents(jobElements, container);
}
function loadSkillGapsList(skills,nearestRole, containerSelector = "#skills-gap-list") {
  const container = document.querySelector(containerSelector);
  const titleElement = container.querySelector(".role-title");
  titleElement.textContent = capitalizeEachLetter(nearestRole);
  const listComponent = createList(skills);
  container.appendChild(listComponent);
}

function showNoOpportunitiesMessage() {
  const noResultsElement = createNoResultsMessageElement({
    illustration: "../assets/noResults.illustration.svg",
    title: "No analyzed opportunities",
    message: "Click the + button to analyze how well an opportunity fits your resume.",
  });
  loadComponents(noResultsElement, "section.jobs .opportunities");
}
function setDashboardInfo(user) {
  const userNameElement = document.querySelector(".top-user > span.user-name");
  const userAvatarElement = document.querySelector(".top-user > img.avatar");
  if (userAvatarElement) {
    // Set default avatar for now data point : user.profileImage
    userAvatarElement.src = "../assets/default-avatar.png";
  }
  if (userNameElement) {
    userNameElement.textContent = capitalizeEachLetter(user.name) || "User";
  }
}
// Handle opportunity analysis form submission
async function handleOpportunityAnalysis(event) {
  event.preventDefault();
  const form = event.target;
}

async function handleSearchInput(query) {
  setParams({ q: query });
  window.location.reload();
  // await initializeDashboard();
}
function applyPagination(metadata) {
  const paginationContainer = document.querySelector("section.jobs .pagination-container");
  // Clear existing pagination
  paginationContainer.innerHTML = "";
  const paginationComponent = createPagination(metadata);
  paginationContainer.appendChild(paginationComponent);
}

function applyOpportunitySearchFilter() {
  const searchInput = document.getElementById("opportunitySearch");
  const searchBtn = document.getElementById("opportunitySearchBtn");
  searchInput.addEventListener("keyup", (event)=>{
    const key = event.key ;
    if (key === "Enter"){
      handleSearchInput(searchInput.value.trim());
    }
  });
  searchBtn.addEventListener("click", (event)=>{
    if (searchInput.value.trim() === "") return;
    handleSearchInput(searchInput.value.trim());
  });
}

// Initialization of the dashboard
async function initializeDashboard() {
  const dashboard = document.querySelector(".app .dashboard");
  // Fetch and load stats
  hideElement(dashboard);
  showLoader("Loading dashboard...", dashboard.parentElement);
  const stats = await getDashboardStats();
  loadStats(stats.data);
  setDashboardInfo(stats.data.user);
  // Fetch and load analysed jobs
  const jobs = await getAnalysedJobs();
  if (jobs.data.suggestions.suggestions.length === 0) {
    showNoOpportunitiesMessage();
  } else {
    
    loadAnalysedJobs(jobs.data);
    applyPagination(jobs.data.suggestions.meta);
  }
  // Load skill gaps list
  loadSkillGapsList(stats.data.career.skillGaps, stats.data.career.nearestNextRole);
  // simulating delay of 1sec for testing loader
  await new Promise((resolve) => setTimeout(resolve, 1000));
  removeLoader(dashboard.parentElement);
  showElement(dashboard);
  const contentWrapper = document.querySelector("#analyzeModal  #contentWrapper");
  insertOpportunityAnalysisForm(contentWrapper);
  const form = contentWrapper.querySelector("#jobForm");
  await initOpportunityFormLogic(form);
  applyOpportunitySearchFilter();
}

window.addEventListener("DOMContentLoaded", async () => {
  await initializeDashboard();
});
