
const form = document.getElementById("resetPasswordForm");

if (form) {
  const email = getQueryParameter("email");
  const otp = getQueryParameter("otp");

  const message = document.getElementById("message");

  if (!email || !otp) {
    showMessage(
      message,
      "Reset information is missing. Please request a new code.",
      "error"
    );

    form.querySelector('[type="submit"]').disabled = true;
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const button = form.querySelector('[type="submit"]');

    const newPassword = form.elements.newPassword.value;
    const confirmPassword = form.elements.confirmPassword.value;

    if (!email || !otp) {
      showMessage(message, "Invalid reset request.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage(message, "Passwords do not match.", "error");
      return;
    }

    if (newPassword.length < 8) {
      showMessage(message, "Password must be at least 8 characters.", "error");
      return;
    }

    setLoading(button, true);

    try {
      const result = await apiRequest("resetPassword", {
        email,
        otp,
        newPassword
      });

      if (!result.success) {
        throw new Error(result.message || "Password reset failed.");
      }

      showMessage(
        message,
        result.message || "Password changed successfully.",
        "success"
      );

      form.reset();

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);

    } catch (error) {
      showMessage(message, error.message, "error");
    } finally {
      setLoading(button, false);
    }
  });
}
