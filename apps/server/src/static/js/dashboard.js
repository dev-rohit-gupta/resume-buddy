async function fetchData(url,{ method = 'GET', headers = {}, body = null } = {}) {
  try {
    const response = await fetch(url, { method, headers, body });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

async function getStats() {
  const data = await fetchData('/api/users/me/dashboard'); 
  return data; 
}
/*
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "resume": {
      "url": "https://res.cloudinary.com/ddfunyfyx/raw/upload/s--VUrCqb1m--/fl_attachment/v1/resumes/j6qpbw5gswqehvrhtml9.docx?_a=BAMAMice0",
      "version": 1
    },
    "career": {
      "atsScore": 95,
      "bestRole": "Full Stack Developer",
      "nearestNextRole": "Senior Full Stack Developer",
      "skillGaps": [
        "GraphQL",
        "Kubernetes",
        "CI/CD",
        "Cloud Platforms (AWS/Azure/GCP)"
      ]
    },
    "jobStats": {
      "total": 0,
      "thisWeek": 0,
      "previousWeek": 0
    }
  }
}
*/
function loadStats(stats,containerSelector='#stats-container') {
  // Function to load and display stats on the dashboard
  const atsScore = stats.career.atsScore;
  const atsCard = createScoreCircle({ score: atsScore, color: getWarningColor(atsScore) });
  const jobMatchCard = createJobMatchCard(stats.jobStats.thisWeek);
  const skillsGapCard = createSkillsGapCard(stats.career.skillGaps);
  const bestRoleCard = createBestRoleCard(stats.career.bestRole);

  const statsContainer = document.querySelector(containerSelector);
  statsContainer.appendChild(atsCard);
  statsContainer.appendChild(jobMatchCard);
  statsContainer.appendChild(skillsGapCard);
  statsContainer.appendChild(bestRoleCard);
console.log('Stats loaded into dashboard.');
}

async function initializeDashboard() {
  // Initialization code for the dashboard can go here
  const stats = await getStats();
  console.log(stats);
  loadStats(stats.data, "#stats-container");
}


window.addEventListener('DOMContentLoaded', async () => {
  await initializeDashboard();
});