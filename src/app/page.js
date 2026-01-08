"use client";

import { useEffect, useState } from "react";
import '../styles/dashboard.css'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [facilitators, setFacilitators] = useState([]);
  const [entries, setEntries] = useState([]);
  const [month, setMonth] = useState("2026-01");
  const [selectedFacilitator, setSelectedFacilitator] = useState("ALL");

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetch("/api/facilitators").then(r => r.json()).then(setFacilitators);
    fetch("/api/entries").then(r => r.json()).then(setEntries);
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredEntries = entries.filter(e => {
    const sameMonth = e.week_start.startsWith(month);
    const sameFac =
      selectedFacilitator === "ALL" || e.facilitator_id === selectedFacilitator;
    return sameMonth && sameFac;
  });

  /* ---------------- SESSION HOURS ---------------- */
  const sessionChartData = facilitators.map(f => {
    const fEntries = filteredEntries.filter(e => e.facilitator_id === f._id);

    const assigned = fEntries
      .filter(e => e.non_contact_category === "Assigned Contact Hours")
      .reduce((s, e) => s + Number(e.contact_hours || 0), 0);

    const regular = fEntries.reduce(
      (s, e) => s + Number(e.contact_hours || 0),
      0
    );

    return { name: f.name, assigned, regular };
  });

  /* ---------------- NON SESSION ---------------- */
  const nonSessionData = facilitators.map(f => {
    const fEntries = filteredEntries.filter(e => e.facilitator_id === f._id);

    const nonContact = fEntries.reduce(
      (s, e) => s + Number(e.non_contact_hours || 0),
      0
    );

    const assignedNC = fEntries
      .filter(e => e.non_contact_category === "Assigned Non Contact Hours")
      .reduce((s, e) => s + Number(e.non_contact_hours || 0), 0);

    return {
      name: f.name,
      nonContact,
      pending: Math.max(assignedNC - nonContact, 0),
    };
  });

  /* ---------------- TASK BREAKDOWN ---------------- */
  const taskBreakdown = facilitators.map(f => {
    const obj = { name: f.name };
    filteredEntries
      .filter(e => e.facilitator_id === f._id)
      .forEach(e => {
        obj[e.non_contact_category] =
          (obj[e.non_contact_category] || 0) + Number(e.non_contact_hours || 0);
      });
    return obj;
  });

  /* ---------------- TABLE DATA ---------------- */
  const projects = filteredEntries.filter(
    e => e.non_contact_category === "Project"
  );
  const events = filteredEntries.filter(
    e => e.non_contact_category === "Event"
  );

  return (
    <div style={styles.page}>
      <h2>Facilitator Workload Tracker</h2>
      <p>Monthly Dashboard</p>

      {/* FILTERS */}
      <div style={styles.filters}>
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
        />
        <select onChange={e => setSelectedFacilitator(e.target.value)}>
          <option value="ALL">Admin – All Facilitators</option>
          {facilitators.map(f => (
            <option key={f._id} value={f._id}>{f.name}</option>
          ))}
        </select>
      </div>

      {/* TOP GRID */}
      <div style={styles.gridTop}>
        <div style={styles.card}>
          <h4>Weekly Session Hours View</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sessionChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="assigned" fill="#312e81" />
              <Bar dataKey="regular" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.card}>
          <h4>Projects</h4>
          <ProjectsTable rows={projects} facilitators={facilitators} />

          <h4 style={{ marginTop: 20 }}>Events</h4>
          <EventsTable rows={events} facilitators={facilitators} />
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div style={styles.gridBottom}>
        <div style={styles.card}>
          <h4>Weekly Non Session Hours View</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={nonSessionData} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="nonContact" stackId="a" fill="#e11d48" />
              <Bar dataKey="pending" stackId="a" fill="#5b21b6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.card}>
          <h4>Non Session Hours Task Time Overview</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={taskBreakdown} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Assignment Evaluation" stackId="a" fill="#1d4ed8" />
              <Bar dataKey="Class Prep" stackId="a" fill="#f97316" />
              <Bar dataKey="Class Recording" stackId="a" fill="#7c3aed" />
              <Bar dataKey="Curriculum Design" stackId="a" fill="#ec4899" />
              <Bar dataKey="LMS Update" stackId="a" fill="#6366f1" />
              <Bar dataKey="Milestone" stackId="a" fill="#eab308" />
              <Bar dataKey="Quiz" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ---------------- PROJECTS TABLE ---------------- */
function ProjectsTable({ rows, facilitators }) {
  return (
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>Facilitator</th>
          <th>Hours</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => {
          const f = facilitators.find(x => x._id === r.facilitator_id);
          return (
            <tr key={r._id}>
              <td>{f?.name}</td>
              <td>{r.non_contact_hours}</td>
              <td>{r.comments || "-"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ---------------- EVENTS TABLE ---------------- */
function EventsTable({ rows, facilitators }) {
  return (
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>Facilitator</th>
          <th>Days</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => {
          const f = facilitators.find(x => x._id === r.facilitator_id);
          return (
            <tr key={r._id}>
              <td>{f?.name}</td>
              <td>{r.non_contact_hours}</td>
              <td>{r.comments || "-"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  page: { padding: 20, background: "#f8fafc" },
  filters: { display: "flex", gap: 12, marginBottom: 16 },
  gridTop: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 },
  gridBottom: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    padding: 12,
  },
};
