import express from 'express';

import { simpleGet, simplePut, simplePost } from './crudHelpers';

export const ongoingCondition = express.Router();

ongoingCondition.get('/:id', simpleGet('PatientCondition'));
ongoingCondition.put('/:id', simplePut('PatientCondition'));
ongoingCondition.post('/$', simplePost('PatientCondition'));
