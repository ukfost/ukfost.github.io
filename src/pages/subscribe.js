export async function post({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");

  await fetch(
    "https://admin.googleapis.com/admin/directory/v1/groups/ukfost-newsletter@googlegroups.com/member"
  );

  await gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: range,
    valueInputOption: valueInputOption,
    resource: { values: values },
  });

  return new Response(null, {
    status: 302,
    headers: { Location: "/" },
  });
}
