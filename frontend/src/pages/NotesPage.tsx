import { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useNotesContext } from '../context/NotesContext';

import { CreateNote } from '../components/CreateNote';
import { SearchNotes } from '../components/SearchNotes';
import { NotesList } from '../components/NotesList';

export const NotesPage = () => {
  const {
    notes,
    loading,
    error,
    fetchNotes,
  } = useNotesContext();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Notes
      </Typography>

      <CreateNote />
      <SearchNotes />
      <NotesList notes={notes} loading={loading} error={error} />
    </Container>
  );
};
