function htmlToElement(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
}
function getWarningColor(score) {
  if (score >= 80) return "var(--success)"; // Green
  if (score >= 50) return "var(--warning)"; // Yellow
  return "var(--danger)"; // Red
}

function getPassedTime(createdAt) {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffInMs = now - createdDate;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    return `${diffInDays} day ago`;
  }
}
