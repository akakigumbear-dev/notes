import { useMemo, useState } from 'react';
import { Paper, Stack, TextField, Button, Typography } from '@mui/material';
import { useNotes } from '../hooks/useNotes';

export const CreateNote = () => {
  const { createNote } = useNotes();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const canCreate = useMemo(
    () => title.trim() && text.trim(),
    [title, text]
  );

  const onSave = async () => {
    await createNote(title.trim(), text.trim());
    setTitle('');
    setText('');
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Create note</Typography>
      <Stack spacing={2} mt={2}>
        <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <TextField multiline minRows={3} label="Text" value={text} onChange={e => setText(e.target.value)} />
        <Button disabled={!canCreate} variant="contained" onClick={onSave}>
          Save
        </Button>
      </Stack>
    </Paper>
  );
};
