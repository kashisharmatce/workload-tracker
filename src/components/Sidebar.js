"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  pathname.startsWith("/data-entry")


  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>Tracker</h2>
      </div>

      <nav className="nav">
        <a
          href="/data-entry"
          className={`navItem ${pathname.startsWith("/data-entry") ? "active" : ""}`}

        >
          Data Entry
        </a>

        <a
          href="/"
          className={`navItem ${pathname === "/" ? "active" : ""}`}
        >
          Dashboard
        </a>
      </nav>
    </aside>
  );
}

