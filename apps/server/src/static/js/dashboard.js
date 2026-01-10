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
    message: "Click the + button to analyze how well an opportunity fits your resume.",
  });
  loadComponents(noResultsElement, "section.jobs");
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

const response = {
  success: true,
  message: "Job analyzed successfully",
  data: {
    analysisResult: {
      stats: {
        difficulty: "Beginner",
        learningFocused: true,
        competitionLevel: "High",
        match: "Low",
      },
      atsAnalysis: {
        atsScore: 45,
        selectionProbability: "Low",
        reasons: [
          "Missing specific keywords related to stock market analysis, financial modeling, and valuation.",
          "Resume heavily focused on software development, with limited direct experience in finance or stock markets.",
          "Required skills like 'Stock Trading' and 'Financial modeling valuation' are not explicitly mentioned or demonstrated.",
        ],
      },
      skillGapAnalysis: {
        matchedSkills: [
          "Adaptability",
          "Critical thinking",
          "Time Management",
          "English Proficiency (Spoken)",
        ],
        missingSkills: [
          {
            skill: "Stock Trading",
            priority: "High",
            whyItMatters:
              "This is a core skill for a Stock Market Analyst, directly related to the primary responsibilities of tracking and identifying investment opportunities.",
          },
          {
            skill: "Financial modeling valuation",
            priority: "High",
            whyItMatters:
              "Essential for analyzing company performance, forecasting future financial outcomes, and determining the intrinsic value of stocks.",
          },
          {
            skill: "Business Analytics",
            priority: "Medium",
            whyItMatters:
              "Helps in interpreting economic data, market trends, and company performance to make informed investment decisions.",
          },
          {
            skill: "Stocks and Trading",
            priority: "High",
            whyItMatters:
              "Fundamental knowledge required to understand the stock market, different types of stocks, and trading strategies.",
          },
          {
            skill: "Economic data analysis",
            priority: "High",
            whyItMatters:
              "Directly relates to the responsibility of studying economic data and global events to understand their impact on markets.",
          },
          {
            skill: "Market indices tracking",
            priority: "High",
            whyItMatters: "Crucial for understanding overall market performance and sector trends.",
          },
          {
            skill: "Company performance analysis",
            priority: "High",
            whyItMatters: "Necessary for evaluating individual stock potential.",
          },
        ],
      },
      learningPlan: {
        mustLearnFirst: [
          {
            skill: "Stocks and Trading",
            estimatedTime: "1-2 weeks",
            impact: "Fundamental knowledge for the role.",
          },
          {
            skill: "Stock Trading",
            estimatedTime: "2-3 weeks",
            impact: "Practical application of trading knowledge.",
          },
          {
            skill: "Economic data analysis",
            estimatedTime: "1-2 weeks",
            impact: "Understanding market drivers.",
          },
        ],
        goodToHave: [
          "Financial modeling valuation",
          "Business Analytics",
          "Learn Business Communication",
        ],
      },
      applicationDecision: {
        shouldApply: false,
        recommendation: "Apply After Preparation",
        reasoning: [
          "The internship is heavily focused on stock market analysis, which is not your primary area of expertise.",
          "There is a significant skill gap in core financial and trading knowledge.",
          "While your analytical and critical thinking skills are transferable, you lack the specific domain knowledge required for this role.",
          "The internship duration is short (1 month), making it difficult to acquire the necessary skills and contribute effectively within that timeframe.",
        ],
      },
      precautions: {
        riskLevel: "Medium",
        notes: [
          "The company is a startup, which can offer great learning but also comes with inherent risks.",
          "The internship is very short (1 month), so ensure clear expectations are set regarding deliverables and learning outcomes.",
          "Verify the legitimacy of the 'Stock Trading' and 'Financial modeling valuation' certifications offered, as their value can vary.",
        ],
      },
      resumeActions: {
        add: [
          "Quantify any experience related to market research, data analysis, or investment in personal projects or academic work.",
          "Add a section for 'Financial Skills' or 'Market Analysis' if you acquire any relevant knowledge or certifications.",
          "Tailor the summary to highlight transferable skills like analytical thinking, data interpretation, and problem-solving, even if not directly in finance.",
        ],
        improve: [
          "Reframe project descriptions to emphasize any analytical or data-driven aspects, even if the core technology is software development.",
          "Highlight any experience with data analysis tools or techniques, even if applied in a different domain.",
        ],
        remove: [],
      },
    },
  },
};

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
  const jobs = await getAnalysedJobs(10);
  if (jobs.data.suggestions.suggestions.length === 0) {
    showNoOpportunitiesMessage();
  } else {
    loadAnalysedJobs(jobs.data);
  }
  // Load skill gaps list
  loadSkillGapsList(stats.data.career.skillGaps);
  // simulating delay of 1sec for testing loader
  await new Promise((resolve) => setTimeout(resolve, 1000));
  removeLoader(dashboard.parentElement);
  showElement(dashboard);
  const contentWrapper = document.querySelector("#analyzeModal  #contentWrapper");
  insertOpportunityAnalysisForm(contentWrapper);
  const form = contentWrapper.querySelector("#jobForm");
  await initOpportunityFormLogic(form);
}

window.addEventListener("DOMContentLoaded", async () => {
  await initializeDashboard();
});
