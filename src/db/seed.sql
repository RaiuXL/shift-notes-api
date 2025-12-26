USE shift_notes;

INSERT INTO residents (full_name, room_number)
VALUES
  ("Miles Avery", 101),
  ("Harper Lane", 202),
  ("Jordan Patel", 303);

INSERT INTO notes (resident_id, note_type, shift, author_name, category, body)
VALUES
  (1, "resident", "AM", "Nathan Ramirez", "Alert Chart", "Resident was up early and assisted with breakfast without any incident."),
  (2, "resident", "PM", "Nate Tapia", "Progress Note", "Administered evening medication; resident tolerated it well with no complaints.");

INSERT INTO notes (resident_id, note_type, shift, author_name, category, body)
VALUES
  (NULL, "staff", "PM", "Natedog Bowow", "OOF residents", "A couple residents are going to be leaving for the holidays with their families, take note!");

