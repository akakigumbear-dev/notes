import { Typography, List, ListItem, ListItemText } from '@mui/material';
import type { Note } from '../types/types';

export const NotesList = ({
  notes,
  loading,
  error,
}: {
  notes: Note[];
  loading: boolean;
  error: string | null;
}) => {
  if (loading) return <Typography>Loading…</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!notes.length) return <Typography>No notes found</Typography>;

  return (
    <List>
      {notes.map(n => (
        <ListItem key={n.id}>
          <ListItemText primary={n.title} secondary={n.text} />
        </ListItem>
      ))}
    </List>
  );
};
