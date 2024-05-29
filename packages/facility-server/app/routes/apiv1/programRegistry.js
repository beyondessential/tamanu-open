import express from 'express';
import asyncHandler from 'express-async-handler';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { subject } from '@casl/ability';
import { REGISTRATION_STATUSES, VISIBILITY_STATUSES } from '@tamanu/constants';
import { deepRenameObjectKeys } from '@tamanu/shared/utils';
import { simpleGet, simpleGetList } from '@tamanu/shared/utils/crudHelpers';

import {
  makeFilter,
  makeSimpleTextFilterFactory,
  makeSubstringTextFilterFactory,
} from '../../utils/query';

export const programRegistry = express.Router();

programRegistry.get('/:id', simpleGet('ProgramRegistry'));

programRegistry.get(
  '/$',
  asyncHandler(async (req, res) => {
    const { models, query } = req;
    req.checkPermission('list', 'ProgramRegistry');

    if (query.excludePatientId) {
      req.checkPermission('read', 'Patient');
      req.checkPermission('read', 'PatientProgramRegistration');
    }

    const { ProgramRegistry } = models;

    const patientIdExclusion = query.excludePatientId
      ? {
          id: {
            [Op.notIn]: Sequelize.literal(
              `(
                SELECT most_recent_registrations.id
                FROM (
                    SELECT DISTINCT ON (pr.id) pr.id, ppr.registration_status
                    from program_registries pr
                    INNER JOIN patient_program_registrations ppr
                    ON ppr.program_registry_id = pr.id
                    WHERE ppr.patient_id = :excludePatientId
                    ORDER BY pr.id DESC, ppr.date DESC, ppr.id DESC
                ) most_recent_registrations
                WHERE most_recent_registrations.registration_status != :error
              )`,
            ),
          },
        }
      : {};

    const baseQueryOptions = {
      where: {
        visibilityStatus: VISIBILITY_STATUSES.CURRENT,
        ...patientIdExclusion,
      },
      replacements: {
        error: REGISTRATION_STATUSES.RECORDED_IN_ERROR,
        excludePatientId: query.excludePatientId,
      },
    };

    const count = await ProgramRegistry.count(baseQueryOptions);

    const { order = 'ASC', orderBy = 'createdAt', rowsPerPage, page } = query;
    const objects = await ProgramRegistry.findAll({
      ...baseQueryOptions,
      include: ProgramRegistry.getListReferenceAssociations(models),
      order: orderBy ? [[...orderBy.split('.'), order.toUpperCase()]] : undefined,
      limit: rowsPerPage,
      offset: page && rowsPerPage ? page * rowsPerPage : undefined,
    });

    const filteredObjects = objects.filter(programRegistry => req.ability.can('list', programRegistry));
    const filteredData = filteredObjects.map(x => x.forResponse());
    const filteredCount = objects.length !== filteredObjects.length ? filteredObjects.length : count;

    res.send({ count: filteredCount, data: filteredData });
  }),
);

programRegistry.get(
  '/:id/conditions',
  simpleGetList('ProgramRegistryCondition', 'programRegistryId', {
    additionalFilters: {
      visibilityStatus: VISIBILITY_STATUSES.CURRENT,
    },
  }),
);

