
const GAS_URL = "https://script.google.com/macros/s/AKfycbxo280rZL3bDbkCrMD9k76i196af5ytVSg0OiR0I7-jf4BRv6rnNalKCElkQG_DwwsA/exec";
const API_SECRET = "KAISERkaiser01035637048kaiserKAISER";

const COOKIE_NAME = "ts_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function send(res, status, data) {
  return res.status(status).json(data);
}

function getCookie(req, name) {
  const cookies = req.headers.cookie || "";

  const item = cookies
    .split(";")
    .map(value => value.trim())
    .find(value => value.startsWith(name + "="));

  return item
    ? decodeURIComponent(item.split("=").slice(1).join("="))
    : null;
}

function setSessionCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE}`
  );
}

function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
  );
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return send(res, 405, {
      success: false,
      message: "Method not allowed."
    });
  }

  if (!GAS_URL || !API_SECRET) {
    return send(res, 500, {
      success: false,
      message: "Server configuration is incomplete."
    });
  }

  try {
    const { action, payload = {} } = req.body || {};

    const allowedActions = [
      "register",
      "login",
      "logout",
      "me",
      "changePassword",
      "forgotPassword",
      "resetPassword"
    ];

    if (!allowedActions.includes(action)) {
      return send(res, 400, {
        success: false,
        message: "Invalid action."
      });
    }

    const sessionToken = getCookie(req, COOKIE_NAME);

    const response = await fetch(GAS_URL, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        secret: API_SECRET,
        action,
        payload,
        sessionToken
      })
    });

    if (!response.ok) {
      throw new Error("Backend request failed.");
    }

    const result = await response.json();

    if (
      action === "login" &&
      result.success &&
      result.data?.sessionToken
    ) {
      setSessionCookie(res, result.data.sessionToken);
      delete result.data.sessionToken;
    }

    if (action === "logout") {
      clearSessionCookie(res);
    }

    return send(res, 200, result);

  } catch (error) {
    console.error("Authentication API Error:", error);

    return send(res, 500, {
      success: false,
      message: "An unexpected server error occurred."
    });
  }
};
