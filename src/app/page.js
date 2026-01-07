"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* -------------------- DUMMY DATA -------------------- */

const weeklyContactData = [
  { name: "Kashi Sharma", assigned: 10, utilized: 10 },
  { name: "K B Chandrasekaran", assigned: 8, utilized: 7 },
  { name: "Rushikesh Rajuwar", assigned: 4, utilized: 4 },
  { name: "Srinivas Naik", assigned: 2, utilized: 2 },
  { name: "Vineeth Rai", assigned: 2, utilized: 2 },
];

const nonSessionData = [
  { name: "Kashi Sharma", nonContact: 37, pending: 1 },
  { name: "Rushikesh Rajuwar", nonContact: 19, pending: 25 },
  { name: "Srinivas Naik", nonContact: 24, pending: 18 },
  { name: "Vineeth Rai", nonContact: 15, pending: 13 },
];

const nonSessionBreakdown = [
  {
    name: "Kashi Sharma",
    Curriculum: 24,
    LMS: 4,
    Quiz: 3,
    Documentation: 3,
    Milestone: 1,
  },
  {
    name: "Rushikesh Rajuwar",
    Assignment: 9,
    ClassPrep: 6,
    Recording: 4,
  },
];

const projectTable = [
  { facilitator: "Akshay Kumar U", project: "Gig", hours: 16 },
  { facilitator: "K B Chandrasekaran", project: "PCB Board Design", hours: 8 },
  { facilitator: "Vineeth Rai", project: "PCB Board Design", hours: 18 },
];

const eventTable = [
  { facilitator: "Akhiljith Gigi", event: "ROSCON", days: 40 },
  { facilitator: "Pulkit Garg", event: "ROSCON", days: 40 },
];

/* -------------------- PAGE -------------------- */

export default function DashboardPage() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Facilitator Workload Tracker</h1>
      <p style={styles.subtitle}>Weekly Dashboard • 1st January 2026</p>

      {/* WEEKLY CONTACT HOURS */}
      <div style={styles.card}>
        <h3>Weekly Session Hours</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyContactData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="assigned" fill="#aaa6fcff" name="Assigned Contact Hours" />
            <Bar dataKey="utilized" fill="#f88ac1ff" name="Utilized Contact Hours" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.grid}>
        {/* NON SESSION HOURS */}
        <div style={styles.card}>
          <h3>Weekly Non-Session Hours</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={nonSessionData} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="nonContact" stackId="a" fill="#f1657dff" name="Non-Contact Hours" />
              <Bar dataKey="pending" stackId="a" fill="#c8a9feff" name="Pending Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* NON SESSION BREAKDOWN */}
        <div style={styles.card}>
          <h3>Non-Session Task Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={nonSessionBreakdown}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Curriculum" stackId="a" fill="#f8aed3ff" />
              <Bar dataKey="Assignment" stackId="a" fill="#7ba8efff" />
              <Bar dataKey="ClassPrep" stackId="a" fill="#fcac73ff" />
              <Bar dataKey="Recording" stackId="a" fill="#7c3aed" />
              <Bar dataKey="LMS" stackId="a" fill="#6366f1" />
              <Bar dataKey="Quiz" stackId="a" fill="#f9e199ff" />
              <Bar dataKey="Documentation" stackId="a" fill="#ef4444" />
              <Bar dataKey="Milestone" stackId="a" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLES */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Projects Overview</h3>
          <Table
            headers={["Facilitator", "Project", "Hours"]}
            rows={projectTable.map((p) => [
              p.facilitator,
              p.project,
              p.hours,
            ])}
          />
        </div>

        <div style={styles.card}>
          <h3>Events Overview</h3>
          <Table
            headers={["Facilitator", "Event", "Days"]}
            rows={eventTable.map((e) => [
              e.facilitator,
              e.event,
              e.days,
            ])}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------- TABLE COMPONENT -------------------- */

function Table({ headers, rows }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* -------------------- STYLES -------------------- */

const styles = {
  page: {
    padding: "24px",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
  },
  subtitle: {
    color: "#64748b",
    marginBottom: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};
