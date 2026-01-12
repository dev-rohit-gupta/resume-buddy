// DOM Element References
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const locationInput = document.getElementById('location');
const linkedinInput = document.getElementById('linkedin');
const githubInput = document.getElementById('github');
const portfolioInput = document.getElementById('portfolio');
const summaryTextArea = document.getElementById('summaryText');
const avatarElement = document.getElementById('avatar');
const displayNameElement = document.getElementById('displayName');
const displayEmailElement = document.getElementById('displayEmail');
const completionScoreElement = document.getElementById('completionScore');
const educationListElement = document.getElementById('educationList');
const experienceListElement = document.getElementById('experienceList');
const projectListElement = document.getElementById('projectList');
const technicalSkillsListElement = document.getElementById('technicalSkillsList');
const softSkillsListElement = document.getElementById('softSkillsList');
const toolsListElement = document.getElementById('toolsList');
const certificationsListElement = document.getElementById('certificationsList');
const achievementsListElement = document.getElementById('achievementsList');
const languagesListElement = document.getElementById('languagesList');

/**
 * Set loading placeholders for all input fields
 */
function setLoadingPlaceholders() {
    if (nameInput) nameInput.placeholder = "Loading...";
    if (emailInput) emailInput.placeholder = "Loading...";
    if (phoneInput) phoneInput.placeholder = "Loading...";
    if (locationInput) locationInput.placeholder = "Loading...";
    if (linkedinInput) linkedinInput.placeholder = "Loading...";
    if (githubInput) githubInput.placeholder = "Loading...";
    if (portfolioInput) portfolioInput.placeholder = "Loading...";
    if (summaryTextArea) summaryTextArea.placeholder = "Loading...";
}

/**
 * Reset placeholders to default values
 */
function resetPlaceholders() {
    if (nameInput) nameInput.placeholder = "John Doe";
    if (emailInput) emailInput.placeholder = "john.doe@example.com";
    if (phoneInput) phoneInput.placeholder = "+1 234 567 8900";
    if (locationInput) locationInput.placeholder = "San Francisco, CA";
    if (linkedinInput) linkedinInput.placeholder = "https://linkedin.com/in/...";
    if (githubInput) githubInput.placeholder = "https://github.com/...";
    if (portfolioInput) portfolioInput.placeholder = "https://...";
    if (summaryTextArea) summaryTextArea.placeholder = "Write a brief professional summary...";
}

let data = {
    basics: {
        name: "",
        email: "",
        phone: "",
        location: "",
        links: {
            linkedin: "",
            github: "",
            portfolio: ""
        }
    },
    summary: "",
    education: [],
    experience: [],
    projects: [],
    skills: {
        technical: [],
        soft: [],
        tools: []
    },
    certifications: [],
    achievements: [],
    languages: [],
    metadata: {
        resumeVersion: 1,
        extractedAt: new Date().toISOString(),
        sourceFileType: "pdf"
    }
};
async function save() {
    // Save basics
    data.basics.name = nameInput?.value || "";
    data.basics.email = emailInput?.value || "";
    data.basics.phone = phoneInput?.value || "";
    data.basics.location = locationInput?.value || "";
    data.basics.links.linkedin = linkedinInput?.value || "";
    data.basics.links.github = githubInput?.value || "";
    data.basics.links.portfolio = portfolioInput?.value || "";
    
    // Save summary
    data.summary = summaryTextArea?.value || "";
    
    // strinify the data
    const stringifiedData = JSON.stringify({content : data});

    // Save to server
    await updateResume(stringifiedData);
    updateProfile();
}

function updateProfile() {
    const nameText = data.basics.name || "Your Name";
    const emailText = data.basics.email || "your.email@example.com";
    
    // avatar element update removed -- will update later for future
    // if (avatarElement) avatarElement.textContent = nameText ? nameText[0].toUpperCase() : "R";
    if (displayNameElement) displayNameElement.textContent = nameText;
    if (displayEmailElement) displayEmailElement.textContent = emailText;
    
    // Calculate completion score
    const score = calculateCompletionScore();
    if (completionScoreElement) completionScoreElement.textContent = score + "%";
}

