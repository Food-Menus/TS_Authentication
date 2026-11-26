
const API_URL = "/api/auth";

async function apiRequest(action, payload = {}) {
  let response;

  try {
    response = await fetch(API_URL, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action, payload })
    });
  } catch {
    throw new Error("Unable to connect to the server.");
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid server response.");
  }

  if (!response.ok) {
    throw new Error(result.message || "Request failed.");
  }

  return result;
}

function showMessage(element, message, type = "") {
  if (!element) return;

  element.textContent = message;
  element.className = "message";

  if (type) {
    element.classList.add(type);
  }
}

function setLoading(button, loading, originalText = "") {
  if (!button) return;

  if (loading) {
    if (!button.dataset.originalText) {
      button.dataset.originalText =
        button.textContent.trim() || originalText;
    }

    button.disabled = true;
    button.textContent = "Please wait...";
  } else {
    button.disabled = false;

    if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
    }
  }
}

function getQueryParameter(name) {
  return new URLSearchParams(window.location.search).get(name);
}
