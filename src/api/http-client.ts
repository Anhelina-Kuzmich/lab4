const BASE_URL: string =
  import.meta.env.VITE_API_URL || "https://dummyjson.com";

interface CustomRequestInit extends RequestInit {
  _retry?: boolean;
}

export async function http<T>(
  path: string,
  options: CustomRequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("accessToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && !options._retry) {
    options._retry = true;
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            refreshToken,
            expiresInMins: 30,
          }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          headers["Authorization"] = `Bearer ${data.accessToken}`;

          const retryResponse = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers,
          });

          if (!retryResponse.ok) {
            throw new Error(
              `HTTP ${retryResponse.status}: ${retryResponse.statusText}`
            );
          }
          return retryResponse.json() as Promise<T>;
        }
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authUser");
        window.location.href = "#/login";
      }
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const msg =
      errorBody?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(msg);
  }

  return response.json() as Promise<T>;
}
