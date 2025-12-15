import { Router, Response } from 'express';
import { TypedRequest } from '../types/http';
import { Note } from '../types/note';
import {
  CreateNoteDto,
  UpdateNoteDto,
  NoteIdParam,
} from '../types/note.dto';
import { ApiResponse } from '../types/api';
import { getAll, getOne, execute } from '../db/helpers';

const router = Router();

/**
 * CREATE
 */
router.post(
  '/',
  (req: TypedRequest<{}, CreateNoteDto>, res: Response) => {
    try {
      const title = req.body.title?.trim();
      const text = req.body.text?.trim();

      if (!title || !text) {
        res.status(400).json({
          success: false,
          message: 'Title and text are required',
        } satisfies ApiResponse<never>);
        return;
      }

      const insertResult = execute(
        'INSERT INTO notes (title, text) VALUES (?, ?)',
        [title, text]
      );

      const id = Number(insertResult.lastInsertRowid);

      const note = getOne<Note>(
        'SELECT * FROM notes WHERE id = ?',
        [id]
      );

      if (!note) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch created note',
        } satisfies ApiResponse<never>);
        return;
      }

      res.status(201).json({
        success: true,
        data: note,
      } satisfies ApiResponse<Note>);
    } catch (err) {
      console.error('CREATE /notes failed:', err);

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      } satisfies ApiResponse<never>);
    }
  }
);


/**
 * READ ALL + SEARCH
 */
router.get(
  '/',
  (req: TypedRequest<{}, {}, { q?: string }>, res: Response) => {
    try {
      const q = req.query.q?.trim();

      const notes = q
        ? getAll<Note>(
            `SELECT * FROM notes
             WHERE title LIKE ? COLLATE NOCASE
                OR text  LIKE ? COLLATE NOCASE
             ORDER BY created_at DESC`,
            [`%${q}%`, `%${q}%`]
          )
        : getAll<Note>('SELECT * FROM notes ORDER BY created_at DESC');

      res.json({
        success: true,
        data: notes,
      } satisfies ApiResponse<Note[]>);
    } catch (err) {
      console.error('GET /notes failed:', err);

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      } satisfies ApiResponse<never>);
    }
  }
);

/**
 * READ ONE
 */
router.get(
  '/:id',
  (req: TypedRequest<NoteIdParam>, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid note id',
        } satisfies ApiResponse<never>);
        return;
      }

      const note = getOne<Note>('SELECT * FROM notes WHERE id = ?', [id]);

      if (!note) {
        res.status(404).json({
          success: false,
          message: 'Note not found',
        } satisfies ApiResponse<never>);
        return;
      }

      res.json({
        success: true,
        data: note,
      } satisfies ApiResponse<Note>);
    } catch (err) {
      console.error('GET /notes/:id failed:', err);

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      } satisfies ApiResponse<never>);
    }
  }
);

/**
 * UPDATE
 */
router.put(
  '/:id',
  (req: TypedRequest<NoteIdParam, UpdateNoteDto>, res: Response) => {
    try {
      const id = Number(req.params.id);
      const title = req.body.title?.trim();
      const text = req.body.text?.trim();

      if (!Number.isInteger(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid note id',
        } satisfies ApiResponse<never>);
        return;
      }

      if (!title || !text) {
        res.status(400).json({
          success: false,
          message: 'Title and text are required',
        } satisfies ApiResponse<never>);
        return;
      }

      const result = execute(
        'UPDATE notes SET title = ?, text = ? WHERE id = ?',
        [title, text, id]
      );

      if (result.changes === 0) {
        res.status(404).json({
          success: false,
          message: 'Note not found',
        } satisfies ApiResponse<never>);
        return;
      }

      const updated = getOne<Note>('SELECT * FROM notes WHERE id = ?', [id]);

      if (!updated) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch updated note',
        } satisfies ApiResponse<never>);
        return;
      }

      res.json({
        success: true,
        data: updated,
      } satisfies ApiResponse<Note>);
    } catch (err) {
      console.error('PUT /notes/:id failed:', err);

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      } satisfies ApiResponse<never>);
    }
  }
);


export default router;
