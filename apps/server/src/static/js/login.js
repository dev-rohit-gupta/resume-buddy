const form = document.querySelector('form.login-form');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log(response)

  if (response.ok) {
    window.location.href = '/dashboard';
    alert('Login successful!');
    return;
  } else {
    const errorData = await response.json();
    alert(errorData.message || 'Login failed');
  }
});