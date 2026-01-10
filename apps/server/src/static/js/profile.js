const data = JSON.parse(localStorage.getItem("resume")) || {
    name: "", email: "", phone: "", location: "",
    summary: "", experience: [], projects: [], skills: []
};

function save() {
    data.name = name.value;
    data.email = email.value;
    data.phone = phone.value;
    data.location = location.value;
    data.summary = summaryText.value;
    localStorage.setItem("resume", JSON.stringify(data));
    avatar.textContent = data.name ? data.name[0] : "R";
}

function openTab(id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(id).classList.add('active');
}

function renderExperience() {
    experienceList.innerHTML = "";
    data.experience.forEach((e, i) => {
        experienceList.innerHTML += `
   <div class="item">
    <input value="${e}" oninput="data.experience[${i}]=this.value;save()">
    <button class="btn sm" onclick="data.experience.splice(${i},1);renderExperience();save()">Delete</button>
   </div>`;
    });
}

function addExperience() {
    data.experience.push("");
    renderExperience(); save();
}

function renderProjects() {
    projectList.innerHTML = "";
    data.projects.forEach((p, i) => {
        projectList.innerHTML += `
   <div class="item">
    <input value="${p}" oninput="data.projects[${i}]=this.value;save()">
    <button class="btn sm" onclick="data.projects.splice(${i},1);renderProjects();save()">Delete</button>
   </div>`;
    });
}

function addProject() {
    data.projects.push("");
    renderProjects(); save();
}

skillInput.onkeydown = e => {
    if (e.key === "Enter") {
        data.skills.push(skillInput.value);
        skillInput.value = "";
        renderSkills(); save();
    }
};

function renderSkills() {
    skillsList.innerHTML = "";
    data.skills.forEach((s, i) => {
        skillsList.innerHTML += `
   <div class="skill">${s}<span onclick="data.skills.splice(${i},1);renderSkills();save()">×</span></div>`;
    });
}

name.value = data.name;
email.value = data.email;
phone.value = data.phone;
location.value = data.location;
summaryText.value = data.summary;
renderExperience();
renderProjects();
renderSkills();
save();