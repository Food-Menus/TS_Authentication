
const profileUsername = document.getElementById("profileUsername");

if (profileUsername) {
  async function loadDashboard() {
    const message = document.getElementById("dashboardMessage");

    try {
      const result = await apiRequest("me");

      if (!result.success) {
        window.location.replace("login.html");
        return;
      }

      const user = result.data.user;

      document.getElementById("username").textContent =
        user.username || "";

      profileUsername.textContent = user.username || "";

      document.getElementById("profileEmail").textContent =
        user.email || "";

      document.getElementById("profileRole").textContent =
        user.role || "";

    } catch (error) {
      showMessage(message, error.message, "error");

      setTimeout(() => {
        window.location.replace("login.html");
      }, 1000);
    }
  }

  loadDashboard();
}

// Logout
const logoutButton = document.getElementById("logoutBtn");

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    const message = document.getElementById("dashboardMessage");

    logoutButton.disabled = true;

    try {
      const result = await apiRequest("logout");

      if (!result.success) {
        throw new Error(result.message || "Logout failed.");
      }

      window.location.href = "login.html";

    } catch (error) {
      showMessage(message, error.message, "error");
      logoutButton.disabled = false;
    }
  });
}
