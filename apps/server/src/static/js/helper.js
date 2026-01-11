function htmlToElements(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();

  if (!template.content.children.length) {
    console.warn("htmlToElements: No elements found");
  }
  const childrenArray = Array.from(template.content.children);

  return childrenArray;
}

function getWarningColor(score) {
  if (score >= 80) return "var(--success)"; // Green
  if (score >= 50) return "var(--warning)"; // Yellow
  return "var(--danger)"; // Red
}

//["Low(red)", "Partial(yellow)", "Good(green)", "Perfect(primary)"]
function getMatchColor(match) {
  const lowerMatch = match.toLowerCase();
  if (lowerMatch === "low")
    return "var(--danger)"; // Red
  else if (lowerMatch === "partial")
    return "var(--warning)"; // Yellow
  else if (lowerMatch === "good")
    return "var(--success)"; // Green
  else if (lowerMatch === "perfect") return "var(--primary-blue)"; // Primary
  return "var(--text-secondary)"; // Grey
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

// show or hide DOM elements
function hideElement(element) {
  const el = typeof element === "string" ? document.querySelector(element) : element;
  if (el) {
    el.style.display = "none";
  }
}

function showElement(element, displayStyle = "block") {
  const el = typeof element === "string" ? document.querySelector(element) : element;
  if (el) {
    el.style.display = displayStyle;
  }
}

// capitalize first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function capitalizeEachLetter(string) {
  return string
    .split(" ")
    .map((word) => capitalizeFirstLetter(word))
    .join(" ");
}

function loadComponents(components, containerNode) {
  if (!containerNode) return;
  if (!Array.isArray(components)) {
    components = [components];
  }
  if (typeof containerNode === "string") {
    containerNode = document.querySelector(containerNode);
  }
  components.forEach((component) => {
    containerNode.appendChild(component);
  });
}
function isUrlValid(value) {
  if (value == null) return true; // null or undefined allowed

  if (typeof value !== "string") return false;

  const v = value.trim();
  if (v === "") return true; // empty string allowed (optional)

  return /^https?:\/\//i.test(v) || /^[\w.-]+\.[a-z]{2,}/i.test(v);
}
function debounce (func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

