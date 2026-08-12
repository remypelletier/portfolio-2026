const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    // Hash of the inline theme-init script in index.html — recompute it if that script's content changes.
    "script-src 'self' 'sha256-CKBPwZZoSLPGBpUNdjnBNvyoCwRMswSuOBnPq4w9834='",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self'",
    "connect-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; "),
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const response =
      request.method === "POST" && url.pathname === "/api/contact"
        ? await handleContact(request, env)
        : await env.ASSETS.fetch(request);

    return withSecurityHeaders(response);
  },
};

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function handleContact(request, env) {
  if (!isTrustedOrigin(request)) {
    return jsonResponse({ error: "invalid-origin" }, 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "invalid-json" }, 400);
  }

  const { name, email, message, website } = body || {};

  if (isNonEmptyString(website)) {
    return jsonResponse({ ok: true }, 200);
  }

  if (!isNonEmptyString(name) || name.length > 200) {
    return jsonResponse({ error: "invalid-name" }, 400);
  }
  if (!isValidEmail(email)) {
    return jsonResponse({ error: "invalid-email" }, 400);
  }
  if (!isNonEmptyString(message) || message.length > 5000) {
    return jsonResponse({ error: "invalid-message" }, 400);
  }

  try {
    await sendContactEmail(env, { name, email, message });
  } catch {
    return jsonResponse({ error: "send-failed" }, 502);
  }

  return jsonResponse({ ok: true }, 200);
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isTrustedOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return false;

  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value) {
  return typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function sendContactEmail(env, { name, email, message }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Portfolio - Formulaire de contact <${env.CONTACT_FROM}>`,
      to: [env.CONTACT_DESTINATION],
      reply_to: email,
      subject: `Nouveau message de ${name} (portfolio)`,
      text: `${message}\n\n---\nDe : ${name} <${email}>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`resend-error-${response.status}`);
  }
}