/**
 * Load resume data into the editor
 * @param {Object} resumeData - Resume object matching ResumeSchema structure
 */
function loadResumeData(resumeData) {
    if (!resumeData || typeof resumeData !== 'object') {
        console.error("Invalid resume data provided");
        return;
    }
    
    try {
        // Load basics with safe access
        if (resumeData.basics && typeof resumeData.basics === 'object') {
            data.basics = data.basics || { links: {} };
            data.basics.name = resumeData.basics.name ?? "";
            data.basics.email = resumeData.basics.email ?? "";
            data.basics.phone = resumeData.basics.phone ?? "";
            data.basics.location = resumeData.basics.location ?? "";
            
            // Handle nested links object
            if (resumeData.basics.links && typeof resumeData.basics.links === 'object') {
                data.basics.links = data.basics.links || {};
                data.basics.links.linkedin = resumeData.basics.links.linkedin ?? "";
                data.basics.links.github = resumeData.basics.links.github ?? "";
                data.basics.links.portfolio = resumeData.basics.links.portfolio ?? "";
            } else {
                // Initialize empty links if not provided
                data.basics.links = { linkedin: "", github: "", portfolio: "" };
            }
            
            // Update form fields safely
            if (nameInput) nameInput.value = data.basics.name;
            if (emailInput) emailInput.value = data.basics.email;
            if (phoneInput) phoneInput.value = data.basics.phone;
            if (locationInput) locationInput.value = data.basics.location;
            if (linkedinInput) linkedinInput.value = data.basics.links.linkedin;
            if (githubInput) githubInput.value = data.basics.links.github;
            if (portfolioInput) portfolioInput.value = data.basics.links.portfolio;
        }
        
        // Load summary
        data.summary = resumeData.summary ?? "";
        if (summaryTextArea) summaryTextArea.value = data.summary;
        
        // Load education
        if (resumeData.education && Array.isArray(resumeData.education)) {
            data.education = resumeData.education.map(edu => {
                if (!edu || typeof edu !== 'object') return null;
                return {
                    degree: edu.degree ?? "",
                    field: edu.field ?? "",
                    institution: edu.institution ?? "",
                    startYear: edu.startYear ?? "",
                    endYear: edu.endYear ?? "",
                    grade: edu.grade ?? ""
                };
            }).filter(Boolean); // Remove null entries
            renderEducation();
        } else {
            data.education = [];
        }
        
        // Load experience
        if (resumeData.experience && Array.isArray(resumeData.experience)) {
            data.experience = resumeData.experience.map(exp => {
                if (!exp || typeof exp !== 'object') return null;
                return {
                    role: exp.role ?? "",
                    company: exp.company ?? "",
                    location: exp.location ?? "",
                    startDate: exp.startDate ?? "",
                    endDate: exp.endDate ?? "",
                    description: Array.isArray(exp.description) ? exp.description.filter(d => d) : [],
                    type: exp.type === "internship" ? "internship" : "job"
                };
            }).filter(Boolean);
            renderExperience();
        } else {
            data.experience = [];
        }
        
        // Load projects
        if (resumeData.projects && Array.isArray(resumeData.projects)) {
            data.projects = resumeData.projects.map(proj => {
                if (!proj || typeof proj !== 'object') return null;
                return {
                    title: proj.title ?? "",
                    description: proj.description ?? "",
                    techStack: Array.isArray(proj.techStack) ? proj.techStack.filter(t => t) : [],
                    link: proj.link ?? ""
                };
            }).filter(Boolean);
            renderProjects();
        } else {
            data.projects = [];
        }
        
        // Load skills with null/undefined handling
        if (resumeData.skills && typeof resumeData.skills === 'object') {
            data.skills = {
                technical: Array.isArray(resumeData.skills.technical) 
                    ? resumeData.skills.technical.filter(s => s) 
                    : [],
                soft: Array.isArray(resumeData.skills.soft) 
                    ? resumeData.skills.soft.filter(s => s) 
                    : [],
                tools: Array.isArray(resumeData.skills.tools) 
                    ? resumeData.skills.tools.filter(s => s) 
                    : []
            };
            renderSkills();
        } else {
            data.skills = { technical: [], soft: [], tools: [] };
        }
        
        // Load certifications
        if (resumeData.certifications && Array.isArray(resumeData.certifications)) {
            data.certifications = resumeData.certifications.map(cert => {
                if (!cert || typeof cert !== 'object') return null;
                return {
                    name: cert.name ?? "",
                    issuer: cert.issuer ?? "",
                    year: cert.year ?? "",
                    url: cert.url ?? ""
                };
            }).filter(Boolean);
            renderCertifications();
        } else {
            data.certifications = [];
        }
        
        // Load achievements
        if (resumeData.achievements && Array.isArray(resumeData.achievements)) {
            data.achievements = resumeData.achievements.map(ach => {
                if (!ach || typeof ach !== 'object') return null;
                return {
                    title: ach.title ?? "",
                    description: ach.description ?? "",
                    year: ach.year ?? ""
                };
            }).filter(Boolean);
            renderAchievements();
        } else {
            data.achievements = [];
        }
        
        // Load languages
        if (resumeData.languages && Array.isArray(resumeData.languages)) {
            data.languages = resumeData.languages.map(lang => {
                if (!lang || typeof lang !== 'object' || !lang.name) return null;
                const validProficiency = ["basic", "intermediate", "fluent", "native"];
                return {
                    name: lang.name,
                    proficiency: validProficiency.includes(lang.proficiency) 
                        ? lang.proficiency 
                        : "intermediate"
                };
            }).filter(Boolean);
            renderLanguages();
        } else {
            data.languages = [];
        }
        
        // Load metadata if provided
        if (resumeData.metadata && typeof resumeData.metadata === 'object') {
            data.metadata = {
                resumeVersion: resumeData.metadata.resumeVersion ?? 1,
                extractedAt: resumeData.metadata.extractedAt ?? new Date().toISOString(),
                sourceFileType: resumeData.metadata.sourceFileType ?? "pdf",
                confidenceScore: resumeData.metadata.confidenceScore
            };
        }
        
        // Save to localStorage and update UI
        updateProfile();
        
        console.log("Resume data loaded successfully");
    } catch (error) {
        console.error("Error loading resume data:", error);
        // Initialize with empty data on error
        data = {
            basics: { name: "", email: "", phone: "", location: "", links: { linkedin: "", github: "", portfolio: "" } },
            summary: "",
            education: [],
            experience: [],
            projects: [],
            skills: { technical: [], soft: [], tools: [] },
            certifications: [],
            achievements: [],
            languages: [],
            metadata: { resumeVersion: 1, extractedAt: new Date().toISOString(), sourceFileType: "pdf" }
        };
    }
}

