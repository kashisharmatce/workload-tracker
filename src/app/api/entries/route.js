const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = { ...formData };
  if (!isEditing) delete payload.id;

  const res = await fetch("/api/entries", {
    method: isEditing ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const savedEntry = await res.json();

  if (!isEditing) {
    setEntries([...entries, savedEntry]); // Add to state immediately
  } else {
    setEntries(entries.map(e => (e._id === savedEntry._id ? savedEntry : e)));
  }

  setFormData({
    id: "",
    facilitator_id: "",
    week_start: "",
    contact_hours: "",
    non_contact_activities: [],
    comments: "",
  });

  setIsEditing(false);
};
