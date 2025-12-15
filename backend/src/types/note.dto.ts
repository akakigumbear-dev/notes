import { Note } from './note';

export type CreateNoteDto = Pick<Note, 'title' | 'text'>;

export type UpdateNoteDto = Partial<CreateNoteDto>;

export type NoteIdParam = {
  id: string;
};
