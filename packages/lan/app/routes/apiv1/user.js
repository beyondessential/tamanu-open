import config from 'config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import { QueryTypes } from 'sequelize';

import { BadAuthenticationError } from 'shared/errors';
import { getPermissions } from 'shared/permissions/middleware';
import { simpleGet, paginatedGetList, permissionCheckingRouter } from './crudHelpers';

export const user = express.Router();

user.get(
  '/me',
  asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new BadAuthenticationError('Invalid token');
    }
    req.checkPermission('read', req.user);
    res.send(req.user);
  }),
);

user.get('/permissions', asyncHandler(getPermissions));

user.get(
  '/current-facility',
  asyncHandler(async (req, res) => {
    req.checkPermission('list', 'User');
    const userFacilities = await req.models.UserFacility.findAll({
      where: { facilityId: config.serverFacilityId },
      include: [
        {
          model: req.models.User,
          as: 'user',
        },
      ],
    });
    const users = userFacilities.map(userFacility => userFacility.get({ plain: true }).user);
    res.send(users);
  }),
);

user.get(
  '/recently-viewed-patients',
  asyncHandler(async (req, res) => {
    const {
      models: { Patient },
      user: currentUser,
      query,
    } = req;

    req.checkPermission('read', currentUser);
    req.checkPermission('list', 'Patient');

    let andClauses = '';

    if (query.encounterType) {
      andClauses = `AND encounters.encounter_type = '${query.encounterType}'`;
    }

    const recentlyViewedPatients = await req.db.query(
      `
      SELECT
        patients.id,
        patients.display_id,
        patients.first_name,
        patients.last_name,
        patients.sex,
        patients.date_of_birth,
        encounters.id AS encounter_id,
        encounters.encounter_type,
        user_recently_viewed_patients.updated_at AS last_accessed_on
      FROM user_recently_viewed_patients
        LEFT JOIN patients
          ON (patients.id = user_recently_viewed_patients.patient_id)
        LEFT JOIN (
            SELECT patient_id, max(start_date) AS most_recent_open_encounter
            FROM encounters
            WHERE end_date IS NULL
            GROUP BY patient_id
          ) recent_encounter_by_patient
          ON (patients.id = recent_encounter_by_patient.patient_id)
        LEFT JOIN encounters
          ON (patients.id = encounters.patient_id AND recent_encounter_by_patient.most_recent_open_encounter = encounters.start_date)
        WHERE user_recently_viewed_patients.user_id = '${currentUser.id}'
        ${andClauses}
        ORDER BY last_accessed_on DESC
        LIMIT 12
      `,
      {
        model: Patient,
        type: QueryTypes.SELECT,
        mapToModel: true,
      },
    );

    res.send({
      data: recentlyViewedPatients,
      count: recentlyViewedPatients.length,
    });
  }),
);

user.post(
  '/recently-viewed-patients/:patientId',
  asyncHandler(async (req, res) => {
    const {
      models: { UserRecentlyViewedPatient },
      user: currentUser,
      params,
    } = req;

    const { patientId } = params;

    req.checkPermission('read', 'Patient');

    const [createdRelation] = await UserRecentlyViewedPatient.create({
      userId: currentUser.id,
      patientId,
    });

    res.send(createdRelation);
  }),
);

user.get('/:id', simpleGet('User'));

const globalUserRequests = permissionCheckingRouter('list', 'User');
globalUserRequests.get('/$', paginatedGetList('User'));
user.use(globalUserRequests);
