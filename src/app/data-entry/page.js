"use client";
import React, { useState, useEffect, useRef } from "react";
import '../../styles/globals.css'


export default function DataEntry() {
  const [facilitators, setFacilitators] = useState([]);
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    facilitator_id: "",
    week_start: "",
    contact_hours: "",
    non_contact_category: "",
    non_contact_hours: "",
    comments: "",
  });
  const [newFacilitator, setNewFacilitator] = useState(""); // New facilitator name
  const [isEditing, setIsEditing] = useState(false);
  const firstInputRef = useRef(null);

  const nonContactOptions = [
    "Regular Session",
    "Stretch Session",
    "Curriculum Design",
    "Assignment Evaluation",
    "Project",
    "Non Session",
    "Class Recording",
    "Class Prep",
    "LMS Update",
    "Quiz",
    "Documentation",
    "Milestone",
    "Leave",
    "Event",
    "Assigned Contact Hours",
    "Assigned Non Contact Hours",
    "Weekly Off",
    "Holiday",
    "Upskill",
  ];

  // Fetch facilitators and entries on page load
  useEffect(() => {
    fetchFacilitators();
    fetchEntries();
  }, []);

  // ----- FACILITATORS -----
  const fetchFacilitators = async () => {
    try {
      const res = await fetch("/api/facilitators");
      const data = await res.json();
      setFacilitators(data);
    } catch (err) {
      console.error("Error fetching facilitators:", err);
    }
  };

  const handleAddFacilitator = async (e) => {
    e.preventDefault();
    if (!newFacilitator) return;

    try {
      await fetch("/api/facilitators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFacilitator }),
      });
      setNewFacilitator("");
      fetchFacilitators(); // Refresh the dropdown
    } catch (err) {
      console.error("Error adding facilitator:", err);
    }
  };

  // ----- WEEKLY ENTRIES -----
  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/entries");
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error("Error fetching entries:", err);
    }
  };

  const handleEntryChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitEntry = async (e) => {
    e.preventDefault();

    const payload = { ...formData };
    if (!isEditing) delete payload.id; // Only for new entries

    try {
      await fetch("/api/entries", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setFormData({
        id: "",
        facilitator_id: "",
        week_start: "",
        contact_hours: "",
        non_contact_category: "",
        non_contact_hours: "",
        comments: "",
      });
      setIsEditing(false);
      fetchEntries(); // Refresh table
    } catch (err) {
      console.error("Error saving entry:", err);
    }
  };

  const handleEditEntry = (entry) => {
    setFormData({ ...entry, id: entry._id });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteEntry = async (id) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await fetch(`/api/entries?id=${id}`, { method: "DELETE" });
      fetchEntries();
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  return (
    <div className="data-entry-container">

      {/* ----- ADD FACILITATOR ----- */}
      <div className="facilitator-form-card">
        <h2>Add Facilitator</h2>
        <form className="data-entry-form" onSubmit={handleAddFacilitator}>
          <input
            type="text"
            placeholder="Facilitator Name"
            value={newFacilitator}
            onChange={(e) => setNewFacilitator(e.target.value)}
            required
          />
          <button type="submit">Add Facilitator</button>
        </form>
      </div>

      {/* ----- ADD / EDIT ENTRY ----- */}
      <div className="data-entry-form-card">
        <h2>{isEditing ? "Edit Entry" : "Add Weekly Entry"}</h2>
       <form className="data-entry-form" onSubmit={handleSubmitEntry}>
          <select
            name="facilitator_id"
            value={formData.facilitator_id}
            onChange={handleEntryChange}
            ref={firstInputRef}
            required
          >
            <option value="">Select Facilitator</option>
            {facilitators.map((f) => (
              <option key={f._id} value={f._id}>{f.name}</option>
            ))}
          </select>

          <input
            type="date"
            name="week_start"
            value={formData.week_start}
            onChange={handleEntryChange}
            required
          />
          <input
            type="number"
            name="contact_hours"
            value={formData.contact_hours}
            onChange={handleEntryChange}
            placeholder="Contact Hours"
            required
          />
          <select
            name="non_contact_category"
            value={formData.non_contact_category}
            onChange={handleEntryChange}
            required
          >
            <option value="">Non-Contact Category</option>
            {nonContactOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <input
            type="number"
            name="non_contact_hours"
            value={formData.non_contact_hours}
            onChange={handleEntryChange}
            placeholder="Non-Contact Hours"
            required
          />
          <input
            type="text"
            name="comments"
            value={formData.comments}
            onChange={handleEntryChange}
            placeholder="Comments"
          />
          <button type="submit">{isEditing ? "Update" : "Add"}</button>
        </form>
      </div>

      {/* ----- ENTRIES TABLE ----- */}
      <div className="data-entry-table-card">
        <table className="data-entry-table">
          <thead>
            <tr>
              <th>Facilitator</th>
              <th>Week Start</th>
              <th>Contact Hours</th>
              <th>Non-Contact</th>
              <th>Non-Contact Hours</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => {
              const facilitator = facilitators.find((f) => f._id === e.facilitator_id);
              return (
                <tr key={e._id}>
                  <td>{facilitator ? facilitator.name : "Unknown"}</td>
                  <td>{new Date(e.week_start).toISOString().split("T")[0]}</td>
                  <td>{e.contact_hours}</td>
                  <td>{e.non_contact_category}</td>
                  <td>{e.non_contact_hours}</td>
                  <td>{e.comments}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleEditEntry(e)}>Edit</button>
                    <button onClick={() => handleDeleteEntry(e._id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
