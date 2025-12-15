import { Paper, Stack, TextField, Typography } from '@mui/material';
import { useNotes } from '../hooks/useNotes';

export const SearchNotes = () => {
  const { query, setQuery } = useNotes();

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Search</Typography>

      <Stack direction="row" spacing={2} mt={2}>
        <TextField
          fullWidth
          label="Search in title or text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Stack>
    </Paper>
  );
};
