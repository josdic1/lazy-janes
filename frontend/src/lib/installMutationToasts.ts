import { pushToast } from "./toast";

let installed = false;

function requestPath(input: RequestInfo | URL): string {
  const raw = input instanceof Request ? input.url : String(input);
  return new URL(raw, window.location.origin).pathname;
}

function successMessage(method: string, path: string): string | null {
  if (path.startsWith("/api/auth")) return null;
  if (path === "/api/dev/login") return null;
  if (path.startsWith("/api/dev/demo/")) return "Demo data loaded.";

  if (path === "/api/parties" && method === "POST") return "Party added to the waitlist.";
  if (path.endsWith("/seat")) return "Party seated.";
  if (path.endsWith("/unseat")) return "Party returned to the waitlist.";
  if (path.endsWith("/cancel") && path.includes("/parties/")) return "Party canceled.";

  if (path === "/api/orders" && method === "POST") return "Order saved.";
  if (path.endsWith("/fire")) return "Sent to kitchen.";
  if (path.endsWith("/ready")) return "Marked ready.";
  if (path.endsWith("/deliver")) return "Order delivered.";
  if (path.includes("/orders/") && method === "DELETE") return "Order updated.";

  if (path === "/api/checks" && method === "POST") return "Check created.";
  if (path.endsWith("/present")) return "Check presented.";
  if (path === "/api/payments" && method === "POST") return "Payment recorded.";

  if (path.endsWith("/register/open")) return "Drawer opened.";
  if (path.endsWith("/register/close")) return "Drawer closed.";
  if (path.startsWith("/api/menu")) return "Menu saved.";
  if (path.startsWith("/api/users")) return "User saved.";
  if (path.includes("/parties/sections/manage") || path.includes("/parties/tables/manage")) return "Floor setup saved.";

  return "Saved.";
}

async function errorMessage(response: Response): Promise<{ message: string; pricingRequired: boolean }> {
  const body: unknown = await response.clone().json().catch(() => null);
  const pricingRequired =
    typeof body === "object" &&
    body !== null &&
    "pricingRequired" in body;

  const message =
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof body.error === "string"
      ? body.error
      : `Request failed with status ${response.status}`;

  return { message, pricingRequired };
}

export function installMutationToasts() {
  if (installed) return;
  installed = true;

  const originalFetch = window.fetch.bind(window);

  const wrappedFetch: typeof window.fetch = async (input, init) => {
    const request = input instanceof Request ? input : null;
    const method = (init?.method ?? request?.method ?? "GET").toUpperCase();
    const mutation = method !== "GET" && method !== "HEAD" && method !== "OPTIONS";
    const path = requestPath(input);

    try {
      const response = await originalFetch(input, init);

      if (!mutation) return response;

      if (!response.ok) {
        const error = await errorMessage(response);
        if (!(path === "/api/checks" && response.status === 409 && error.pricingRequired)) {
          pushToast(error.message, "error");
        }
        return response;
      }

      const message = successMessage(method, path);
      if (message) pushToast(message, "success");
      return response;
    } catch (error) {
      if (mutation && !path.startsWith("/api/auth")) {
        pushToast(
          error instanceof Error ? error.message : "Connection failed. Try again.",
          "error",
        );
      }
      throw error;
    }
  };

  window.fetch = wrappedFetch;
}
