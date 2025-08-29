async function getMessages({
  baseUrl,
  token,
  chatId,
  count = 100,
  offset = 0,
  time_from,
  time_to,
}) {
  const url = new URL(
    `${baseUrl}/messages/list${chatId ? "/" + encodeURIComponent(chatId) : ""}`,
  );
  const params = { count, offset };
  if (time_from) params.time_from = time_from;
  if (time_to) params.time_to = time_to;
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(`WHAPI ${res.status}: ${await res.text()}`);
  return res.json();
}

module.exports = { getMessages };
