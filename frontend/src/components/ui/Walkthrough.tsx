import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { useNavigate } from "react-router-dom";

type WalkthroughProps = {
  open: boolean;
  userId: string;
  roles: readonly string[];
  onComplete: () => void;
};

type GuideStep = {
  id: string;
  route: string;
  eyebrow: string;
  title: string;
  body: string;
  selector: string;
  roles: readonly string[];
};

type FocusRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const GUIDE_STEPS: readonly GuideStep[] = [
  {
    id: "arrival",
    route: "/pos",
    eyebrow: "POS · ARRIVALS",
    title: "Add a party",
    body: "Type the party name and guest count, then press Add. They appear in the waitlist below.",
    selector: ".pos-wait-form",
    roles: ["host", "server", "lead_server", "manager", "admin"],
  },
  {
    id: "waitlist",
    route: "/pos",
    eyebrow: "POS · WAITLIST",
    title: "Seat from here",
    body: "Tap a waiting party or Seat. Then choose an open table on the floor.",
    selector: ".pos-waitlist",
    roles: ["host", "server", "lead_server", "manager", "admin"],
  },
  {
    id: "floor",
    route: "/pos",
    eyebrow: "POS · FLOOR",
    title: "The floor shows what is happening",
    body: "Open tables are available. Occupied tables show the party and service state. Tap a table to open it.",
    selector: ".pos-floor",
    roles: ["host", "server", "lead_server", "manager", "admin"],
  },
  {
    id: "order-party",
    route: "/orders/new",
    eyebrow: "ORDER ENTRY · TABLE",
    title: "Choose who you are serving",
    body: "For dine-in service, select a seated table first. That keeps the order attached to the right party.",
    selector: ".service-context--seated-only",
    roles: ["server", "lead_server", "manager", "admin"],
  },
  {
    id: "order-menu",
    route: "/orders/new",
    eyebrow: "ORDER ENTRY · MENU",
    title: "Build the order",
    body: "Choose a menu section, tap an item, and make only the changes the item allows.",
    selector: ".service-menu-browser",
    roles: ["server", "lead_server", "manager", "admin"],
  },
  {
    id: "order-send",
    route: "/orders/new",
    eyebrow: "ORDER ENTRY · SEND",
    title: "Review, then send",
    body: "The current order stays here until you press Fire to Kitchen. Check the table and items before sending.",
    selector: ".service-cart",
    roles: ["server", "lead_server", "manager", "admin"],
  },
  {
    id: "kitchen-cooking",
    route: "/kitchen",
    eyebrow: "KITCHEN · COOKING",
    title: "Cooking is work in progress",
    body: "New fired tickets appear here. When the food is finished, mark the ticket ready.",
    selector: ".kitchen-lane:first-of-type",
    roles: ["chef", "head_chef", "manager", "admin"],
  },
  {
    id: "kitchen-ready",
    route: "/kitchen",
    eyebrow: "KITCHEN · READY",
    title: "Ready means ready to run",
    body: "Finished tickets move here so service can see that the food is ready.",
    selector: '.kitchen-lane[data-ready="true"]',
    roles: ["chef", "head_chef", "manager", "admin"],
  },
  {
    id: "manager",
    route: "/operations",
    eyebrow: "MANAGER · OPERATIONS",
    title: "Manager tools stay separate",
    body: "Use Operations for the register and floor configuration. Day-to-day table service stays in POS.",
    selector: ".operations-manager-grid",
    roles: ["manager", "admin"],
  },
  {
    id: "reports",
    route: "/reports",
    eyebrow: "MANAGER · REPORTS",
    title: "Review the business here",
    body: "Change the report view and time period here. The data below is for review, not live service.",
    selector: ".reports-control-bar",
    roles: ["manager", "admin"],
  },
  {
    id: "seed",
    route: "/users",
    eyebrow: "ADMIN · DEMO DATA",
    title: "Reset or populate the demo",
    body: "Use these controls to reset, preload, or populate demo data. They are testing tools, not restaurant workflow.",
    selector: ".admin-seed-controls",
    roles: ["admin"],
  },
];

