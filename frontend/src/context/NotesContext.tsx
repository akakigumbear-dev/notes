import {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
} from 'react';
import type { Note } from '../types/types';
import { notesApi } from '../api/notes.api';

/* =======================
   Types
======================= */

interface NotesContextValue {
  notes: Note[];
  loading: boolean;
  error: string | null;

  query: string;
  setQuery: (q: string) => void;

  fetchNotes: (q?: string) => Promise<void>;
  createNote: (title: string, text: string) => Promise<void>;
  updateNote: (id: number, title: string, text: string) => Promise<void>;
}

/* =======================
   Context
======================= */

const NotesContext = createContext<NotesContextValue | null>(null);

/* =======================
   Provider
======================= */

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔑 search state
  const [query, setQuery] = useState('');

  // ბოლო გამოყენებული query (race-condition protection)
  const lastQueryRef = useRef<string>('');

  const fetchNotes = useCallback(
    async (q?: string) => {
      const search = q ?? query;
      lastQueryRef.current = search;

      setLoading(true);
      setError(null);

      try {
        const res = await notesApi.getAll(search || undefined);

        if (!res.data.success) {
          throw new Error(res.data.message);
        }

        // ❗ outdated response protection
        if (lastQueryRef.current === search) {
          setNotes(res.data.data);
        }
      } catch {
        setError('Failed to load notes');
        setNotes([]);
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  const createNote = useCallback(
    async (title: string, text: string) => {
      await notesApi.create(title, text);
      await fetchNotes(); // respects current query
    },
    [fetchNotes]
  );

  const updateNote = useCallback(
    async (id: number, title: string, text: string) => {
      await notesApi.update(id, title, text);
      await fetchNotes(); // respects current query
    },
    [fetchNotes]
  );

  const value: NotesContextValue = {
    notes,
    loading,
    error,

    query,
    setQuery,

    fetchNotes,
    createNote,
    updateNote,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

/* =======================
   Hook
======================= */

export const useNotesContext = (): NotesContextValue => {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error('useNotesContext must be used inside NotesProvider');
  }
  return ctx;
};
