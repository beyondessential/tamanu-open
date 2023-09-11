import React from 'react';
import styled from 'styled-components';
import { groupBy } from 'lodash';
import { APPOINTMENT_STATUSES } from 'shared/constants';
import { Colors } from '../../constants';
import { Appointment } from './Appointment';

const Column = ({ header, appointments, onAppointmentUpdated }) => {
  const appointmentsByStartTime = [...appointments].sort((a, b) => a.startTime - b.startTime);
  return (
    <>
      <ColumnHeader className="location">{header}</ColumnHeader>
      <ColumnBody className="appointments">
        {appointmentsByStartTime.map(appt => (
          <Appointment key={appt.id} appointment={appt} onUpdated={onAppointmentUpdated} />
        ))}
      </ColumnBody>
    </>
  );
};

export const DailySchedule = ({
  appointments,
  activeFilter,
  filterValue,
  appointmentType,
  onAppointmentUpdated,
}) => {
  const appointmentGroups = groupBy(
    appointments.filter(appointment => {
      // don't show canceled appointment
      if (appointment.status === APPOINTMENT_STATUSES.CANCELLED) {
        return false;
      }
      return true;
    }),
    appt => appt[activeFilter].id,
  );
  const columns = Object.entries(appointmentGroups)
    .filter(([key]) => {
      // currently this just selects a single element from the appointmentGroups object,
      // but we're keeping it as an array filter to allow for easier expansion in future
      if (!filterValue) {
        return true;
      }
      return key === filterValue;
    })
    .map(([key, appts]) => {
      const firstAppointment = appts[0];
      const filterObject = firstAppointment[activeFilter];
      // location has name, while clinician has displayName;
      const header = filterObject.name || filterObject.displayName;

      const displayAppointments = appts.filter(appointment => {
        // if no appointmentType selected, show all
        if (!appointmentType.length) {
          return true;
        }
        return appointmentType.includes(appointment.type);
      });
      return {
        header,
        appointments: displayAppointments,
        key,
      };
    });
  return (
    <>
      <Container>
        {columns.map(props => (
          <Column onAppointmentUpdated={onAppointmentUpdated} {...props} />
        ))}
      </Container>
    </>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: max-content 1fr;
  grid-auto-flow: column;
  justify-content: start;
`;

const ColumnHeader = styled.div`
  border: 1px solid ${Colors.outline};
  border-bottom: none;
  border-right: none;
  font-weight: bold;
  padding: 0.75em 1.5em;
  text-align: center;
  background-color: ${Colors.background};
  :nth-last-of-type(2) {
    border-right: 1px solid ${Colors.outline};
  }
`;

const ColumnBody = styled.div`
  background-color: ${Colors.white};
  border: 1px solid ${Colors.outline};
  border-right: none;
  padding: 0;
  :last-of-type {
    border-right: 1px solid ${Colors.outline};
  }
`;