function calculateCompletionScore() {
    let filled = 0;
    let total = 0;
    
    // Check basics (4 fields)
    total += 4;
    if (data.basics.name) filled++;
    if (data.basics.email) filled++;
    if (data.basics.phone) filled++;
    if (data.basics.location) filled++;
    
    // Check links (3 fields, optional)
    total += 3;
    if (data.basics.links?.linkedin) filled++;
    if (data.basics.links?.github) filled++;
    if (data.basics.links?.portfolio) filled++;
    
    // Check summary
    total += 1;
    if (data.summary) filled++;
    
    // Check arrays (each counts as 1 if not empty)
    total += 6;
    if (data.education?.length > 0) filled++;
    if (data.experience?.length > 0) filled++;
    if (data.projects?.length > 0) filled++;
    if (data.skills?.technical?.length > 0) filled++;
    if (data.certifications?.length > 0) filled++;
    if (data.achievements?.length > 0) filled++;
    
    return Math.round((filled / total) * 100);
}

function openTab(evt, id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    if (evt?.target) evt.target.classList.add('active');
    const section = document.getElementById(id);
    if (section) section.classList.add('active');
}

async function saveResume() {
    const isSave = confirm("Do you want to save the changes to your profile?");
    const editorCard = document.querySelector('.card.editor-card');    
    if (isSave) {
        if (editorCard) hideElement(editorCard, "none");
        showLoader("Saving profile...",document.body);
        await save();
        if (editorCard) showElement(editorCard, "block");
        removeLoader(document.body);
        alert("Profile saved successfully!");
    }
}

