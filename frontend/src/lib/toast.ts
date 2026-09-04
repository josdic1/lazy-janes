export type ToastKind = "success" | "error" | "warning" | "info";

export type ToastRecord = {
  id: number;
  message: string;
  kind: ToastKind;
};

let nextId = 1;
let toasts: ToastRecord[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function getToasts(): ToastRecord[] {
  return toasts;
}

export function subscribeToToasts(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function dismissToast(id: number) {
  const next = toasts.filter((toast) => toast.id !== id);
  if (next.length === toasts.length) return;
  toasts = next;
  emit();
}

export function pushToast(
  message: string,
  kind: ToastKind = "info",
  durationMs?: number,
) {
  const clean = message.trim();
  if (!clean) return;

  const id = nextId++;
  toasts = [...toasts.slice(-3), { id, message: clean, kind }];
  emit();

  const timeout =
    durationMs ??
    (kind === "error" ? 6000 : kind === "warning" ? 5000 : 3400);

  window.setTimeout(() => dismissToast(id), timeout);
}
