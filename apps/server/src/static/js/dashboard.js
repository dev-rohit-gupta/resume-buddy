const fab = document.querySelector(".fab");
const drawer = document.getElementById("jobDrawer");
const closeBtn = document.getElementById("closeDrawer");
const form = document.getElementById("jobForm");

fab.onclick = () => drawer.classList.add("open");
closeBtn.onclick = () => drawer.classList.remove("open");

form.onsubmit = e => {
  e.preventDefault();

  const data = {
    jobMeta: {
      title: title.value,
      companyName: companyName.value,
      location: city.value + ", " + country.value,
      postedDate: postedDate.value,
      openings: openings.value
    },
    workDetails: {
      startDate: startDate.value,
      duration: duration.value,
      stipend: stipendAmount.value
    },
    skills: requiredSkills.value.split(",").map(s => s.trim()),
    companyInfo: { description: companyDesc.value },
    rawData: { sourceURL: sourceURL.value }
  };

  console.log("Job Data:", data);
  alert("Job saved!");
  drawer.classList.remove("open");
};