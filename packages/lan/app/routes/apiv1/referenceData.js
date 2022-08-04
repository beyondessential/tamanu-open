import express from 'express';

import { simpleGet, simplePut, simplePost } from './crudHelpers';

export const referenceData = express.Router();

referenceData.get('/:id', simpleGet('ReferenceData'));
referenceData.put('/:id', simplePut('ReferenceData'));
referenceData.post('/$', simplePost('ReferenceData'));
