
const form = document.getElementById("registerForm");

if (form) {
  form.addEventListener("submit", async event => {
    event.preventDefault();

    const button = form.querySelector('[type="submit"]');
    const message = document.getElementById("message");

    const username = form.elements.username.value.trim();
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    const adminPassword = form.elements.adminPassword.value;

    setLoading(button, true);

    try {
      const result = await apiRequest("register", {
        username,
        email,
        password,
        adminPassword
      });

      if (!result.success) {
        throw new Error(result.message || "Registration failed.");
      }

      showMessage(
        message,
        result.message || "Account created successfully.",
        "success"
      );

      form.reset();

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);

    } catch (error) {
      showMessage(message, error.message, "error");
    } finally {
      setLoading(button, false);
    }
  });
}