programRegistry.get(
  '/:id/registrations',
  asyncHandler(async (req, res) => {
    const {
      models: { PatientProgramRegistration },
      params: { id: programRegistryId },
      query,
    } = req;
    req.checkPermission('read', subject('ProgramRegistry', { id: programRegistryId }));
    req.checkPermission('read', 'Patient');
    req.checkPermission('list', 'PatientProgramRegistration');

    const {
      order = 'ASC',
      orderBy = 'displayId',
      rowsPerPage = 10,
      page = 0,
      ...filterParams
    } = query;

    const makeSimpleTextFilter = makeSimpleTextFilterFactory(filterParams);
    const makePartialTextFilter = makeSubstringTextFilterFactory(filterParams);
    const filters = [
      // Patient filters
      makePartialTextFilter('displayId', 'patient.display_id'),
      makeSimpleTextFilter('firstName', 'patient.first_name'),
      makeSimpleTextFilter('lastName', 'patient.last_name'),
      makeFilter(filterParams.sex, 'patient.sex = :sex', ({ sex }) => ({
        sex: sex.toLowerCase(),
      })),
      makeFilter(filterParams.dateOfBirth, `patient.date_of_birth = :dateOfBirth`),
      makeFilter(filterParams.homeVillage, `patient.village_id = :homeVillage`),
      makeFilter(
        !filterParams.deceased || filterParams.deceased === 'false',
        'patient.date_of_death IS NULL',
      ),

      // Registration filters
      makeFilter(
        filterParams.registeringFacilityId,
        'mrr.registering_facility_id = :registeringFacilityId',
      ),
      makeFilter(filterParams.clinicalStatus, 'mrr.clinical_status_id = :clinicalStatus'),
      makeFilter(
        filterParams.currentlyIn,
        'mrr.village_id = :currentlyIn OR mrr.facility_id = :currentlyIn',
      ),
      makeFilter(
        filterParams.programRegistryCondition,
        // Essentially the `<@` operator checks that the json on the left is contained in the json on the right
        // so we build up a string like '["A_condition_name"]' and cast it to json before checking membership.
        `(select '["' || prc2.name || '"]' from program_registry_conditions prc2 where prc2.id = :programRegistryCondition)::jsonb <@ conditions.condition_list`,
      ),
      makeFilter(true, 'mrr.registration_status != :error_status', () => ({
        error_status: REGISTRATION_STATUSES.RECORDED_IN_ERROR,
      })),
      makeFilter(
        !filterParams.removed || filterParams.removed === 'false',
        'mrr.registration_status = :active_status',
        () => ({
          active_status: REGISTRATION_STATUSES.ACTIVE,
        }),
      ),
    ].filter(f => f);

    const whereClauses = filters.map(f => f.sql).join(' AND ');

    const filterReplacements = filters
      .filter(f => f.transform)
      .reduce(
        (current, { transform }) => ({
          ...current,
          ...transform(current),
        }),
        filterParams,
      );

    const withClause = `
      with
        most_recent_registrations as (
          SELECT *
          FROM (
            SELECT 
              *,
              ROW_NUMBER() OVER (PARTITION BY patient_id, program_registry_id ORDER BY date DESC, id DESC) AS row_num
            FROM patient_program_registrations
            WHERE program_registry_id = :programRegistryId
          ) n
          WHERE n.row_num = 1
        ),
        conditions as (
          SELECT patient_id, jsonb_agg(prc."name") condition_list  
          FROM patient_program_registration_conditions pprc
            JOIN program_registry_conditions prc
              ON pprc.program_registry_condition_id = prc.id
          WHERE pprc.program_registry_id = :programRegistryId AND pprc.deleted_at IS NULL
          GROUP BY patient_id
        )
    `;
    const from = `
      FROM most_recent_registrations mrr
        LEFT JOIN patients patient
          ON patient.id = mrr.patient_id
        LEFT JOIN reference_data patient_village
          ON patient.village_id = patient_village.id
        LEFT JOIN reference_data currently_at_village
          ON mrr.village_id = currently_at_village.id
        LEFT JOIN facilities currently_at_facility
          ON mrr.facility_id = currently_at_facility.id
        LEFT JOIN facilities registering_facility
          ON mrr.registering_facility_id = registering_facility.id
        LEFT JOIN conditions
          ON conditions.patient_id = mrr.patient_id
        LEFT JOIN program_registry_clinical_statuses status
          ON mrr.clinical_status_id = status.id
        LEFT JOIN program_registries program_registry
          ON mrr.program_registry_id = program_registry.id
        LEFT JOIN users clinician
          ON mrr.clinician_id = clinician.id
      ${whereClauses && `WHERE ${whereClauses}`}
    `;

    const countResult = await req.db.query(`${withClause} SELECT COUNT(1) AS count ${from}`, {
      replacements: {
        ...filterReplacements,
        programRegistryId,
      },
      type: QueryTypes.SELECT,
    });

    const count = parseInt(countResult[0].count, 10);

    if (count === 0) {
      // save ourselves a query
      res.send({ data: [], count });
      return;
    }
    const sortKeys = {
      displayId: 'patient.display_id',
      firstName: 'UPPER(patient.first_name)',
      lastName: 'UPPER(patient.last_name)',
      dateOfBirth: 'patient.date_of_birth',
      homeVillage: 'UPPER(patient_village.name)',
      registeringFacility: 'registering_facility.name',
      currentlyIn: 'COALESCE(UPPER(currently_at_village.name), UPPER(currently_at_facility.name))',
      clinicalStatus: 'mrr.clinical_status_id',
    };

    const sortKey = sortKeys[orderBy] ?? sortKeys.displayId;
    const sortDirection = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const nullPosition = sortDirection === 'ASC' ? 'NULLS FIRST' : 'NULLS LAST';

    const result = await req.db.query(
      `
      ${withClause}
      select
        patient.id AS "patient.id",
        --
        -- Details for the table
        patient.id AS "patient_id",
        patient.display_id AS "patient.display_id",
        patient.first_name AS "patient.first_name",
        patient.last_name AS "patient.last_name",
        patient.date_of_birth AS "patient.date_of_birth",
        patient.date_of_death AS "patient.date_of_death",
        patient.sex AS "patient.sex",
        patient_village.name AS "patient.village.name",
        currently_at_village.name as "village.name",
        currently_at_facility.name as "facility.name",
        registering_facility.name as "registering_facility.name",
        conditions.condition_list as "conditions",
        status.name as "clinical_status.name",
        status.color as "clinical_status.color",
        status.id as "clinical_status.id",
        program_registry.currently_at_type as "program_registry.currently_at_type",
        program_registry.name as "program_registry.name",
        program_registry.id as "program_registry_id",
        clinician.display_name as "clinician.display_name",
        mrr.date as "date",
        --
        -- Details for filtering/ordering
        patient.date_of_death as "patient.date_of_death",
        mrr.registration_status as "registration_status"
      ${from}

      ORDER BY ${sortKey} ${sortDirection}${nullPosition ? ` ${nullPosition}` : ''}
      LIMIT :limit
      OFFSET :offset
      `,
      {
        replacements: {
          ...filterReplacements,
          programRegistryId,
          limit: rowsPerPage,
          offset: page * rowsPerPage,
          sortKey,
          sortDirection,
        },
        // The combination of these two parameters allow mapping the query results
        // to nested models
        model: PatientProgramRegistration,
        mapToModel: true,
        nest: true,
        raw: true,
        type: QueryTypes.SELECT,
      },
    );

    const forResponse = result.map(deepRenameObjectKeys);
    res.send({
      data: forResponse,
      count,
    });
  }),
);
