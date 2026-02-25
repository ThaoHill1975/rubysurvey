const getCSRFToken = (): string | null => {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.getAttribute("content") : null;
};

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const csrfToken = getCSRFToken();
  if (csrfToken) {
    defaultHeaders["X-CSRF-Token"] = csrfToken;
  }

  const response = await fetch(url, {
    method,
    headers: { ...defaultHeaders, ...headers },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw { status: response.status, ...errorData };
  }

  return response.json();
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) => request<T>(url, { method: "POST", body }),
  put: <T>(url: string, body: unknown) => request<T>(url, { method: "PUT", body }),
  patch: <T>(url: string, body: unknown) => request<T>(url, { method: "PATCH", body }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};