// EDUCATION FUNCTIONS
function renderEducation() {
    if (!educationListElement) return;
    educationListElement.innerHTML = "";
    if (!data.education) data.education = [];
    
    data.education.forEach((edu, i) => {
        educationListElement.innerHTML += `
        <div class="item">
            <div class="grid">
                <div><label>Degree</label><input value="${edu.degree || ""}" oninput="data.education[${i}].degree=this.value;"></div>
                <div><label>Field</label><input value="${edu.field || ""}" oninput="data.education[${i}].field=this.value;"></div>
                <div><label>Institution</label><input value="${edu.institution || ""}" oninput="data.education[${i}].institution=this.value;"></div>
                <div><label>Grade/CGPA</label><input value="${edu.grade || ""}" oninput="data.education[${i}].grade=this.value;"></div>
                <div><label>Start Year</label><input value="${edu.startYear || ""}" oninput="data.education[${i}].startYear=this.value;"></div>
                <div><label>End Year</label><input value="${edu.endYear || ""}" placeholder="Present" oninput="data.education[${i}].endYear=this.value;"></div>
            </div>
            <button class="btn sm delete-btn" onclick="data.education.splice(${i},1);renderEducation();">Delete</button>
        </div>`;
    });
}

function addEducation() {
    if (!data.education) data.education = [];
    data.education.push({
        degree: "",
        field: "",
        institution: "",
        startYear: "",
        endYear: "",
        grade: ""
    });
    renderEducation();
}

// EXPERIENCE FUNCTIONS
function renderExperience() {
    if (!experienceListElement) return;
    experienceListElement.innerHTML = "";
    if (!data.experience) data.experience = [];
    
    data.experience.forEach((exp, i) => {
        const descriptions = exp.description || [];
        const descHTML = descriptions.map((desc, idx) => 
            `<div class="description-item">
                <textarea rows="2" oninput="data.experience[${i}].description[${idx}]=this.value;">${desc}</textarea>
                <button class="btn-icon" onclick="data.experience[${i}].description.splice(${idx},1);renderExperience();">×</button>
            </div>`
        ).join("");
        
        experienceListElement.innerHTML += `
        <div class="item">
            <div class="grid">
                <div><label>Role</label><input value="${exp.role || ""}" oninput="data.experience[${i}].role=this.value;"></div>
                <div><label>Company</label><input value="${exp.company || ""}" oninput="data.experience[${i}].company=this.value;"></div>
                <div><label>Location</label><input value="${exp.location || ""}" oninput="data.experience[${i}].location=this.value;"></div>
                <div>
                    <label>Type</label>
                    <select onchange="data.experience[${i}].type=this.value;">
                        <option value="job" ${exp.type === "job" ? "selected" : ""}>Job</option>
                        <option value="internship" ${exp.type === "internship" ? "selected" : ""}>Internship</option>
                    </select>
                </div>
                <div><label>Start Date</label><input type="month" value="${exp.startDate || ""}" oninput="data.experience[${i}].startDate=this.value;"></div>
                <div><label>End Date</label><input type="month" value="${exp.endDate || ""}" placeholder="Present" oninput="data.experience[${i}].endDate=this.value;"></div>
            </div>
            <label>Job Descriptions</label>
            <div class="descriptions-list">${descHTML}</div>
            <button class="btn sm" onclick="addExpDescription(${i})">+ Add Description</button>
            <button class="btn sm delete-btn" onclick="data.experience.splice(${i},1);renderExperience();">Delete Experience</button>
        </div>`;
    });
}

function addExperience() {
    if (!data.experience) data.experience = [];
    data.experience.push({
        role: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: [],
        type: "job"
    });
    renderExperience();
}

function addExpDescription(expIndex) {
    if (!data.experience[expIndex].description) {
        data.experience[expIndex].description = [];
    }
    data.experience[expIndex].description.push("");
    renderExperience();
}

