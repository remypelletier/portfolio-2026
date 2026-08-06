export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/contact") {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
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
