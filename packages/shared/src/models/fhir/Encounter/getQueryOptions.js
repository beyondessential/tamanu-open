export function getQueryOptions(models) {
  const { Encounter, Discharge, Patient, Facility, Location, LocationGroup } = models;

  return {
    [Encounter.tableName]: {
      include: [
        {
          model: Discharge,
          as: 'discharge',
          required: false,
        },
        {
          model: Patient,
          as: 'patient',
        },
        {
          model: Location,
          as: 'location',
          include: [
            {
              model: LocationGroup,
              as: 'locationGroup',
            },
          ],
        },
        {
          model: Location,
          as: 'location',
          include: [
            {
              model: Facility,
              as: 'facility',
            },
          ],
        },
      ],
    },
  };
}
