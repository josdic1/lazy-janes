import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main>
      <header>
        <p>Lazy Jane’s Diner</p>
        <h1>Operations</h1>
        <p>The live diner overview will appear here.</p>
      </header>

      <section>
        <h2>Management</h2>
        <Link to="/menu">Open Menu Management</Link>
      </section>
    </main>
  );
}
