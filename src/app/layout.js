import "../styles/globals.css";
import Sidebar from "../components/Sidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ display: "flex", margin: 0, fontFamily: "Arial, sans-serif" }}>
        <Sidebar />

        <div style={{ flex: 1 }}>
          {/* <header style={{ padding: "1rem", background: "#1976d2", color: "white" }}> */}
            {/* <h1>Facilitator Workload Tracker</h1> */}
          {/* </header> */}

          <main style={{ padding: "1rem" }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
