import { NotesProvider } from './context/NotesContext';
import { NotesPage } from './pages/NotesPage';

export default function App() {
  return (
    <NotesProvider>
      <NotesPage />
    </NotesProvider>
  );
}