// PROJECTS FUNCTIONS
function renderProjects() {
    if (!projectListElement) return;
    projectListElement.innerHTML = "";
    if (!data.projects) data.projects = [];
    
    data.projects.forEach((proj, i) => {
        const techStack = proj.techStack || [];
        const techHTML = techStack.map((tech, idx) => 
            `<span class="skill">${tech}<span onclick="data.projects[${i}].techStack.splice(${idx},1);renderProjects();">×</span></span>`
        ).join("");
        
        projectListElement.innerHTML += `
        <div class="item">
            <div class="grid">
                <div><label>Title</label><input value="${proj.title || ""}" oninput="data.projects[${i}].title=this.value;"></div>
                <div><label>Project Link</label><input value="${proj.link || ""}" placeholder="https://..." oninput="data.projects[${i}].link=this.value;"></div>
            </div>
            <label>Description</label>
            <textarea rows="3" oninput="data.projects[${i}].description=this.value;">${proj.description || ""}</textarea>
            <label>Tech Stack</label>
            <div class="skill-input-group">
                <input id="techInput${i}" placeholder="Add technology">
                <button class="btn sm" onclick="addTechStack(${i})">Add</button>
            </div>
            <div class="skills">${techHTML}</div>
            <button class="btn sm delete-btn" onclick="data.projects.splice(${i},1);renderProjects();">Delete</button>
        </div>`;
    });
}

function addProject() {
    if (!data.projects) data.projects = [];
    data.projects.push({
        title: "",
        description: "",
        techStack: [],
        link: ""
    });
    renderProjects();
}

function addTechStack(projIndex) {
    const input = document.getElementById(`techInput${projIndex}`);
    if (input.value.trim()) {
        if (!data.projects[projIndex].techStack) {
            data.projects[projIndex].techStack = [];
        }
        data.projects[projIndex].techStack.push(input.value.trim());
        input.value = "";
        renderProjects();
    }
}

// SKILLS FUNCTIONS
function renderSkills() {
    if (!data.skills) {
        data.skills = { technical: [], soft: [], tools: [] };
    }
    
    // Technical skills
    if (!technicalSkillsListElement) return;
    technicalSkillsListElement.innerHTML = "";
    (data.skills.technical || []).forEach((skill, i) => {
        technicalSkillsListElement.innerHTML += `
            <div class="skill">${skill}<span onclick="data.skills.technical.splice(${i},1);renderSkills();">×</span></div>`;
    });
    
    // Soft skills
    if (!softSkillsListElement) return;
    softSkillsListElement.innerHTML = "";
    (data.skills.soft || []).forEach((skill, i) => {
        softSkillsListElement.innerHTML += `
            <div class="skill">${skill}<span onclick="data.skills.soft.splice(${i},1);renderSkills();">×</span></div>`;
    });
    
    // Tools
    if (!toolsListElement) return;
    toolsListElement.innerHTML = "";
    (data.skills.tools || []).forEach((tool, i) => {
        toolsListElement.innerHTML += `
            <div class="skill">${tool}<span onclick="data.skills.tools.splice(${i},1);renderSkills();">×</span></div>`;
    });
}

function addTechnicalSkill() {
    const input = document.getElementById("technicalSkillInput");
    if (input.value.trim()) {
        if (!data.skills.technical) data.skills.technical = [];
        data.skills.technical.push(input.value.trim());
        input.value = "";
        renderSkills();
    }
}

function addSoftSkill() {
    const input = document.getElementById("softSkillInput");
    if (input.value.trim()) {
        if (!data.skills.soft) data.skills.soft = [];
        data.skills.soft.push(input.value.trim());
        input.value = "";
        renderSkills();
    }
}

function addTool() {
    const input = document.getElementById("toolsInput");
    if (input.value.trim()) {
        if (!data.skills.tools) data.skills.tools = [];
        data.skills.tools.push(input.value.trim());
        input.value = "";
        renderSkills();
    }
}

// CERTIFICATIONS FUNCTIONS
function renderCertifications() {
    if (!certificationsListElement) return;
    certificationsListElement.innerHTML = "";
    if (!data.certifications) data.certifications = [];
    
    data.certifications.forEach((cert, i) => {
        certificationsListElement.innerHTML += `
        <div class="item">
            <div class="grid">
                <div><label>Name</label><input value="${cert.name || ""}" oninput="data.certifications[${i}].name=this.value;"></div>
                <div><label>Issuer</label><input value="${cert.issuer || ""}" oninput="data.certifications[${i}].issuer=this.value;"></div>
                <div><label>Year</label><input value="${cert.year || ""}" oninput="data.certifications[${i}].year=this.value;"></div>
                <div><label>URL</label><input value="${cert.url || ""}" placeholder="https://..." oninput="data.certifications[${i}].url=this.value;"></div>
            </div>
            <button class="btn sm delete-btn" onclick="data.certifications.splice(${i},1);renderCertifications();">Delete</button>
        </div>`;
    });
}

