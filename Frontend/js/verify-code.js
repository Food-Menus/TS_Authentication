
const form = document.getElementById("verifyCodeForm");

if (form) {
  const email = getQueryParameter("email");

  if (!email) {
    showMessage(
      document.getElementById("message"),
      "Email address is missing. Please request a new code.",
      "error"
    );

    form.querySelector('[type="submit"]').disabled = true;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    const message = document.getElementById("message");
    const button = form.querySelector('[type="submit"]');
    const otp = form.elements.otp.value.trim();

    if (!email) {
      showMessage(message, "Email address is missing.", "error");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      showMessage(message, "Enter a valid 6-digit code.", "error");
      return;
    }

    setLoading(button, true);

    const params = new URLSearchParams({
      email,
      otp
    });

    window.location.href = `reset-password.html?${params.toString()}`;
  });
}
