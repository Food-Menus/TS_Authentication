
const form = document.getElementById("forgotPasswordForm");

if (form) {
  form.addEventListener("submit", async event => {
    event.preventDefault();

    const button = form.querySelector('[type="submit"]');
    const message = document.getElementById("message");
    const email = form.elements.email.value.trim();

    setLoading(button, true);

    try {
      const result = await apiRequest("forgotPassword", {
        email
      });

      if (!result.success) {
        throw new Error(result.message || "Unable to send reset code.");
      }

      showMessage(
        message,
        result.message || "Reset code sent successfully.",
        "success"
      );

      setTimeout(() => {
        const params = new URLSearchParams({ email });
        window.location.href = `verify-code.html?${params.toString()}`;
      }, 1000);

    } catch (error) {
      showMessage(message, error.message, "error");
    } finally {
      setLoading(button, false);
    }
  });
}
