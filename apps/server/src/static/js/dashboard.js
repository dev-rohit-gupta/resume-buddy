function loadStats(stats, containerSelector = "#stats-container") {
  const atsScore = stats.career.atsScore;
  const atsCard = createScoreCircle({ score: atsScore, color: getWarningColor(atsScore) });
  const jobMatchCard = createJobMatchCard(stats.jobStats.thisWeek);
  const skillsGapCard = createSkillsGapCard(stats.career.skillGaps);
  const bestRoleCard = createBestRoleCard(stats.career.bestRole);
  //Load components into the container
  loadComponents([atsCard, jobMatchCard, skillsGapCard, bestRoleCard], containerSelector);
}
function loadAnalysedJobs(jobs, containerSelector = "section.jobs") {
  const container = document.querySelector(containerSelector);
  const jobElements = jobs.suggestions.suggestions.map(({ job, aiResponse, createdAt }) => {
    return createAnalysedJobCard({
      title: job.meta.title,
      company: job.meta.companyName,
      skills: job.skills.required.map((s) => s.name),
      match: aiResponse.stats.match,
      createdAt,
    });
  });
  loadComponents(jobElements, container);
}
function loadSkillGapsList(skills, containerSelector = "#skills-gap-list") {
  const container = document.querySelector(containerSelector);
  const listComponent = createList(skills);
  container.appendChild(listComponent);
}

function showNoOpportunitiesMessage() {
  const noResultsElement = createNoResultsMessageElement({
    illustration: "../assets/noResults.illustration.svg",
    title: "No analyzed opportunities",
    message:
      "Click the + button to analyze how well an opportunity fits your resume.",
  });
  loadComponents(noResultsElement, "section.jobs");
}
function setDashboardInfo(user) {
  const userNameElement = document.querySelector(".top-user > span.user-name");
  const userAvatarElement = document.querySelector(".top-user > img.avatar");
  if (userAvatarElement) {
    userAvatarElement.src = user.profileImage || "../assets/default-avatar.png";
  }
  if (userNameElement) {
    userNameElement.textContent = user.name || "User";
  }

}


// Initialization of the dashboard
async function initializeDashboard() {
  // Fetch and load stats
  const stats = await getDashboardStats();
  loadStats(stats.data);
  setDashboardInfo(stats.data.user);
  // Fetch and load analysed jobs
  const jobs = await getAnalysedJobs(10);
  if (jobs.data.suggestions.suggestions.length === 0) {
    showNoOpportunitiesMessage();
  } else {
    loadAnalysedJobs(jobs.data);
  }

  // Load skill gaps list
  loadSkillGapsList(stats.data.career.skillGaps);
}

window.addEventListener("DOMContentLoaded", async () => {
  await initializeDashboard();
});
