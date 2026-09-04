import { useSyncExternalStore } from "react";
import {
  dismissToast,
  getToasts,
  subscribeToToasts,
} from "../../lib/toast";

export function ToastHost() {
  const toasts = useSyncExternalStore(
    subscribeToToasts,
    getToasts,
    getToasts,
  );

  return (
    <div className="toast-stack" aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <div
          className="toast"
          data-kind={toast.kind}
          role={toast.kind === "error" ? "alert" : "status"}
          key={toast.id}
        >
          <span className="toast-mark" aria-hidden="true" />
          <p>{toast.message}</p>
          <button
            type="button"
            className="toast-close"
            aria-label="Dismiss alert"
            onClick={() => dismissToast(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
