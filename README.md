# Shift Notes App 📝
Small CRUD app for documenting resident and staff shift notes.
A simple web app for caregivers to log and review shift notes without a full EHR system.


## 1. Project Overview

### Project Name & Tagline
**Shift Notes App**  
*A lightweight notes system for caregivers and shift leads.*

### Problem Statement
In many assisted living and healthcare settings, caregivers record shift information in paper logs, sticky notes, or clunky EHR comment fields.  

This can lead to:

- Inconsistent documentation quality  
- Notes being hard to find or filter  
- Poor shift handoff between staff  
- Important observations getting buried or lost  

The **Shift Notes App** provides a focused, simple web interface for recording and reviewing shift notes. It does **not** try to be a full EHR, but instead aims to improve day to day communication and documentation for frontline staff.

### Target Users
- **Caregivers / CNAs / Med Techs**  
  - Recording resident behavior, incidents, and shift details.
- **Shift Leads / Supervisors / Nurses**  
  - Reviewing notes quickly at shift change.
- **Administrators**  
  - Spot-checking documentation quality and trends over time.


## 2. Feature Breakdown

### MVP Features

**Core Theme:** CRUD for notes.

1. **Resident Shift Notes**
   - Create a note linked to a resident.
   - Fields: resident name, shift (AM/PM/NOC), note category/type, author (free-text), body, created timestamp.
   - View list of notes (most recent first).
   - Edit an existing note (correct errors, add details).
   - Soft delete / archive a note.

2. **Staff Shift Logs**
   - Create a log entry not tied to a specific resident  
     (e.g., building issues, staffing notes, general shift observations).
   - Same basic structure as resident notes but with `resident` optional.
   - View list of staff logs.

3. **Basic Filtering / Listing**
   - View “All Notes”.
   - Toggle between “Resident Notes” and “Staff Shift Logs”.

4. **Architecture**
   - **Backend:** Node.js + Express REST API.
   - **Database:** MySQL (notes and residents tables).
   - **Frontend:** React SPA consuming the API (forms + tables/views).


### Extended Features (Later Phases)

These are planned enhancements beyond the initial CRUD MVP:

1. **Search / Filter**
   - Filter by date range.
   - Filter by shift (AM/PM/NOC).
   - Filter by resident.
   - Free-text search in note body.

2. **Categories / Tags**
   - Tag notes (e.g., *Behavior*, *Medication*, *Family*, *Incident*).
   - Filter by tag.

3. **Edit History / “Last Updated By”**
   - Track who last edited a note and when.
   - Show edit history (audit trail) per note.

4. **Export**
   - Export filtered notes to **CSV** (and later PDF) for audits or reporting.

5. **Dashboard Summary**
   - Simple dashboard view:
     - Notes per day.
     - Notes per shift.
     - Notes per resident.
   - High-level trend visualization.

6. **Resident Profiles (EHR-lite)**
   - Lightweight resident profile pages with:
     - Name, room number, basic details.
     - List of recent notes for that resident.

7. **File / Image Attachments**
   - Attach images or files to a note (e.g., photo of damage, document).

8. **Dark Mode UI**
   - Toggle between light and dark themes in the React frontend.


## 3. Data Model Planning

### Core Entities

#### 1. `Resident`
Represents a person living in the facility.

- `id` (PK)
- `full_name` (VARCHAR 100)
- `room_number` (INT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### 2. `Note`
Represents both resident notes and generic staff shift logs.  
Using a single table keeps the model simple and flexible.

- `id` (PK)
- `resident_id` ( (INT) FK → `Resident.id`, (NULL) nullable for generic staff logs)
- `note_type` ( (ENUM) `resident`, `staff` )
- `shift` ( (ENUM) `AM`, `PM`, `NOC`)
- `author_name` (VARCHAR 100)
- `category` (VARCHAR 100)
- `body` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

> **Reasoning:** using a single `Note` entity with an optional `resident_id` avoids duplicating tables and keeps CRUD logic consistent.


### Key Relationships

- **Resident → Notes**
  - 1 **Resident** can have **many** `Note` records.  
  - A `Note` may or may not be linked to a `Resident` (null `resident_id` for generic staff logs).

There are no user accounts in the MVP, so “author” is stored as a string (`author_name`) instead of a foreign key to a `User` table.


### CRUD Operations

#### Residents
- **Create**: Add new residents to the system.
- **Read**:
  - List all residents.
  - View a single resident and their recent notes.
- **Update**: Edit resident information.
- **Delete**: (Optional) Soft delete or mark resident as inactive.

> MVP may start with seed/hard-coded residents and add full CRUD later.

#### Notes
- **Create**
  - Create a resident note (with `resident_id`).
  - Create a staff shift log (without `resident_id`).
- **Read**
  - List all notes.
  - Filter by type (resident vs staff).
  - View details for a single note.
- **Update**
  - Edit the text, category, shift, or resident link of a note.
  - Update `updated_at` (and later `last_updated_by`).
- **Delete**
  - Soft delete or archive a note (recommended over hard delete).


## 4. User Experience

### User Flows (MVP)

#### 4.1 Create a Resident Shift Note
1. User opens the app and lands on **Notes** page.
2. Clicks **“New Note”**.
3. Chooses **“Resident Note”**.
4. Selects a **resident** from a dropdown.
5. Selects a **shift** (AM/PM/NOC).
6. Optionally selects a **category** (Behavior, Medication, etc.).
7. Enters **author name** and **note body**.
8. Clicks **Save**.
9. The note is saved via the API and appears at the top of the notes list.

#### 4.2 Create a Generic Staff Shift Log
1. From the same **New Note** button, choose **“Staff Shift Log”**.
2. Skip resident selection (or select “No resident / General”).
3. Select **shift**.
4. Enter **author name** and **log text**.
5. Click **Save**.
6. The entry is saved and listed under the **Staff Logs** filter.

#### 4.3 View All Notes
1. User opens **Notes** page.
2. Default view shows most recent notes first.
3. User can toggle:
   - **All**
   - **Resident Notes**
   - **Staff Logs**

#### 4.4 Edit an Existing Note
1. On the notes list, user clicks an **Edit** button for a note.
2. Form opens pre-filled with current values.
3. User updates the text or metadata.
4. Clicks **Save**.
5. API updates the note and refreshes the list.

#### 4.5 (Future) Filter / Search Notes
1. User opens filter panel.
2. Sets date range, shift, resident, tag, or search text.
3. Clicks **Apply Filters**.
4. Notes list updates to show matching records only.


## 5. Technical Stack & Architecture

- **Backend**
  - Node.js
  - Express
  - MySQL (using a Node.js MySQL driver or ORM)
  - RESTful API: `/api/notes`, `/api/residents`, etc.

- **Frontend**
  - React SPA
  - Fetches data from the Node.js API
  - Components for forms, tables, filters, and dashboards
  - (Later) Dark mode support

- **Testing & DevOps (Planned)**
  - Unit and integration tests (e.g., Jest + Supertest)
  - Dockerization of backend and database
  - CI/CD pipeline using GitHub Actions


## 6. Project Setup (Backend – WIP)

> This section will evolve as the project grows.

```bash
# install dependencies
npm install

# run development server
npm run dev

# server runs on
http://localhost:3000