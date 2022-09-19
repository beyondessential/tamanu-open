import { addDays, endOfDay, format } from 'date-fns';
import { parseISO9075 } from 'shared/utils/dateTime';
import { generateReportFromQueryData } from './utilities';

const FIELDS = [
  'Patient ID',
  'Patient first name',
  'Patient last name',
  'DOB',
  'Age',
  'Sex',
  'Village',
  'Patient type',
  {
    title: 'Appointment date and time',
    accessor: data => format(parseISO9075(data.appointmentDateTime), 'dd/MM/yyyy hh:mm a'),
  },
  'Appointment type',
  'Appointment status',
  'Clinician',
  'Location',
];

const reportColumnTemplate = FIELDS.map(field =>
  typeof field === 'string'
    ? {
        title: field,
        accessor: data => data[field],
      }
    : field,
);

const query = `
with
	billing_type as (
		select 
			patient_id,
			max(billing.name) billing_type_name
		from patient_additional_data
		join reference_data billing on billing.id = patient_billing_type_id
		group by patient_id
	)
select
	p.display_id "Patient ID",
	p.first_name "Patient first name",
	p.last_name "Patient last name",
	to_char(p.date_of_birth::date, 'DD/MM/YYYY') "DOB",
	extract(year from age(p.date_of_birth::date)) "Age",
	p.sex "Sex",
	vil.name "Village",
	bt.billing_type_name "Patient type",
	a.start_time "appointmentDateTime",
	a."type" "Appointment type",
	a.status "Appointment status",
	u.display_name "Clinician",
	l.name "Location"
from appointments a
join patients p on p.id = a.patient_id
left join reference_data vil on vil.id = p.village_id
left join billing_type bt on bt.patient_id = p.id
left join users u on u.id = a.clinician_id
left join locations l on l.id = a.location_id
where case when :location_id is not null then l.id = :location_id else true end 
and case when :from_date is not null then a.start_time::date >= :from_date::date else true end
and case when :to_date is not null then a.start_time::date <= :to_date::date else true end
and case when :appointment_status is not null then a.status = :appointment_status else true end
and case when :clinician_id is not null then u.id = :clinician_id else true end
order by a.start_time;
`;

const getData = async (sequelize, parameters) => {
  const { appointmentStatus, location, clinician } = parameters;

  // Only default if both date parameters are blank
  let { fromDate, toDate } = parameters;
  if (!fromDate && !toDate) {
    fromDate = new Date();
    toDate = endOfDay(addDays(new Date(), 30));
  }

  return sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      from_date: fromDate ?? null,
      to_date: toDate ?? null,
      appointment_status: appointmentStatus ?? null,
      location_id: location ?? null,
      clinician_id: clinician ?? null,
    },
  });
};

export const dataGenerator = async ({ sequelize }, parameters = {}) => {
  const results = await getData(sequelize, parameters);

  return generateReportFromQueryData(results, reportColumnTemplate);
};

export const permission = 'Appointment';
