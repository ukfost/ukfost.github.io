import { kv } from "@vercel/kv";

export async function post({ request }) {
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const address = formData.get("address");
  const postcode = formData.get("postcode");

  await kv.lpush(
    "activists",
    [name, email, phone, address, postcode].join(",")
  );

  return new Response(null, {
    status: 302,
    headers: { Location: "/" },
  });
}
