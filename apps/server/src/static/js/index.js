const fileInput = document.getElementById('resumeUpload');
    const fileNameBtn = document.getElementById('fileNameBtn');
    const dropText = document.getElementById('dropText');
    const form = document.getElementById('loginForm');

    fileInput.addEventListener('change', function () {
      const file = this.files[0];

      if (!file) {
        fileNameBtn.textContent = 'selected: no file chosen';
        dropText.textContent = 'Drop your resume here or click to upload';
        return;
      }

      const fileName = file.name;
      const fileSize = file.size; 
      const ext = fileName.split('.').pop().toLowerCase();

      const allowed = ['pdf', 'docx'];

      if (!allowed.includes(ext)) {
        alert('Only PDF or DOCX files are allowed.');
        this.value = '';
        fileNameBtn.textContent = 'selected: no file chosen';
        dropText.textContent = 'Drop your resume here or click to upload';
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (fileSize > maxSize) {
        alert('File is too large. Maximum size is 5MB.');
        this.value = '';
        fileNameBtn.textContent = 'selected: no file chosen';
        dropText.textContent = 'Drop your resume here or click to upload';
        return;
      }

      fileNameBtn.textContent = 'selected: ' + fileName;
      dropText.textContent = 'File ready to upload';
    });

    form.addEventListener('submit', function (e) {
      if (!fileInput.files[0]) {
        alert('Please select a resume file before submitting.');
        e.preventDefault();
        return;
      }

      alert('Form submitted successfully (demo only).');
      e.preventDefault();
    });