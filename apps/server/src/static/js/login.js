const form = document.querySelector('form.login-form');

if (!form) {
  console.error("Login form not found");
  return;
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Login successful');
      window.location.href = '/dashboard';
    } else {
      alert(result.message || 'Login failed');
    }
  } catch (error) {
    console.error(error);
    alert('Server error. Please try again.');
  }
});