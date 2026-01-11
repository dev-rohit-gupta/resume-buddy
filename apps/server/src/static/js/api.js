async function fetchData(url, { method = "GET", headers = {}, body = null } = {}) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body,
    credentials: "include", // Include cookies for authentication
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("API Error:", error);
  }

  return response.json();
}
async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  window.location.href = "/login";
}

async function getDashboardStats() {
  const data = await fetchData("/api/users/me/dashboard");
  return data;
}
const getAnalysedJobs = async () => {
  const url = new URL(window.location.href);
  const { limit, page, q } = Object.fromEntries(url.searchParams.entries());
  const data = await fetchData(`/api/users/me/suggestions?page=${Number(page || 1)}&limit=${Number(limit || 10)}&q=${q || ""}`);
  return data;
};
function setParams(params) {
  const url = new URL(window.location.href);
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.set(key, params[key]);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.replaceState({}, "", url.toString());
}

async function analyzeOpportunity(formData) {
  const data = await fetchData("/api/users/me/suggestions/generate", {
    method: "POST",
    body: formData,
  });
  return data;
}
