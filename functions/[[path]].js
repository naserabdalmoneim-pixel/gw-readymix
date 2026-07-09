export async function onRequest(context) {
  const url = new URL(context.request.url);
  const legacyPolicyPaths = new Set([
    "/privacy-policy.html",
    "/terms",
    "/terms.html",
    "/refund-policy",
    "/refund-policy.html",
    "/tamara",
    "/tamara.html",
  ]);

  if (legacyPolicyPaths.has(url.pathname)) {
    return Response.redirect(`${url.origin}/privacy-policy`, 301);
  }

  if (
    url.pathname.startsWith("/https://") ||
    url.pathname.startsWith("/http://") ||
    url.pathname.startsWith("/_https://") ||
    url.pathname.startsWith("/_http://")
  ) {
    return Response.redirect(`${url.origin}/`, 301);
  }

  return context.next();
}