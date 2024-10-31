export async function GET(request) {
  const date = { id: 1, name: "John" };
  return Response.json({ date });
}
