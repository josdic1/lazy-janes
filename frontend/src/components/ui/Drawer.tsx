import type { ReactNode } from "react";

type DrawerProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  ariaLabel: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  description?: ReactNode;
  className?: string;
  headerClassName?: string;
  headerAction?: ReactNode;
};

export function Drawer({
  eyebrow,
  title,
  ariaLabel,
  onClose,
  children,
  wide = false,
  description,
  className,
  headerClassName,
  headerAction,
}: DrawerProps) {
  return (
    <>
      <button
        type="button"
        className="drawer-backdrop"
        aria-label="Close"
        onClick={onClose}
      />

      <aside
        className={`drawer${wide ? " drawer--wide" : ""}${className ? ` ${className}` : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        <header className={`drawer-header${headerClassName ? ` ${headerClassName}` : ""}`}>
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>

          {headerAction ?? (
            <button
              type="button"
              className="icon-button"
              aria-label="Close"
              onClick={onClose}
            >
              <span aria-hidden="true">×</span>
            </button>
          )}
        </header>

        {children}
      </aside>
    </>
  );
}
