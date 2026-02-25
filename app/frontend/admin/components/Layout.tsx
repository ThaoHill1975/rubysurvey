import React from "react";
import { api } from "../../lib/api";
import "./Layout.scss";

interface LayoutProps {
  currentUser: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentUser, children }) => {
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await api.delete("/admin/sign_out");
    } catch {
      // Devise may redirect with HTML, which is fine
    }
    window.location.href = "/admin/sign_in";
  };

  return (
    <div className="admin-layout">
      <nav className="admin-layout__nav">
        <div className="admin-layout__nav-brand">
          <a href="/admin">
            <img src="/images/procurated-logo.png" alt="Procurated" className="admin-layout__logo" />
          </a>
        </div>
        <div className="admin-layout__nav-links">
          <a href="/admin">Dashboard</a>
          <a href="/admin/surveys">Surveys</a>
        </div>
        <div className="admin-layout__nav-user">
          <span>{currentUser}</span>
          <a href="#" onClick={handleSignOut}>Sign Out</a>
        </div>
      </nav>
      <main className="admin-layout__main">
        {children}
      </main>
    </div>
  );
};

export default Layout;