const GUIDE_CSS = `
.lj-guide-layer {
  position: fixed;
  inset: 0;
  z-index: 130;
  pointer-events: none;
  font-family: inherit;
}

.lj-guide-focus {
  position: fixed;
  z-index: 131;
  border: 2px solid var(--accent, #0f746f);
  border-radius: 8px;
  box-shadow: 0 0 0 9999px rgba(18, 20, 19, .58);
  pointer-events: none;
  transition: top 120ms ease, left 120ms ease, width 120ms ease, height 120ms ease;
}

.lj-guide-card {
  position: fixed;
  z-index: 132;
  left: 50%;
  width: min(440px, calc(100vw - 24px));
  transform: translateX(-50%);
  padding: 16px;
  display: grid;
  gap: 14px;
  border: 1px solid var(--line-strong, #bfc7c1);
  border-radius: 10px;
  background: var(--surface, #fff);
  color: var(--ink, #171a18);
  box-shadow: 0 12px 32px rgba(0, 0, 0, .18);
  pointer-events: auto;
}

.lj-guide-card[data-placement="bottom"] { bottom: 18px; }
.lj-guide-card[data-placement="top"] { top: 18px; }
.lj-guide-card[data-placement="center"] { top: 50%; transform: translate(-50%, -50%); }

.lj-guide-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.lj-guide-eyebrow,
.lj-guide-count {
  margin: 0;
  color: var(--muted, #667069);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.lj-guide-copy {
  display: grid;
  gap: 6px;
}

.lj-guide-copy h2 {
  margin: 0;
  font-size: 20px;
  line-height: 1.15;
  letter-spacing: -.02em;
}

.lj-guide-copy p {
  margin: 0;
  color: var(--muted, #667069);
  font-size: 13px;
  line-height: 1.5;
}

.lj-guide-hint {
  margin: 0;
  color: var(--muted, #667069);
  font-size: 11px;
}

.lj-guide-progress {
  display: grid;
  grid-template-columns: repeat(var(--lj-guide-count), minmax(0, 1fr));
  gap: 4px;
}

.lj-guide-progress span {
  height: 3px;
  border-radius: 999px;
  background: var(--line, #d9dedb);
}

.lj-guide-progress span[data-active="true"] {
  background: var(--accent, #0f746f);
}

.lj-guide-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.lj-guide-actions > div {
  display: flex;
  gap: 7px;
}

.lj-guide-actions button {
  min-height: 38px;
  padding: 0 13px;
  border: 1px solid var(--line-strong, #bfc7c1);
  border-radius: 7px;
  background: var(--surface, #fff);
  color: inherit;
  font: inherit;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
}

.lj-guide-actions button:hover:not(:disabled) {
  border-color: var(--accent, #0f746f);
}

.lj-guide-actions button:focus-visible {
  outline: 3px solid rgba(15, 116, 111, .24);
  outline-offset: 2px;
}

.lj-guide-actions button:disabled {
  opacity: .38;
  cursor: default;
}

.lj-guide-actions button[data-primary="true"] {
  border-color: var(--accent, #0f746f);
  background: var(--accent, #0f746f);
  color: #fff;
}

@media (max-width: 640px) {
  .lj-guide-card {
    width: calc(100vw - 16px);
    padding: 14px;
  }

  .lj-guide-card[data-placement="bottom"] { bottom: 8px; }
  .lj-guide-card[data-placement="top"] { top: 8px; }

  .lj-guide-copy h2 { font-size: 18px; }
}

@media (prefers-reduced-motion: reduce) {
  .lj-guide-focus { transition: none; }
}
`;

function roleMatches(step: GuideStep, roleSet: Set<string>): boolean {
  return step.roles.some((role) => roleSet.has(role));
}

function rectFor(element: HTMLElement): FocusRect {
  const rect = element.getBoundingClientRect();
  const pad = 6;
  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight;
  const left = Math.max(4, rect.left - pad);
  const top = Math.max(4, rect.top - pad);
  const right = Math.min(maxWidth - 4, rect.right + pad);
  const bottom = Math.min(maxHeight - 4, rect.bottom + pad);

  return {
    top,
    left,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  };
}

