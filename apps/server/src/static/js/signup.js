const fileInput = document.getElementById("resumeUpload");
const fileNameDisplay = document.getElementById("file-name-display");
const dropText = document.getElementById("dropText");
const form = document.querySelector("form.signup-form");
const submitBtn = document.querySelector(".btn-submit-resume");
fileInput.addEventListener("change", function () {
  const file = this.files[0];

  if (!file) {
    fileNameDisplay.textContent = "no file chosen";
    dropText.textContent = "Drop your resume here or click to upload";
    return;
  }

  const fileName = file.name;
  const fileSize = file.size;
  const ext = fileName.split(".").pop().toLowerCase();

  const allowed = ["pdf", "docx"];

  if (!allowed.includes(ext)) {
    alert("Only PDF or DOCX files are allowed.");
    this.value = "";
    fileNameDisplay.textContent = "no file chosen";
    dropText.textContent = "Drop your resume here or click to upload";
    return;
  }

  const maxSize = 3 * 1024 * 1024;
  if (fileSize > maxSize) {
    alert("File is too large. Maximum size is 3MB.");
    this.value = "";
    fileNameDisplay.textContent = "no file chosen";
    dropText.textContent = "Drop your resume here or click to upload";
    return;
  }

  fileNameDisplay.textContent = fileName;
  dropText.textContent = "File ready to upload";
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (!fileInput.files[0]) {
    alert("Please select a resume file before submitting.");
    return;
  }
  const form = e.target;
  const formData = new FormData(form);
  // Loader display
  submitBtn.disabled = true;
  showLoader("Signing up...", document.body);

  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: formData,
  });
  if (response.ok) {
    window.location.href = "/login";
    return;
  } else {
    const errorData = await response.json();
    alert("Error: " + (errorData.message || "Signup failed."));
  }
  removeLoader(document.body);
  submitBtn.disabled = false;
});
