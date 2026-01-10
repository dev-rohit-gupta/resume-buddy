function createList(items = []) {
  const html = `
    <ul class="skill-list">
        ${items.map((item) => `<li>${item}</li>`).join("")}
    </ul>
    `;
  return htmlToElements(html)[0];
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
  return htmlToElements(html)[0];
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
                <span class="badge" style="background-color: ${getMatchColor(match)};">${match} match &gt;</span>
            </div>
            <span class="time">${getPassedTime(createdAt)}</span>
          </div>
        </div>`;
  return htmlToElements(html)[0];
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
  return htmlToElements(html)[0];
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
  return htmlToElements(html)[0];
}

function showLoader(message = "Loading...", parent = document.body) {
  const parentNode = typeof parent === "string" ? document.querySelector(parent) : parent;

  if (!parentNode) return;

  let loader = parentNode.querySelector(".rb-loader");

  if (!loader) {
    loader = createLoaderElement(message);
    loadComponents(loader, parentNode);
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

function createOpportunityAnalysisForm() {
  const html = `
  <form
      id="jobForm"
      class="p-8 bg-[var(--bg-light)] rounded-[var(--border-radius-2xl)] space-y-10 max-w-5xl mx-auto"
    >
      <div class="flex justify-between items-start border-b border-[var(--border-light)] pb-6">
        <div>
          <h1 class="text-[var(--font-size-6xl)] font-bold text-[var(--text-card-title)]">
            Opportunity Analysis
          </h1>
          <p class="text-[var(--text-secondary)]">
            Fill in the structured data as per the AI Input Schema.
          </p>
        </div>
        <div class="text-right">
          <span class="text-[var(--text-muted)] text-xs uppercase font-bold tracking-widest"
            >Trust Score</span
          >
          <input
            type="number"
            id="trustScore"
            class="block w-20 text-center font-bold text-[var(--primary-blue)] bg-white border rounded-lg p-1"
            min="0"
            max="100"
            value="85"
            placeholder="0-100"
          />
        </div>
      </div>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-3 flex items-center gap-2">
          <div class="w-1 h-5 bg-[var(--primary-blue)] rounded-full"></div>
          <h6 class="font-bold text-[var(--text-gray)] uppercase text-sm">Basic Meta</h6>
        </div>

        <div class="md:col-span-2">
          <label class="label">Job Title</label
          ><input
            class="custom-input"
            id="title"
            placeholder="e.g. Full Stack Developer Intern"
            required
          />
        </div>
        <div>
          <label class="label">Source</label
          ><input
            class="custom-input"
            id="source"
            placeholder="e.g. LinkedIn / Internshala"
            required
          />
        </div>

        <div>
          <label class="label">Job Type</label
          ><select class="custom-select" id="type">
            <option>Internship</option>
            <option>Job</option>
            <option>Freelance</option>
          </select>
        </div>
        <div>
          <label class="label">Company Name</label
          ><input class="custom-input" id="companyName" placeholder="e.g. Google / Rocket.Chat" required />
        </div>
        <div>
          <label class="label">Company Type</label
          ><select class="custom-select" id="companyType">
            <option>Startup</option>
            <option>MNC</option>
            <option>NGO</option>
            <option>Unknown</option>
          </select>
        </div>

        <div>
          <label class="label">Industry</label>
          <input class="custom-input" id="industry" placeholder="e.g. FinTech / SaaS / EdTech" required />
        </div>

        <div>
          <label class="label">Location Type</label
          ><select class="custom-select" id="locationType">
            <option>Remote</option>
            <option>Onsite</option>
            <option>Hybrid</option>
          </select>
        </div>
        <div>
          <label class="label">City (nullable)</label
          ><input class="custom-input" id="city" placeholder="e.g. Nagpur / Bangalore" />
        </div>
        <div>
          <label class="label">Country</label
          ><input class="custom-input" id="country" value="India" placeholder="e.g. India" required />
        </div>

        <div>
          <label class="label">Posted Date</label
          ><input type="date" class="custom-input" id="postedDate" required />
        </div>
        <div>
          <label class="label">Apply By</label
          ><input type="date" class="custom-input" id="applyBy" required />
        </div>
        <div>
          <label class="label">Openings</label
          ><input
            type="number"
            class="custom-input"
            id="openings"
            min="1"
            value="1"
            placeholder="Number of vacancies"
            required
          />
        </div>
      </section>

      <div class="space-y-6">
        <div class="flex items-center gap-2">
          <div class="w-1 h-5 bg-[var(--primary-teal)] rounded-full"></div>
          <h6 class="font-bold text-[var(--text-gray)] uppercase text-sm">Work Details</h6>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="label">Duration</label
            ><input class="custom-input" id="duration" placeholder="e.g. 6 Months" required />
          </div>
          <div>
            <label class="label">Start Date</label
            ><input class="custom-input" id="startDate" placeholder="e.g. Immediate / 1st July" required />
          </div>
          <div>
            <label class="label">Stipend Type</label
            ><select class="custom-select" id="stipendType">
              <option>Paid</option>
              <option>Unpaid</option>
            </select>
          </div>
          <div>
            <label class="label">Amount</label
            ><input
              type="number"
              class="custom-input"
              id="stipendAmount"
              placeholder="e.g. 15000"
            />
          </div>
          <div>
            <label class="label">Currency</label
            ><input class="custom-input" id="currency" value="INR" placeholder="e.g. INR / USD" />
          </div>
          <div>
            <label class="label">Frequency</label>
            <select class="custom-select" id="frequency">
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="label">Responsibilities</label>
            <div class="flex gap-2">
              <input
                id="respInput"
                class="custom-input"
                placeholder="e.g. Develop RESTful APIs using Node.js"
              /><button type="button" id="addResp" class="btn-add">+</button>
            </div>
            <ul id="respList" class="chip-container"></ul>
          </div>
          <div class="space-y-2">
            <label class="label">Learning Outcomes</label>
            <div class="flex gap-2">
              <input
                id="learnInput"
                class="custom-input"
                placeholder="e.g. Scalable System Architecture"
              /><button type="button" id="addLearn" class="btn-add">+</button>
            </div>
            <ul id="learnList" class="chip-container"></ul>
          </div>
        </div>
      </div>

      <section class="space-y-6">
        <div class="flex items-center gap-2">
          <div class="w-1 h-5 bg-[var(--primary-blue)] rounded-full"></div>
          <h6 class="font-bold text-[var(--text-gray)] uppercase text-sm">Skills & Stack</h6>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <label class="label">Required Skills (Name & Level)</label>
            <div class="grid grid-cols-6 gap-2">
              <input
                id="skillName"
                class="custom-input col-span-3"
                placeholder="Skill e.g. React"
              />
              <select id="skillLevel" class="custom-select col-span-2">
                <option>Basic</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <button type="button" id="addSkill" class="btn-add col-span-1">+</button>
            </div>
            <ul id="skillList" class="chip-container"></ul>
          </div>

          <div class="space-y-4">
            <div>
              <label class="label">Frameworks</label>
              <div class="flex gap-2">
                <input
                  id="frameInput"
                  class="custom-input"
                  placeholder="e.g. Next.js, Django"
                /><button type="button" id="addFrame" class="btn-add">+</button>
              </div>
              <ul id="frameList" class="chip-container"></ul>
            </div>
            <div>
              <label class="label">Databases</label>
              <div class="flex gap-2">
                <input id="dbInput" class="custom-input" placeholder="e.g. MongoDB, Redis" /><button
                  type="button"
                  id="addDb"
                  class="btn-add"
                >
                  +
                </button>
              </div>
              <ul id="dbList" class="chip-container"></ul>
            </div>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section class="space-y-4">
          <div class="flex items-center gap-2">
            <h6 class="font-bold text-[var(--text-gray)] uppercase text-sm">Eligibility</h6>
          </div>
          <div class="space-y-2">
            <label class="label">Education</label>
            <div class="flex gap-2">
              <input id="eduInput" class="custom-input" placeholder="e.g. B.Tech IT / BCA" /><button
                type="button"
                id="addEdu"
                class="btn-add"
              >
                +
              </button>
            </div>
            <ul id="eduList" class="chip-container"></ul>
          </div>
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="label">Min Age</label
              ><input type="number" id="minAge" class="custom-input" placeholder="e.g. 18" />
            </div>
            <div class="flex-1 flex items-end pb-2 gap-2">
              <input type="checkbox" id="expReq" class="w-5 h-5" />
              <label class="label mb-0 cursor-pointer">Experience Required?</label>
            </div>
          </div>
        </section>

        <section class="space-y-4 pt-6 border-t">
          <div class="flex items-center gap-2">
            <div class="w-1 h-5 bg-[var(--primary-teal)] rounded-full"></div>
            <h6 class="font-bold text-[var(--text-gray)] uppercase text-sm">Company Profile</h6>
          </div>
          <div>
            <label class="label">Company Description</label>
            <textarea
              id="companyDesc"
              class="custom-textarea h-24"
              placeholder="Briefly describe the company's mission, size, or culture..."
              required
            ></textarea>
          </div>
          <div>
            <label class="label">Company Website</label>
            <input id="website" class="custom-input" placeholder="https://www.company.com" />
          </div>
        </section>

        <section class="space-y-4">
          <div class="flex items-center gap-2">
            <h6 class="font-bold text-[var(--text-gray)] uppercase text-sm">Perks</h6>
          </div>
          <div
            class="grid grid-cols-2 gap-4 bg-[var(--gray-50)] p-4 rounded-lg border border-dashed border-[var(--border-blue)]"
          >
            <label class="flex items-center gap-2 text-sm font-medium cursor-pointer"
              ><input type="checkbox" id="perkCert" /> Certificate</label
            >
            <label class="flex items-center gap-2 text-sm font-medium cursor-pointer"
              ><input type="checkbox" id="perkLor" /> LoR</label
            >
            <label class="flex items-center gap-2 text-sm font-medium cursor-pointer"
              ><input type="checkbox" id="perkPpo" /> Job Offer (PPO)</label
            >
            <label class="flex items-center gap-2 text-sm font-medium cursor-pointer"
              ><input type="checkbox" id="perkFlex" /> Flexible Hours</label
            >
          </div>
        </section>
      </div>

      <div>
        <label class="label">Full Description (Raw)</label
        ><textarea
          id="fullJD"
          class="custom-textarea h-32"
          placeholder="Paste the entire job description text here for AI analysis..."
          required
        ></textarea>
      </div>
      <div>
        <label class="label">Source URL</label
        ><input
          id="sourceURL"
          class="custom-input"
          placeholder="https://www.linkedin.com/jobs/view/..."
          required
        />
      </div>
    </form>
  `;
  return htmlToElements(html)[0];
}
async function initOpportunityFormLogic(form) {
  const lists = {
    responsibilities: [],
    learningOutcomes: [],
    requiredSkills: [],
    frameworks: [],
    databases: [],
    education: [],
  };

  // Helper to handle list UI
  const setupList = (inputId, btnId, listId, listKey, isSkill = false) => {
    const input = form.querySelector(`#${inputId}`);
    const btn = form.querySelector(`#${btnId}`);
    const listUI = form.querySelector(`#${listId}`);

    const updateUI = () => {
      listUI.innerHTML = "";
      lists[listKey].forEach((item, idx) => {
        const text = isSkill ? `${item.name} (${item.level})` : item;
        const chip = document.createElement("div");
        chip.className = "chip";
        chip.innerHTML = `${text} <span class="cursor-pointer font-bold ml-1">×</span>`;
        chip.onclick = () => {
          lists[listKey].splice(idx, 1);
          updateUI();
        };
        listUI.appendChild(chip);
      });
    };

    btn.onclick = () => {
      if (isSkill) {
        const name = form.querySelector("#skillName").value;
        const level = form.querySelector("#skillLevel").value;
        if (name) {
          lists[listKey].push({ name, level });
          updateUI();
        }
      } else {
        if (input.value) {
          lists[listKey].push(input.value);
          input.value = "";
          updateUI();
        }
      }
    };
  };

  // Setup all dynamic lists
  setupList("respInput", "addResp", "respList", "responsibilities");
  setupList("learnInput", "addLearn", "learnList", "learningOutcomes");
  setupList(null, "addSkill", "skillList", "requiredSkills", true);
  setupList("frameInput", "addFrame", "frameList", "frameworks");
  setupList("dbInput", "addDb", "dbList", "databases");
  setupList("eduInput", "addEdu", "eduList", "education");

  form.onsubmit = async (e) => {
    e.preventDefault();

    // Exact schema mapping
    const payload = {
      meta: {
        source: form.querySelector("#source").value,
        type: form.querySelector("#type").value, // Ensure these match JobTypeSchema exactly
        title: form.querySelector("#title").value,
        companyName: form.querySelector("#companyName").value,
        companyType: form.querySelector("#companyType").value,
        location: {
          type: form.querySelector("#locationType").value,
          city: form.querySelector("#city").value || null,
          country: form.querySelector("#country").value,
        },
        // Zod expects ISO strings
        postedDate: new Date(form.querySelector("#postedDate").value || Date.now()).toISOString(),
        applyBy: new Date(form.querySelector("#applyBy").value || Date.now()).toISOString(),
        openings: Number(form.querySelector("#openings").value) || 1,
      },

      workDetails: {
        duration: form.querySelector("#duration").value,
        startDate: form.querySelector("#startDate").value,
        stipend: {
          type: form.querySelector("#stipendType").value,
          // Number transformation is crucial
          amount: form.querySelector("#stipendAmount").value
            ? Number(form.querySelector("#stipendAmount").value)
            : null,
          currency: form.querySelector("#currency").value || "INR",
          frequency: form.querySelector("#frequency").value, // Now sends "Monthly" or "Weekly"
        },
        responsibilities: lists.responsibilities,
        learningOutcomes: lists.learningOutcomes,
      },

      skills: {
        required: lists.requiredSkills,
        frameworks: lists.frameworks,
        databases: lists.databases,
        tools: [],
        optional: [],
      },

      eligibility: {
        education: lists.education,
        year: [],
        experienceRequired: form.querySelector("#expReq").checked, // Returns true/false
        minAge: form.querySelector("#minAge").value
          ? Number(form.querySelector("#minAge").value)
          : null,
        otherCriteria: [],
      },

      perks: {
        certificate: form.querySelector("#perkCert").checked,
        letterOfRecommendation: form.querySelector("#perkLor").checked,
        jobOffer: form.querySelector("#perkPpo").checked,
        flexibleHours: form.querySelector("#perkFlex").checked,
      },

      companyInfo: {
        description: form.querySelector("#companyDesc").value,
        industry: form.querySelector("#industry").value,
        website: form.querySelector("#website").value || null,
        trustScore: Number(form.querySelector("#trustScore").value) || null,
      },

      rawData: {
        fullDescriptionText: form.querySelector("#fullJD").value,
        sourceURL: form.querySelector("#sourceURL").value,
      },
    };
    if (isUrlValid(payload.companyInfo.website) === false) {
      alert("Please enter a valid Company Website URL or leave it blank.");
      return;
    }
    if (isUrlValid(payload.rawData.sourceURL) === false) {
      alert("Please enter a valid Source URL.");
      return;
    }

    removeOpportunityAnalysisForm(form);
    showLoader("Analyzing opportunity...", form);
    const submitButton = document.querySelector('button[type="submit"][form="jobForm"]');
    submitButton.disabled = true;
    const jsonString = JSON.stringify(payload);
    const response = await analyzeOpportunity(jsonString);
    // Handle response

    if (!response.success) {
      submitButton.disabled = false;
      removeLoader(form);
      insertOpportunityAnalysisForm(form);
      alert(response.message || "Failed to analyze opportunity. Please try again.");
      return;
    }
    const suggestion = response.data.analysisResult;
    alert("Opportunity analyzed successfully!");
    removeLoader(form);
    insertOpportunityAnalysisResults(suggestion, form.parentElement);
    submitButton.disabled = false;
  };
}

