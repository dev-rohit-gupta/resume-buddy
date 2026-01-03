function htmlToElement(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
}
function getWarningColor(score) {
  if (score >= 80) return "#2563eb"; // Blue
  if (score >= 50) return "#16a34a"; // Green
  return "#dc2626"; // Red
}

function createStatCard({ title, subtitle, content }) {
  const html = `
    <div class="stat-card">
        <div class="stat-header">
            ${title ? `<span class="stat-title"><h4>${title}</h4></span>` : ""}
            ${subtitle ? `<span class="stat-sub">${subtitle}</span>` : ""}
        </div>
        <div class="stat-content">
            ${content}
        </div>
    </div>
    `;
  return htmlToElement(html);
}

function createScoreCircle({ score, color }) {
  const html = `
    <div class="score-circle" style="--color:${color}; --score-percentage: ${score}%;">
        <span>${score}</span>
        <small>/100</small>
    </div>
    `;
  return createStatCard({
    title: "Resume Score",
    subtitle: "7 days",
    content: html,
  });
}
function createJobMatchCard(count,trend) {
  const html = `<h2 class="stat-main">${count}</h2>
        ${trend ? `<p class="stat-footer">Trending ${trend}</p>` : `<p class="stat-footer">in the last 7 days</p>`}`;
  return createStatCard({
    title: "Job Matches",
    subtitle: "7 days",
    content: html,
  });
}
function createSkillsGapCard(skillsGap) {
    const html = `<h2 class="stat-main red">${skillsGap.length} Missing Skills</h2>
        <p class="stat-footer">${skillsGap.join(", ")}</p>`;
    return createStatCard({
        title: "Skills Gap",
        subtitle: "<span class=\"stat-icon alert\">!</span>",
        content: html,
    });
}
function createBestRoleCard(role) {
    const html = `<h2 class="stat-main">${role}</h2>
        <p class="stat-footer">Based on skills & experience</p>`;
    return createStatCard({
        title: "Best Fit Role",
        content: html,
    });
}
