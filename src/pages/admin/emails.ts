import { kv } from "@vercel/kv";

export async function get({ request }) {
  const auth = request.headers.get("authorization");
  if (auth && auth.startsWith("Basic ")) {
    const encoded = auth.substring(6);
    const decoded = atob(encoded);
    const [username, password] = decoded.split(":");
    if (
      username.length > 5 &&
      password.length > 5 &&
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const emails = await kv.lrange("emails", 0, -1);

      return new Response(
        [...new Set(emails.filter((email) => email != ""))].join("\n"),
        {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        }
      );
    }
  }

  return new Response(null, {
    status: 401,
    headers: { "WWW-Authenticate": "Basic realm='password access required'" },
  });
}
