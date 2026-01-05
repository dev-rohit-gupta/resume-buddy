
async function fetchData(
  url,
  { method = "GET", headers = {}, body = null } = {}
) {
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
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

async function getDashboardStats() {
  const data = await fetchData("/api/users/me/dashboard");
  return data;
}
const getAnalysedJobs = async (limit = 10) => {
  const data = await fetchData(`/api/users/me/suggestions?limit=${limit}`);
  return data;
};