export function Walkthrough({
  open,
  userId,
  roles,
  onComplete,
}: WalkthroughProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [focusRect, setFocusRect] = useState<FocusRect | null>(null);

  const steps = useMemo(() => {
    const roleSet = new Set(
      roles.map((role) => role.trim().toLowerCase()),
    );
    return GUIDE_STEPS.filter((step) => roleMatches(step, roleSet));
  }, [roles]);

  useEffect(() => {
    if (open) setIndex(0);
  }, [open, userId]);

  const step = steps[index] ?? steps[0] ?? null;

  useEffect(() => {
    if (!open || !step) {
      setTarget(null);
      setFocusRect(null);
      return;
    }

    navigate(step.route);

    let cancelled = false;
    let timeoutId: number | null = null;
    let attempts = 0;

    const findTarget = () => {
      if (cancelled) return;

      const element = document.querySelector<HTMLElement>(step.selector);
      if (element) {
        setTarget(element);
        element.scrollIntoView({
          block: "center",
          inline: "nearest",
          behavior: "smooth",
        });
        return;
      }

      attempts += 1;
      if (attempts < 30) {
        timeoutId = window.setTimeout(findTarget, 80);
      } else {
        setTarget(null);
        setFocusRect(null);
      }
    };

    timeoutId = window.setTimeout(findTarget, 80);

    return () => {
      cancelled = true;
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      setTarget(null);
      setFocusRect(null);
    };
  }, [navigate, open, step]);

  useEffect(() => {
    if (!open || !target) return;

    const update = () => {
      if (!document.body.contains(target)) {
        setFocusRect(null);
        return;
      }
      setFocusRect(rectFor(target));
    };

    update();
    const intervalId = window.setInterval(update, 250);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, target]);

  if (!open || !step || steps.length === 0) return null;

  const last = index === steps.length - 1;
  const placement = focusRect
    ? focusRect.top + focusRect.height / 2 > window.innerHeight / 2
      ? "top"
      : "bottom"
    : "center";

  const focusStyle: CSSProperties | undefined = focusRect
    ? {
        top: focusRect.top,
        left: focusRect.left,
        width: focusRect.width,
        height: focusRect.height,
      }
    : undefined;

  const progressStyle = {
    "--lj-guide-count": String(steps.length),
  } as CSSProperties;

  return (
    <div className="lj-guide-layer" aria-live="polite">
      <style>{GUIDE_CSS}</style>

      {focusRect ? (
        <div
          className="lj-guide-focus"
          style={focusStyle}
          aria-hidden="true"
        />
      ) : null}

      <section
        className="lj-guide-card"
        data-placement={placement}
        role="dialog"
        aria-modal="false"
        aria-label="Lazy Jane’s guide"
      >
        <div className="lj-guide-topline">
          <p className="lj-guide-eyebrow">{step.eyebrow}</p>
          <p className="lj-guide-count">{index + 1} / {steps.length}</p>
        </div>

        <div className="lj-guide-copy">
          <h2>{step.title}</h2>
          <p>{step.body}</p>
        </div>

        <p className="lj-guide-hint">
          You can use the highlighted area while this guide is open.
        </p>

        <div
          className="lj-guide-progress"
          style={progressStyle}
          aria-hidden="true"
        >
          {steps.map((candidate, candidateIndex) => (
            <span
              key={candidate.id}
              data-active={candidateIndex <= index}
            />
          ))}
        </div>

        <footer className="lj-guide-actions">
          <button type="button" onClick={onComplete}>
            Close
          </button>

          <div>
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex((current) => Math.max(0, current - 1))}
            >
              Back
            </button>
            <button
              type="button"
              data-primary="true"
              onClick={() => {
                if (last) onComplete();
                else setIndex((current) => Math.min(steps.length - 1, current + 1));
              }}
            >
              {last ? "Done" : "Next"}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
