"use client";
import React, { useState, useEffect } from "react";
import "../../styles/globals.css";

export default function DataEntry() {
  const [facilitators, setFacilitators] = useState([]);
  const [entries, setEntries] = useState([]);
  const [newFacilitator, setNewFacilitator] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    facilitator_id: "",
    week_start: "",
    contact_hours: "",
    non_contact_activities: [],
    comments: "",
  });

  const [activity, setActivity] = useState({ category: "", hours: "" });

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

  useEffect(() => {
    fetchFacilitators();
    fetchEntries();
  }, []);

  // ----- FACILITATORS -----
  const fetchFacilitators = async () => {
    const res = await fetch("/api/facilitators");
    setFacilitators(await res.json());
  };

  const handleAddFacilitator = async (e) => {
    e.preventDefault();
    if (!newFacilitator) return;

    await fetch("/api/facilitators", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFacilitator }),
    });

    setNewFacilitator("");
    fetchFacilitators();
  };

  // ----- ENTRIES -----
  const fetchEntries = async () => {
    const res = await fetch("/api/entries");
    setEntries(await res.json());
  };

  const handleAddActivity = () => {
    if (!activity.category || !activity.hours) return;
    setFormData({
      ...formData,
      non_contact_activities: [...formData.non_contact_activities, activity],
    });
    setActivity({ category: "", hours: "" });
  };

  const handleRemoveActivity = (index) => {
    const updatedActivities = [...formData.non_contact_activities];
    updatedActivities.splice(index, 1);
    setFormData({ ...formData, non_contact_activities: updatedActivities });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.facilitator_id || !formData.week_start || !formData.contact_hours) {
      alert("Please fill all required fields");
      return;
    }

    const payload = { ...formData };
    if (!isEditing) delete payload.id;

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
      non_contact_activities: [],
      comments: "",
    });
    setIsEditing(false);
    fetchEntries();
  };

  const handleEdit = (entry) => {
    setFormData({
      ...entry,
      id: entry._id,
      non_contact_activities: entry.non_contact_activities || [],
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete entry?")) return;
    await fetch(`/api/entries?id=${id}`, { method: "DELETE" });
    fetchEntries();
  };

  return (
    <div className="data-entry-container">

      {/* ADD FACILITATOR */}
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

      {/* ADD / EDIT ENTRY */}
      <div className="data-entry-form-card">
        <h2>{isEditing ? "Edit Entry" : "Add Weekly Entry"}</h2>
        <form onSubmit={handleSubmit} className="data-entry-form">
          <select
            value={formData.facilitator_id}
            onChange={(e) =>
              setFormData({ ...formData, facilitator_id: e.target.value })
            }
            required
          >
            <option value="">Select Facilitator</option>
            {facilitators.map((f) => (
              <option key={f._id} value={f._id}>{f.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={formData.week_start}
            onChange={(e) =>
              setFormData({ ...formData, week_start: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Contact Hours"
            value={formData.contact_hours}
            onChange={(e) =>
              setFormData({ ...formData, contact_hours: e.target.value })
            }
            required
          />

          {/* NON-CONTACT ACTIVITIES */}
          <div className="non-contact-inputs">
            <select
              value={activity.category}
              onChange={(e) =>
                setActivity({ ...activity, category: e.target.value })
              }
            >
              <option value="">Non-Contact Category</option>
              {nonContactOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Hours"
              value={activity.hours}
              onChange={(e) =>
                setActivity({ ...activity, hours: e.target.value })
              }
            />
            <button type="button" onClick={handleAddActivity}>
              Add Category
            </button>
          </div>

          <ul className="activity-list">
            {formData.non_contact_activities.map((a, i) => (
              <li key={i}>
                {a.category} – {a.hours} hrs
                <button type="button" onClick={() => handleRemoveActivity(i)}>❌</button>
              </li>
            ))}
          </ul>

          <input
            placeholder="Comments"
            value={formData.comments}
            onChange={(e) =>
              setFormData({ ...formData, comments: e.target.value })
            }
          />

          <button type="submit">{isEditing ? "Update" : "Save"}</button>
        </form>
      </div>

      {/* TABLE */}
      <div className="data-entry-table-card">
        <table className="data-entry-table">
          <thead>
            <tr>
              <th>Facilitator</th>
              <th>Week</th>
              <th>Contact</th>
              <th>Non-Contact Activities</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const facilitatorName = facilitators.find(f => f._id === entry.facilitator_id)?.name || "Unknown";

              return (
                <tr key={entry._id}>
                  <td>{facilitatorName}</td>
                  <td>{new Date(entry.week_start).toISOString().split("T")[0]}</td>
                  <td>{entry.contact_hours}</td>
                  <td>
                    {entry.non_contact_activities?.length > 0 ? (
                      <details>
                        <summary>View ({entry.non_contact_activities.length})</summary>
                        <ul className="activity-list">
                          {entry.non_contact_activities.map((a, i) => (
                            <li key={i}>
                              {a.category} – {a.hours} hrs
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <span>No activities</span>
                    )}
                  </td>
                  <td>{entry.comments}</td>
                  <td>
                    <button onClick={() => handleEdit(entry)}>Edit</button>
                    <button onClick={() => handleDelete(entry._id)}>Delete</button>
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