function addCertification() {
    if (!data.certifications) data.certifications = [];
    data.certifications.push({
        name: "",
        issuer: "",
        year: "",
        url: ""
    });
    renderCertifications();
}

// ACHIEVEMENTS FUNCTIONS
function renderAchievements() {
    if (!achievementsListElement) return;
    achievementsListElement.innerHTML = "";
    if (!data.achievements) data.achievements = [];
    
    data.achievements.forEach((ach, i) => {
        achievementsListElement.innerHTML += `
        <div class="item">
            <div class="grid">
                <div><label>Title</label><input value="${ach.title || ""}" oninput="data.achievements[${i}].title=this.value;"></div>
                <div><label>Year</label><input value="${ach.year || ""}" oninput="data.achievements[${i}].year=this.value;"></div>
            </div>
            <label>Description</label>
            <textarea rows="2" oninput="data.achievements[${i}].description=this.value;">${ach.description || ""}</textarea>
            <button class="btn sm delete-btn" onclick="data.achievements.splice(${i},1);renderAchievements();">Delete</button>
        </div>`;
    });
}

function addAchievement() {
    if (!data.achievements) data.achievements = [];
    data.achievements.push({
        title: "",
        description: "",
        year: ""
    });
    renderAchievements();
}

// LANGUAGES FUNCTIONS
function renderLanguages() {
    if (!languagesListElement) return;
    languagesListElement.innerHTML = "";
    if (!data.languages) data.languages = [];
    
    data.languages.forEach((lang, i) => {
        languagesListElement.innerHTML += `
        <div class="item">
            <div class="grid">
                <div><label>Language</label><input value="${lang.name || ""}" oninput="data.languages[${i}].name=this.value;"></div>
                <div>
                    <label>Proficiency</label>
                    <select onchange="data.languages[${i}].proficiency=this.value;">
                        <option value="basic" ${lang.proficiency === "basic" ? "selected" : ""}>Basic</option>
                        <option value="intermediate" ${lang.proficiency === "intermediate" ? "selected" : ""}>Intermediate</option>
                        <option value="fluent" ${lang.proficiency === "fluent" ? "selected" : ""}>Fluent</option>
                        <option value="native" ${lang.proficiency === "native" ? "selected" : ""}>Native</option>
                    </select>
                </div>
            </div>
            <button class="btn sm delete-btn" onclick="data.languages.splice(${i},1);renderLanguages();">Delete</button>
        </div>`;
    });
}

function addLanguage() {
    if (!data.languages) data.languages = [];
    data.languages.push({
        name: "",
        proficiency: "intermediate"
    });
    renderLanguages();
}

