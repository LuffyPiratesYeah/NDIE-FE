export async function GET() {
  const code = `mock-${crypto.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/login/success?code=${encodeURIComponent(code)}`,
    },
  });
}
