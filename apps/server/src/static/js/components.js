function loadComponents(components, containerNode) {
  if (!containerNode) return;
  if (!Array.isArray(components)) {
    components = [components];
  }
  if (typeof containerNode === "string") {
    containerNode = document.querySelector(containerNode);
  }
  components.forEach((component) => {
    containerNode.appendChild(component);
  });
}
function createList(items = []) {
  const html = `
    <ul class="skill-list">
        ${items.map((item) => `<li>${item}</li>`).join("")}
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
function createJobMatchCard(count, trend) {
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
    subtitle: '<span class="stat-icon alert">!</span>',
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
function createAnalysedJobCard({ title, company, skills, match, createdAt }) {
  const html = `
    <div class="job-card">
          <div class="job-main">
            <div class="job-icon">${title.charAt(0)}</div>
            <div>
              <h3>${title}</h3>
              <p class="company">${company}</p>
              <div class="tags">
                ${skills.map((skill) => `<span class="tag">${skill}</span>`).join("")}
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
function createNoResultsMessageElement({
  illustration,
  title = "Demo title",
  message = "Demo message",
}) {
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

// Loader components with its functions
function createLoaderElement(message = "Loading...") {
  const html = `
    <div class="rb-loader position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75"
         style="z-index:1055;">
      <div class="text-center">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <p class="loader-text text-muted small mb-0">${message}</p>
      </div>
    </div>
  `;
  return htmlToElement(html);
}

function showLoader(message = "Loading...", parent = document.body) {
  const parentNode = typeof parent === "string" ? document.querySelector(parent) : parent;

  if (!parentNode) return;

  let loader = parentNode.querySelector(".rb-loader");

  if (!loader) {
    loader = createLoaderElement(message);
    parentNode.appendChild(loader);
  } else {
    // update message if loader already exists
    const textEl = loader.querySelector(".loader-text");
    if (textEl) textEl.textContent = message;
  }
}

function removeLoader(parent = document.body) {
  const parentNode = typeof parent === "string" ? document.querySelector(parent) : parent;

  if (!parentNode) return;

  const loader = parentNode.querySelector(".rb-loader");
  if (loader) loader.remove();
}

// opportunity analysis form
function createOpportunityAnalysisForm() {
  const html = `
    <form id="jobForm" class="modal-body job-form">

        <!-- META -->
        <h6 class="section-title">Job Meta</h6>
        <input class="form-control" id="source" placeholder="Source" required />
        <select class="form-select" id="type">
          <option>Internship</option>
          <option>Job</option>
          <option>Freelance</option>
        </select>
        <input class="form-control" id="title" placeholder="Job Title" required />
        <input class="form-control" id="companyName" placeholder="Company Name" />
        <select class="form-select" id="companyType">
          <option>Startup</option><option>NGO</option><option>MNC</option><option>Unknown</option>
        </select>
        <select class="form-select" id="locationType">
          <option>Remote</option><option>Onsite</option><option>Hybrid</option>
        </select>
        <input class="form-control" id="city" placeholder="City (optional)" />
        <input class="form-control" id="country" value="India" />
        <input type="date" class="form-control" id="postedDate" />
        <input type="date" class="form-control" id="applyBy" />
        <input type="number" class="form-control" id="openings" min="1" />

        <!-- WORK -->
        <h6 class="section-title">Work Details</h6>
        <input class="form-control" id="duration" placeholder="Duration" />
        <input class="form-control" id="startDate" placeholder="Start Date" />
        <select class="form-select" id="stipendType">
          <option>Paid</option><option>Unpaid</option>
        </select>
        <input type="number" class="form-control" id="stipendAmount" placeholder="Amount" />
        <input class="form-control" id="currency" placeholder="Currency" />

        <!-- RESPONSIBILITIES -->
        <h6 class="section-title">Responsibilities</h6>
        <div class="add-row">
          <input id="respInput" class="form-control" placeholder="Responsibility" />
          <button type="button" id="addResp" class="btn btn-outline-primary">Add</button>
        </div>
        <ul id="respList" class="chip-list"></ul>

        <!-- REQUIRED SKILLS -->
        <h6 class="section-title">Required Skills</h6>
        <div class="row g-2 mb-2">
          <div class="col-6"><input id="reqSkillName" class="form-control" placeholder="Skill name" /></div>
          <div class="col-4">
            <select id="reqSkillLevel" class="form-select">
              <option>Basic</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
          <div class="col-2">
            <button type="button" id="addReqSkill" class="btn btn-primary w-100">Add</button>
          </div>
        </div>
        <ul id="reqSkillList" class="chip-list"></ul>

        <!-- FRAMEWORKS -->
        <h6 class="section-title">Frameworks</h6>
        <div class="add-row">
          <input id="frameworkInput" class="form-control" placeholder="Framework" />
          <button type="button" id="addFramework" class="btn btn-outline-primary">Add</button>
        </div>
        <ul id="frameworkList" class="chip-list"></ul>

        <!-- COMPANY -->
        <h6 class="section-title">Company Info</h6>
        <textarea class="form-control" id="companyDesc" placeholder="Company description"></textarea>
        <input class="form-control" id="industry" placeholder="Industry" />
        <input class="form-control" id="website" placeholder="Website URL" />

        <!-- RAW -->
        <h6 class="section-title">Raw Data</h6>
        <textarea class="form-control" id="fullDesc" placeholder="Full JD text"></textarea>
        <input class="form-control" id="sourceURL" placeholder="Source URL" />

      </form>
  `;
  return htmlToElement(html);
}

function insertOpportunityAnalysisForm(container) {
  const containerNode =
    typeof container === "string" ? document.querySelector(container) : container;
console.log(containerNode);
  if (!containerNode) return;

  const formElement = createOpportunityAnalysisForm();
  containerNode.appendChild(formElement);
}

function removeOpportunityAnalysisForm(container) {
  const containerNode =
    typeof container === "string" ? document.querySelector(container) : container;

  if (!containerNode) return;

  const formElement = containerNode.querySelector(".job-form");
  if (formElement) formElement.remove();
}
