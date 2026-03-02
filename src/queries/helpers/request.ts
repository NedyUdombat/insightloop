import { getAppUrl } from "@/queries/helpers";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

async function baseRequest(
  method: HttpMethod,
  endpoint: string,
  body?: unknown,
): Promise<Response> {
  const apiUrl = `${getAppUrl(true)}/api`;

  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  return fetch(`${apiUrl}/${endpoint}`, init);
}

export async function request<T>(
  method: HttpMethod,
  endpoint: string,
  body?: unknown,
): Promise<GenericResponse<T>> {
  const res = await baseRequest(method, endpoint, body);

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(
      errorBody?.message || `Request failed with status ${res.status}`,
    );
  }

  const response = (await res.json()) as GenericResponse<T>;
  return response;
}
