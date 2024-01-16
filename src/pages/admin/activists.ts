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
      const activists = await kv.lrange("activists", 0, -1);

      const header = [
        "name",
        "email",
        "phone",
        "address",
        "postcode",
        "group",
        "steeringGroup",
        "localOrganizer",
        "press",
        "website",
      ].join(",");
      return new Response(
        header +
          "\n" +
          [...new Set(activists.filter((activists) => activists != ""))].join(
            "\n"
          ),
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
