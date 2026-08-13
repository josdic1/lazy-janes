import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Can } from "../components/shared/Can";

export function HomePage() {
  return (
    <main className="page operations-page">
      <header className="operations-heading">
        <div>
          <p className="eyebrow">
            Lazy Jane’s / Operations
          </p>

          <h1>Operations</h1>
        </div>

        <p className="operations-intro">
          Live diner overview and management.
        </p>
      </header>

      <Can roles={["manager", "admin"]}>
        <section
          className="operations-section"
          aria-labelledby="management-heading"
        >
          <header className="operations-section-heading">
            <p className="eyebrow">01</p>
            <h2 id="management-heading">Management</h2>
          </header>

          <Link
            className="operations-row"
            to="/menu"
          >
            <div className="operations-row-number">
              01
            </div>

            <div className="operations-row-main">
              <strong>Menu Management</strong>
              <span>
                Items, modifiers, availability,
                specials, and pricing.
              </span>
            </div>

            <span className="operations-row-action">
              Open
              <ArrowRight aria-hidden="true" />
            </span>
          </Link>
        </section>
      </Can>
    </main>
  );
}
