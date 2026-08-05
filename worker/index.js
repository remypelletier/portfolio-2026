import { createMimeMessage } from "mimetext";

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

  const { name, email, message, turnstileToken } = body || {};

  if (!isNonEmptyString(name) || name.length > 200) {
    return jsonResponse({ error: "invalid-name" }, 400);
  }
  if (!isValidEmail(email)) {
    return jsonResponse({ error: "invalid-email" }, 400);
  }
  if (!isNonEmptyString(message) || message.length > 5000) {
    return jsonResponse({ error: "invalid-message" }, 400);
  }
  if (!isNonEmptyString(turnstileToken)) {
    return jsonResponse({ error: "missing-turnstile" }, 400);
  }

  const humanVerified = await verifyTurnstile(
    turnstileToken,
    request.headers.get("CF-Connecting-IP"),
    env.TURNSTILE_SECRET
  );
  if (!humanVerified) {
    return jsonResponse({ error: "turnstile-failed" }, 403);
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

async function verifyTurnstile(token, ip, secret) {
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip: ip || undefined }),
  });
  const result = await response.json();
  return result.success === true;
}

async function sendContactEmail(env, { name, email, message }) {
  const { EmailMessage } = await import("cloudflare:email");

  const msg = createMimeMessage();
  msg.setSender({ name: "Portfolio - Formulaire de contact", addr: env.CONTACT_FROM });
  msg.setRecipient(env.CONTACT_DESTINATION);
  msg.setHeader("Reply-To", email);
  msg.setSubject(`Nouveau message de ${name} (portfolio)`);
  msg.addMessage({ contentType: "text/plain", data: `${message}\n\n---\nDe : ${name} <${email}>` });

  const emailMessage = new EmailMessage(env.CONTACT_FROM, env.CONTACT_DESTINATION, msg.asRaw());
  await env.SEND_EMAIL.send(emailMessage);
}