const serverResponse = {
  "basics": {
    "name": "MRUNALI BARDE",
    "email": "mrunali816@gmail.com",
    "phone": "+91 89564 86551",
    "location": "Amravati, Maharashtra"
  },
  "summary": "I am pursuing a degree in Computer Science and Engineering at Prof. Ram Meghe Institute of Technology and Research, Badnera. I have a strong interest in problem-solving, gaining real-time experience, and exploring new technologies. I am eager to work on projects that allow me to apply my knowledge, learn continuously, and build my technical skills for future growth.",
  "education": [
    {
      "degree": "Bachelor of Technology (B.Tech)",
      "field": "computer science and engineering",
      "institution": "Prof. Ram Meghe Institute of Technology & Research (PRMIT&R), Badnera",
      "endYear": "2028"
    },
    {
      "degree": "Higher Secondary Certificate (HSC), Science",
      "institution": "Smt. Jijabai Hanumantrao Deshmukh junior college,Jarud",
      "endYear": "2024"
    },
    {
      "degree": "Secondary School Certificate (SSC)",
      "institution": "Vasantrao Naik Highschool, Jarud",
      "endYear": "2022"
    }
  ],
  "experience": [],
  "projects": [
    {
      "title": "Tic Tac Toe Game | Mini Project",
      "description": "Developed an interactive Tic Tac Toe game using HTML, CSS, and JavaScript. Implemented game logic for win/draw detection and responsive design for smooth user experience. Demonstrated problem-solving and programming fundamentals through hands-on project work.",
      "techStack": [
        "HTML",
        "CSS",
        "JavaScript"
      ]
    }
  ],
  "skills": {
    "technical": [
      "HTML5",
      "CSS3",
      "JavaScript"
    ],
    "soft": [],
    "tools": []
  },
  "certifications": [],
  "achievements": [
    {
      "title": "MHT-CET score",
      "description": "89.56%"
    },
    {
      "title": "SSC Score",
      "description": "94.80%"
    }
  ],
  "languages": [],
  "metadata": {
    "resumeVersion": 1,
    "extractedAt": "2024-05-15T12:00:00Z",
    "sourceFileType": "pdf"
  }
}

// Add Enter key support for skill inputs
document.addEventListener('DOMContentLoaded', function() {
    const technicalInput = document.getElementById("technicalSkillInput");
    const softInput = document.getElementById("softSkillInput");
    const toolsInputEl = document.getElementById("toolsInput");
    
    if (technicalInput) {
        technicalInput.onkeydown = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addTechnicalSkill();
            }
        };
    }
    
    if (softInput) {
        softInput.onkeydown = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addSoftSkill();
            }
        };
    }
    
    if (toolsInputEl) {
        toolsInputEl.onkeydown = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addTool();
            }
        };
    }
});


async function initializeProfile() {
    try {
        // Set loading placeholders
        setLoadingPlaceholders();
        
        // Initialize form with saved data from localStorage first
        const savedData = localStorage.getItem("resume");
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                if (parsedData && typeof parsedData === 'object') {
                    data = parsedData;
                }
            } catch (e) {
                console.warn("Could not parse saved resume data:", e);
            }
        }
        
        // Populate form fields with current data
        if (nameInput) nameInput.value = data.basics?.name || "";
        if (emailInput) emailInput.value = data.basics?.email || "";
        if (phoneInput) phoneInput.value = data.basics?.phone || "";
        if (locationInput) locationInput.value = data.basics?.location || "";
        if (linkedinInput) linkedinInput.value = data.basics?.links?.linkedin || "";
        if (githubInput) githubInput.value = data.basics?.links?.github || "";
        if (portfolioInput) portfolioInput.value = data.basics?.links?.portfolio || "";
        if (summaryTextArea) summaryTextArea.value = data.summary || "";

        // Try to fetch resume from server
        try {
            const response = await getResume();
            
            // Check if response has the expected structure
            if (response?.data?.resume?.content) {
                console.log("Loaded resume data from server:", response.data.resume.content);
                loadResumeData(response.data.resume.content);
            } else if (response?.data) {
                // Try direct data if structure is different
                console.log("Loaded resume data (alternate structure):", response.data);
                loadResumeData(response.data.resume.content);
            } else {
                console.warn("No resume content in server response, using local data");
                // Render with existing data
                renderEducation();
                renderExperience();
                renderProjects();
                renderSkills();
                renderCertifications();
                renderAchievements();
                renderLanguages();
                updateProfile();
            }
        } catch (apiError) {
            console.error("Error fetching resume from server:", apiError);
            // Continue with local data
            renderEducation();
            renderExperience();
            renderProjects();
            renderSkills();
            renderCertifications();
            renderAchievements();
            renderLanguages();
            updateProfile();
        } finally {
            // Reset placeholders after data is loaded
            resetPlaceholders();
        }
    } catch (error) {
        console.error("Error initializing profile:", error);
        // Ensure UI is still rendered even on error
        renderEducation();
        renderExperience();
        renderProjects();
        renderSkills();
        renderCertifications();
        renderAchievements();
        renderLanguages();
        updateProfile();
        // Reset placeholders on error
        resetPlaceholders();
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    await initializeProfile();
});
