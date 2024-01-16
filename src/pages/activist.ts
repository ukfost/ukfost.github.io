import { kv } from "@vercel/kv";

export async function post({ request }) {
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const address = formData.get("address");
  const postcode = formData.get("postcode");
  const group = formData.get("group");

  const steeringGroup = formData.get("steering-group") == "on";
  const localOrganizer = formData.get("local-organizer") == "on";
  const press = formData.get("press") == "on";
  const website = formData.get("website") == "on";
  const speaker = formData.get("speaker") == "on";

  await kv.lpush(
    "activists",
    [
      name,
      email,
      phone,
      address,
      postcode,
      group,
      steeringGroup,
      localOrganizer,
      press,
      website,
      speaker,
    ].join(",")
  );

  return new Response(null, {
    status: 302,
    headers: { Location: "/" },
  });
}
