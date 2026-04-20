const JSON_HEADERS = {
  "content-type": "application/json; charset=UTF-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

const NEWSLETTER_FIELDS = [
  "email",
  "source",
  "lang",
  "page_url",
  "created_at",
  "timestamp",
  "user_agent",
];

const INQUIRY_FIELDS = [
  "full_name",
  "email",
  "phone",
  "product_type",
  "concrete_type",
  "quantity",
  "project_location",
  "message",
  "lang",
  "page_url",
  "created_at",
  "timestamp",
  "user_agent",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "source",
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: buildCorsHeaders(origin, env),
      });
    }

    if (request.method !== "POST") {
      return json(
        { ok: false, message: "Method not allowed" },
        { status: 405, headers: buildCorsHeaders(origin, env) },
      );
    }

    if (!isAllowedOrigin(origin, env)) {
      return json(
        { ok: false, message: "Origin not allowed" },
        { status: 403, headers: buildCorsHeaders(origin, env) },
      );
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json(
        { ok: false, message: "Invalid JSON body" },
        { status: 400, headers: buildCorsHeaders(origin, env) },
      );
    }

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return json(
        { ok: false, message: "Invalid payload" },
        { status: 400, headers: buildCorsHeaders(origin, env) },
      );
    }

    if (String(payload.honeypot || "").trim()) {
      return json(
        { ok: true, accepted: true, spam: true },
        { status: 200, headers: buildCorsHeaders(origin, env) },
      );
    }

    const type = payload.type === "newsletter" ? "newsletter" : "inquiry";
    const upstreamPayload = buildUpstreamPayload(payload, type, env, request);

    if (!upstreamPayload.email) {
      return json(
        { ok: false, message: "Email is required" },
        { status: 400, headers: buildCorsHeaders(origin, env) },
      );
    }

    if (type === "inquiry" && !upstreamPayload.full_name) {
      return json(
        { ok: false, message: "Full name is required" },
        { status: 400, headers: buildCorsHeaders(origin, env) },
      );
    }

    try {
      const upstream = await fetch(env.APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(upstreamPayload),
      });

      const responseText = await upstream.text();
      const upstreamJson = safeJsonParse(responseText);

      if (!upstream.ok || upstreamJson?.ok !== true) {
        return json(
          {
            ok: false,
            message:
              upstreamJson?.message ||
              upstreamJson?.error ||
              "Apps Script rejected the request",
          },
          { status: 502, headers: buildCorsHeaders(origin, env) },
        );
      }

      return json(
        {
          ok: true,
          success: true,
          provider: "cloudflare-worker",
          sheet: upstreamJson.sheet === true,
          email: upstreamJson.email === true,
        },
        { status: 200, headers: buildCorsHeaders(origin, env) },
      );
    } catch (error) {
      return json(
        {
          ok: false,
          message: error?.message || "Lead relay request failed",
        },
        { status: 502, headers: buildCorsHeaders(origin, env) },
      );
    }
  },
};

function buildUpstreamPayload(payload, type, env, request) {
  const fieldList = type === "newsletter" ? NEWSLETTER_FIELDS : INQUIRY_FIELDS;
  const forwarded = Object.fromEntries(
    fieldList
      .map((key) => [key, cleanValue(payload[key])])
      .filter(([, value]) => value !== ""),
  );

  forwarded.type = type;
  forwarded.secret = env.APPS_SCRIPT_SHARED_SECRET;
  forwarded.notify_to = env.NOTIFICATION_EMAIL;
  forwarded.ip = getClientIp(request);

  if (type === "inquiry" && !("payment_method" in forwarded)) {
    forwarded.payment_method = "";
  }

  return forwarded;
}

function getClientIp(request) {
  return (
    cleanValue(request.headers.get("CF-Connecting-IP")) ||
    cleanValue(request.headers.get("X-Forwarded-For")) ||
    ""
  );
}

function cleanValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 4000);
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isAllowedOrigin(origin, env) {
  if (!origin) {
    return true;
  }

  const allowedOrigins = String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return allowedOrigins.includes(origin);
}

function buildCorsHeaders(origin, env) {
  const headers = new Headers(JSON_HEADERS);
  headers.set("access-control-allow-methods", "POST, OPTIONS");
  headers.set("access-control-allow-headers", "Content-Type");
  headers.set("vary", "Origin");

  if (origin && isAllowedOrigin(origin, env)) {
    headers.set("access-control-allow-origin", origin);
  }

  return headers;
}

function json(payload, init = {}) {
  const headers = new Headers(init.headers || {});

  for (const [key, value] of Object.entries(JSON_HEADERS)) {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  }

  return new Response(JSON.stringify(payload), {
    ...init,
    headers,
  });
}
