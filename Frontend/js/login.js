
const form = document.getElementById("loginForm");

if (form) {
  form.addEventListener("submit", async event => {
    event.preventDefault();

    const button = form.querySelector('[type="submit"]');
    const message = document.getElementById("message");

    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;

    setLoading(button, true);

    try {
      const result = await apiRequest("login", {
        email,
        password
      });

      if (!result.success) {
        throw new Error(result.message || "Login failed.");
      }

      showMessage(message, "Login successful.", "success");

      window.location.href = "dashboard.html";

    } catch (error) {
      showMessage(message, error.message, "error");
    } finally {
      setLoading(button, false);
    }
  });
}
