
const form = document.getElementById("changePasswordForm");

if (form) {
  form.addEventListener("submit", async event => {
    event.preventDefault();

    const button = form.querySelector('[type="submit"]');
    const message = document.getElementById("message");

    const currentPassword = form.elements.currentPassword.value;
    const newPassword = form.elements.newPassword.value;
    const confirmPassword = form.elements.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      showMessage(message, "Passwords do not match.", "error");
      return;
    }

    if (newPassword.length < 8) {
      showMessage(message, "Password must be at least 8 characters.", "error");
      return;
    }

    if (currentPassword === newPassword) {
      showMessage(
        message,
        "New password must be different from current password.",
        "error"
      );
      return;
    }

    setLoading(button, true);

    try {
      const result = await apiRequest("changePassword", {
        currentPassword,
        newPassword
      });

      if (!result.success) {
        throw new Error(result.message || "Password change failed.");
      }

      showMessage(
        message,
        result.message || "Password changed successfully.",
        "success"
      );

      form.reset();

      // The current backend revokes sessions after password change.
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
