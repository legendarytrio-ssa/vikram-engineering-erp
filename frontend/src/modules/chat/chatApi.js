const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const DEFAULT_API_BASE = "/api/chat";

export function createChatApi(apiBaseUrl = DEFAULT_API_BASE) {
  const base = trimTrailingSlash(apiBaseUrl);

  const post = async (path, body) => {
    const response = await fetch(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed (${response.status})`);
    }

    return data;
  };

  return {
    getToken: ({ name, email }) => post("/token", { name, email }),

    joinRoom: ({ roomId, name, email, roomName }) =>
      post(`/rooms/${encodeURIComponent(roomId)}/join`, {
        name,
        email,
        roomName,
      }),
  };
}
