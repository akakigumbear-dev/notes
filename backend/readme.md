
---

## Application Features

- Create a note with title and text
- Update an existing note
- Display all saved notes
- Search notes by title or text
- Case-insensitive search
- Persistent storage using SQLite

---

## API Endpoints

| Method | Endpoint        | Description                                  |
|------|-----------------|----------------------------------------------|
| POST | `/notes`        | Create a new note                            |
| GET  | `/notes`        | Get all notes                                |
| GET  | `/notes?q=...`  | Search notes by title or text (case-insensitive) |
| PUT  | `/notes/:id`    | Update an existing note                     |

---

## How to Run the Project (Local)

### Prerequisites
- Node.js **v18+**
- npm

---

### Backend Setup

```bash
cd backend
npm install
npm run build
npm run start
