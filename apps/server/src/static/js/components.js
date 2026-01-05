function loadComponents(components,containerNode) {
  if (!containerNode) return;
  if (!Array.isArray(components)) {
    components = [components];
  }
  if (typeof containerNode === 'string') {
    containerNode = document.querySelector(containerNode);
  }
  components.forEach(component => {
    containerNode.appendChild(component);
  });
}
function createList(items=[]) {
  const html = `
    <ul class="skill-list">
        ${items.map(item => `<li>${item}</li>`).join('')}
    </ul>
    `;
  return htmlToElement(html);
}
function createStatCard({ title, subtitle, content }) {
  const html = `
    <div class="stat-card">
        <div class="stat-header">
            ${title ? `<span class="stat-title">${title}</span>` : ""}
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
  const skillsString = skillsGap.join(", ");
    const html = `<h2 class="stat-main red">${skillsGap.length} Missing Skills</h2>
        <p class="stat-footer" title="${skillsString}">${skillsString.slice(0, 50)}${skillsString.length > 50 ? "..." : ""}</p>`;
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
function createAnalysedJobCard({title , company , skills , match ,createdAt}) {
  const html = `
    <div class="job-card">
          <div class="job-main">
            <div class="job-icon">${title.charAt(0)}</div>
            <div>
              <h3>${title}</h3>
              <p class="company">${company}</p>
              <div class="tags">
                ${skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
              </div>
            </div>
          </div>
          <div class="job-meta">
            <div class="align">
                <span class="badge ${match}">${match} match</span>
            </div>
            <span class="time">${getPassedTime(createdAt)}</span>
          </div>
        </div>`;
  return htmlToElement(html);
}
function createNoResultsMessageElement({illustration , title="Demo title" , message="Demo message" }) {

  const html = `<div class="text-center py-5">
              <img
                src="../assets/${illustration}"
                class="img-fluid mb-4"
                style="max-width: 280px"
              />

              <h5>${title}</h5>
              <p class="text-muted small">
                ${message}
              </p>
            </div>`;
    return htmlToElement(html);
}