function insertOpportunityAnalysisForm(container) {
  const containerNode =
    typeof container === "string" ? document.querySelector(container) : container;

  if (!containerNode) return;

  const formElement = createOpportunityAnalysisForm();
  containerNode.innerHTML = ""; // clear previous content
  containerNode.appendChild(formElement);
}

function removeOpportunityAnalysisForm(container) {
  const containerNode =
    typeof container === "string" ? document.querySelector(container) : container;

  if (!containerNode) return;

  const formElement = containerNode.querySelector(".job-form");
  if (formElement) formElement.remove();
}

// show ai results on popup
function createOpportunityAnalysisResults(response) {
  const html = `
<div class="bg-white p-6 border-b border-slate-200 flex justify-between items-center">
  <div>
    <h2 class="text-2xl font-extrabold text-slate-800 tracking-tight">
      AI Report Analysis
    </h2>
    <p class="text-slate-500 text-sm">Resume vs Job Description Insights</p>
  </div>
  <div class="text-right">
    <div class="text-4xl font-black"
      style="color:${getWarningColor(response.atsAnalysis.atsScore)}">
      ${response.atsAnalysis.atsScore}%
    </div>
    <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
      ATS Score
    </div>
  </div>
</div>

<div class="p-6 max-h-[75vh] space-y-8">

  <!-- STATS -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    ${[
      ["Difficulty", response.stats.difficulty],
      ["Competition", response.stats.competitionLevel],
      ["Match", response.stats.match],
    ]
      .map(
        ([label, value]) => `
      <div class="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center">
        <p class="text-[10px] uppercase font-bold text-slate-400 mb-1">${label}</p>
        <p class="text-sm font-bold text-slate-700">${value}</p>
      </div>`
      )
      .join("")}

    <div class="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center">
      <p class="text-[10px] uppercase font-bold text-slate-400 mb-1">Apply Now?</p>
      <p class="text-sm font-bold ${
        response.applicationDecision.shouldApply ? "text-blue-600" : "text-red-600"
      }">
        ${response.applicationDecision.shouldApply ? "Yes" : "No"}
      </p>
    </div>
  </div>

  <!-- RECOMMENDATION -->
  <div class="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-4">
    <i data-lucide="sparkles" class="text-green-600"></i>
    <div>
      <h4 class="text-sm font-bold text-green-900">
        Recommendation: ${response.applicationDecision.recommendation}
      </h4>
      <p class="text-xs text-green-700">
        ${response.applicationDecision.reasoning?.[0] || ""}
      </p>
    </div>
  </div>

  <!-- SKILL GAP -->
  <section>
    <h3 class="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">
      <i data-lucide="check-circle-2" class="text-green-500 w-5 h-5"></i>
      Skill Gap Analysis
    </h3>

    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">

      <div class="flex flex-wrap gap-2 mb-4">
        ${response.skillGapAnalysis.matchedSkills
          .map(
            (s) =>
              `<span class="px-3 py-1 bg-green-100 text-green-700 text-[11px] font-bold rounded-full">${s}</span>`
          )
          .join("")}
      </div>

      <div class="space-y-3">
        ${response.skillGapAnalysis.missingSkills
          .map(
            (m) => `
          <div class="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
            <span class="px-2 py-0.5 bg-red-200 text-red-700 text-[9px] font-black uppercase mt-1">
              ${m.priority}
            </span>
            <div>
              <p class="text-xs font-bold text-slate-800">${m.skill}</p>
              <p class="text-[11px] text-slate-600 italic">${m.whyItMatters}</p>
            </div>
          </div>`
          )
          .join("")}
      </div>

    </div>
  </section>

  <!-- LEARNING PLAN -->
  <section>
    <h3 class="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">
      <i data-lucide="book-open" class="text-blue-500 w-5 h-5"></i>
      Must Learn First
    </h3>

    ${response.learningPlan.mustLearnFirst
      .map(
        (l) => `
      <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg flex justify-between items-center mb-3">
        <div>
          <p class="text-sm font-bold text-blue-900">${l.skill}</p>
          <p class="text-xs text-blue-700">${l.impact}</p>
        </div>
        <span class="text-[10px] font-bold bg-blue-200 text-blue-700 px-2 py-1 rounded">
          ${l.estimatedTime}
        </span>
      </div>`
      )
      .join("")}
  </section>

  <!-- RESUME ACTIONS -->
  <section class="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
    <h3 class="flex items-center gap-2 text-sm font-bold mb-5 uppercase tracking-widest text-blue-400">
      <i data-lucide="file-edit" class="w-5 h-5"></i>
      Resume Updates
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      ${["add", "improve", "remove"]
        .map((type) => {
          const list = response.resumeActions[type] || [];
          return `
        <div class="space-y-3">
          <p class="text-[10px] font-black uppercase tracking-widest
            ${type === "add" ? "text-green-400" : type === "improve" ? "text-yellow-400" : "text-red-400"}">
            ${type}
          </p>
          <ul class="text-[11px] space-y-2 text-slate-300">
            ${list.length ? list.map((i) => `<li>• ${i}</li>`).join("") : `<li class="opacity-50">Nothing</li>`}
          </ul>
        </div>`;
        })
        .join("")}
    </div>
  </section>

</div>
`;

  return htmlToElements(html);
}

function insertOpportunityAnalysisResults(response, container) {
  const containerNode =
    typeof container === "string" ? document.querySelector(container) : container;

  if (!containerNode) return;

  const resultsElements = createOpportunityAnalysisResults(response);
  containerNode.innerHTML = ""; // clear previous content
  loadComponents(resultsElements, containerNode);
  hideFooter();
}

// model footer options
function showFooter(display) {
  if (!display) display = "flex";

  const footer = document.querySelector("#analyzeModal .modal-footer");
  if (footer) {
    footer.style.display = display;
  }
}
function hideFooter() {
  showFooter("none");
}
