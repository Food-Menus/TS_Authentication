
const API_URL = "/api/auth";

async function apiRequest(action, payload = {}) {
  const response = await fetch(API_URL, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ action, payload })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed.");
  }

  return result;
}

function showMessage(element, message, type = "") {
  if (!element) return;

  element.textContent = message;
  element.className = "message " + type;
}

function setLoading(button, loading, text) {
  if (loading) {
    button.dataset.originalText = button.textContent;
    button.textContent = "Please wait...";
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || text;
    button.disabled = false;
  }
}

function handleForm(formId, callback) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    const message = form.querySelector(".message");

    setLoading(button, true);

    try {
      await callback(new FormData(form), message);
    } catch (error) {
      showMessage(message, error.message, "error");
    } finally {
      setLoading(button, false);
    }
  });
}

// Login
handleForm("loginForm", async (data, message) => {
  const result = await apiRequest("login", {
    email: data.get("email"),
    password: data.get("password")
  });

  if (!result.success) {
    throw new Error(result.message);
  }

  window.location.href = "dashboard.html";
});

// Register
handleForm("registerForm", async (data, message) => {
  const result = await apiRequest("register", {
    username: data.get("username"),
    email: data.get("email"),
    password: data.get("password"),
    adminPassword: data.get("adminPassword")
  });

  if (!result.success) {
    throw new Error(result.message);
  }

  showMessage(message, result.message, "success");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1200);
});

// Forgot Password
handleForm("forgotForm", async (data, message) => {
  const result = await apiRequest("forgotPassword", {
    email: data.get("email")
  });

  if (!result.success) {
    throw new Error(result.message);
  }

  showMessage(message, result.message, "success");
});

// Reset Password
handleForm("resetForm", async (data, message) => {
  const result = await apiRequest("resetPassword", {
    email: data.get("email"),
    otp: data.get("otp"),
    newPassword: data.get("newPassword")
  });

  if (!result.success) {
    throw new Error(result.message);
  }

  showMessage(message, result.message, "success");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
});

// Dashboard
async function loadDashboard() {
  const username = document.getElementById("username");
  if (!username) return;

  const message = document.getElementById("dashboardMessage");

  try {
    const result = await apiRequest("me");

    if (!result.success) {
      window.location.href = "login.html";
      return;
    }

    const user = result.data.user;

    document.getElementById("username").textContent = user.username;
    document.getElementById("profileUsername").textContent = user.username;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profileRole").textContent = user.role;

  } catch (error) {
    showMessage(message, error.message, "error");
    window.location.href = "login.html";
  }
}

// Logout
const logoutButton = document.getElementById("logoutBtn");

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;

    try {
      await apiRequest("logout");
    } finally {
      window.location.href = "login.html";
    }
  });
}

// Show / Hide Change Password Form
const changePasswordButton =
  document.getElementById("changePasswordBtn");

const changePasswordForm =
  document.getElementById("changePasswordForm");

if (changePasswordButton && changePasswordForm) {
  changePasswordButton.addEventListener("click", () => {
    changePasswordForm.classList.toggle("hidden");
  });
}

// Change Password
handleForm("changePasswordForm", async (data, message) => {
  const result = await apiRequest("changePassword", {
    currentPassword: data.get("currentPassword"),
    newPassword: data.get("newPassword")
  });

  if (!result.success) {
    throw new Error(result.message);
  }

  showMessage(message, result.message, "success");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
});

loadDashboard();
