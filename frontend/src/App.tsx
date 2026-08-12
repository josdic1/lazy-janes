import { NavLink, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MenuManagementPage } from "./pages/MenuManagementPage";

export function App() {
  return (
    <>
      <header>
        <NavLink to="/">Lazy Jane’s</NavLink>

        <nav aria-label="Primary navigation">
          <NavLink to="/" end>
            Operations
          </NavLink>

          <NavLink to="/menu">
            Menu Management
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuManagementPage />} />
      </Routes>
    </>
  );
}
