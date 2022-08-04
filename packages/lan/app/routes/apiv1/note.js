import express from 'express';
import asyncHandler from 'express-async-handler';

import { NotFoundError, InappropriateEndpointError, ForbiddenError } from 'shared/errors';
import { NOTE_RECORD_TYPES } from 'shared/models/Note';

export const note = express.Router();

// Encounter notes cannot be edited
function canModifyNote(noteObject) {
  return noteObject.recordType !== NOTE_RECORD_TYPES.ENCOUNTER;
}

note.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { models, body, params } = req;

    const editedNote = await models.Note.findByPk(params.id);
    if (!editedNote) {
      throw new NotFoundError();
    }

    if (canModifyNote(editedNote) === false) {
      throw new ForbiddenError('Cannot edit encounter notes.');
    }

    req.checkPermission('write', editedNote.recordType);

    const owner = await models[editedNote.recordType].findByPk(editedNote.recordId);
    req.checkPermission('write', owner);

    await editedNote.update(body);

    res.send(editedNote);
  }),
);

note.post(
  '/$',
  asyncHandler(async () => {
    throw new InappropriateEndpointError(
      'Note should be created using a nested endpoint (eg encounter/12345/notes)',
    );
  }),
);

note.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const noteToBeDeleted = await req.models.Note.findByPk(req.params.id);
    if (!noteToBeDeleted) {
      throw new NotFoundError();
    }

    if (canModifyNote(noteToBeDeleted) === false) {
      throw new ForbiddenError('Cannot delete encounter notes.');
    }

    req.checkPermission('write', noteToBeDeleted.recordType);
    await req.models.Note.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send({});
  }),
);
