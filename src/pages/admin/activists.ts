import { kv } from "@vercel/kv";
import { parse } from "csv-parse/sync";

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
      return new Response(render(activists), {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    }
  }

  return new Response(null, {
    status: 401,
    headers: { "WWW-Authenticate": "Basic realm='password access required'" },
  });
}

function render(activists) {
  return `<!doctype html>
  <html>
    <head>
      <style>
        table {
          font-family: sans-serif;
          border-collapse: collapse;
          width: 100%;
        }

        td, th {
          border: 1px solid #ccc;
          text-align: left;
          padding: 8px;
        }

        tr:nth-child(even) {
          background-color: #eee;
        }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <th>name</th>
          <th>email</th>
          <th>phone</th>
          <th>address</th>
          <th>postcode</th>
          <th>group</th>
          <th>steeringGroup</th>
          <th>localOrganizer</th>
          <th>press</th>
          <th>website</th>
          </tr>
       ${activists.map(renderActivist).join("")}
      </table>
    </body>
  </html>`;
}

function renderActivist(activist) {
  return `<tr>${parse(activist)[0]
    .map((data) => `<td>${escapeHtml(data)}</td>`)
    .join("")}</tr>`;
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
