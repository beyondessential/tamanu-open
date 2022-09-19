import { subDays } from 'date-fns';
import { generateReportFromQueryData } from './utilities';

const FIELDS = [
  'Patient ID',
  'Patient first name',
  'Patient last name',
  'DOB',
  'Age',
  'Sex',
  'Village',
  'Facility',
  'Department',
  'Location',
  'Laboratory',
  'Request ID',
  'Request date and time',
  'Sample collection date and time',
  'Supervising clinician',
  'Requesting clinician',
  'Priority',
  'Test category',
  'Tests',
  'Status',
];

const reportColumnTemplate = FIELDS.map(field => ({
  title: field,
  accessor: data => data[field],
}));

const query = `
with lab_test_items(lab_request_id, Tests) as
  (
    select lr.id as "lab_request_id", string_agg(ltt.name, ', ') AS "Tests"
    from lab_requests lr
    left join lab_tests lt on lr.id = lt.lab_request_id
    left join lab_test_types ltt on ltt.id = lt.lab_test_type_id
    group by lr.id
  )
select
  p.display_id as "Patient ID",
  p.first_name as "Patient first name",
  p.last_name as "Patient last name",
  to_char(p.date_of_birth::timestamp::date, 'dd/mm/yyyy') as "DOB",
  case
    when p.date_of_death is null
    then date_part('year', Age(p.date_of_birth))
    else date_part('year', Age(p.date_of_death::date, p.date_of_birth))
    end as "Age",
  p.sex as "Sex",
  rd_village.name as "Village",
  f."name" as "Facility",
  d."name" as "Department",
  l."name" as "Location",
  rd_laboratory.name as "Laboratory",
  lr.display_id as "Request ID",
  to_char(lr.requested_date::timestamp, 'dd/mm/yyyy hh12:miam') as "Request date and time",
  to_char(lr.sample_time::timestamp, 'dd/mm/yyyy hh12:miam') as "Sample collection date and time",
  examiner_by_user.display_name as "Supervising clinician",
  requested_by_user.display_name as "Requesting clinician",
  rd_priority.name as "Priority",
  rd_request_type.name as "Test category",
  lti.Tests as "Tests",
  case
    when lr.status = 'reception_pending' then 'Reception pending'
    when lr.status = 'results_pending' then 'Results pending'
    when lr.status = 'to_be_verified' then 'To be verified'
    when lr.status = 'verified' then 'Verified'
    when lr.status = 'published' then 'Published'
    else lr.status
  end as "Status"
from lab_requests lr
  left join encounters e on e.id = lr.encounter_id
  left join patients p on p.id = e.patient_id
  left join locations l on l.id = e.location_id
  left join facilities f on f.id = l.facility_id
  left join lab_test_items lti on lti.lab_request_id = lr.id
  left join reference_data rd_request_type on rd_request_type.id = lr.lab_test_category_id
  left join users requested_by_user on requested_by_user.id = lr.requested_by_id
  left join users examiner_by_user on examiner_by_user.id = e.examiner_id
  left join reference_data rd_priority on rd_priority.id = lr.lab_test_priority_id
  left join reference_data rd_laboratory on rd_laboratory.id = lr.lab_test_laboratory_id
  left join departments d on d.id = e.department_id
  left join reference_data rd_village on rd_village.id = p.village_id
where
  lr.status != 'deleted'
  and p.id not in (
    '4d719b6f-af55-42ac-99b3-5a27cadaab2b',
    '2d574680-e0fc-4956-a37e-121ccb434995',
    'c11229a7-b95c-4416-a3ad-560cd75d8f21',
    'cebdd9a4-2744-4ad2-9919-98dc0b15464c'
  )
  and case when :from_date is not null then lr.requested_date::date >= :from_date::date else true end
  and case when :to_date is not null then lr.requested_date::date <= :to_date::date else true end
  and case when :requested_by_id is not null then lr.requested_by_id = :requested_by_id else true end
  and case when :lab_test_category_id is not null then rd_request_type.id = :lab_test_category_id else true end
  and case when :status is not null then lr.status = :status else true end
order by lr.requested_date;
`;

const getData = async (sequelize, parameters) => {
  const {
    fromDate = subDays(new Date(), 30),
    toDate,
    requestedById,
    labTestCategoryId,
    status,
  } = parameters;

  return sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      from_date: fromDate ?? null,
      to_date: toDate ?? null,
      requested_by_id: requestedById ?? null,
      lab_test_category_id: labTestCategoryId ?? null,
      status: status ?? null,
    },
  });
};

export const dataGenerator = async ({ sequelize }, parameters = {}) => {
  const results = await getData(sequelize, parameters);

  return generateReportFromQueryData(results, reportColumnTemplate);
};

export const permission = 'LabRequest';
