import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type WalkthroughProps = {
  open: boolean;
  userId: string;
  roles: readonly string[];
  onComplete: () => void;
};

type WalkthroughStep = {
  route: string;
  label: string;
  title: string;
  body: string;
  roles: readonly string[];
};

const ALL_STEPS: readonly WalkthroughStep[] = [
  {
    route: "/pos",
    label: "POS",
    title: "The restaurant lives here",
    body: "Use the floor to manage arrivals, waitlist, seating, table status, checks, and payment without leaving the live restaurant view.",
    roles: ["host", "server", "lead_server", "manager", "admin"],
  },
  {
    route: "/orders/new",
    label: "Order Entry",
    title: "Take the order",
    body: "Order Entry works from parties already seated in POS. Build the food, apply allowed customizations, then send it to the kitchen.",
    roles: ["server", "lead_server", "manager", "admin"],
  },
  {
    route: "/kitchen",
    label: "Kitchen",
    title: "Run food execution",
    body: "Kitchen owns fired food. Move items through preparation and ready status here while the POS floor reflects the live result.",
    roles: ["chef", "head_chef", "manager", "admin"],
  },
  {
    route: "/operations",
    label: "Operations",
    title: "Manager controls stay separate",
    body: "Operations is for shift controls, cash drawer, completed activity, and floor configuration—not live table service.",
    roles: ["manager", "admin"],
  },
];

export function Walkthrough({
  open,
  userId,
  roles,
  onComplete,
}: WalkthroughProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const steps = useMemo(
    () => ALL_STEPS.filter((step) => step.roles.some((role) => roles.includes(role))),
    [roles],
  );

  useEffect(() => {
    if (open) setIndex(0);
  }, [open, userId]);

  const step = steps[index] ?? steps[0] ?? null;

  useEffect(() => {
    if (!open || !step) return;

    navigate(step.route);

    const selector = `.app-nav a[href="${step.route}"]`;
    const target = document.querySelector<HTMLElement>(selector);
    target?.setAttribute("data-walkthrough-highlight", "true");

    return () => {
      target?.removeAttribute("data-walkthrough-highlight");
    };
  }, [navigate, open, step]);

  if (!open || !step || steps.length === 0) return null;

  const last = index === steps.length - 1;

  return (
    <div className="walkthrough-layer" role="presentation">
      <div className="walkthrough-scrim" />
      <section
        className="walkthrough-card"
        role="dialog"
        aria-modal="true"
        aria-label="Lazy Jane’s walkthrough"
      >
        <header className="walkthrough-header">
          <img src="/lazy-janes-logo.svg" alt="" aria-hidden="true" />
          <div>
            <span>{index + 1} of {steps.length}</span>
            <strong>{step.label}</strong>
          </div>
        </header>

        <div className="walkthrough-copy">
          <h2>{step.title}</h2>
          <p>{step.body}</p>
        </div>

        <div className="walkthrough-progress" aria-hidden="true">
          {steps.map((candidate, candidateIndex) => (
            <span
              key={candidate.route}
              data-active={candidateIndex <= index}
            />
          ))}
        </div>

        <footer className="walkthrough-actions">
          <button type="button" data-variant="quiet" onClick={onComplete}>
            Skip
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
              data-variant="primary"
              onClick={() => {
                if (last) onComplete();
                else setIndex((current) => Math.min(steps.length - 1, current + 1));
              }}
            >
              {last ? "Finish" : "Next"}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
