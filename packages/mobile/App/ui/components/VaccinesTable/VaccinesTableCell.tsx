import React, { ReactElement, useCallback } from 'react';
import { Popup } from 'popup-ui';
import {
  StyledView,
  StyledTouchableOpacity,
  StyledImage,
  CenterView,
} from '/styled/common';
import { theme } from '/styled/theme';
import { VaccineStatusCells } from '/helpers/constants';
import { screenPercentageToDP, Orientation } from '/helpers/screen';
import { IAdministeredVaccine, IPatient, IScheduledVaccine } from '~/types';
import { getVaccineStatus, VaccineStatus } from '~/ui/helpers/patient';
import { BypassWarningIcon } from './BypassWarningIcon';

interface VaccineCellMetadata {
  index?: number;
  weeksFromBirthDue?: number;
  weeksFromLastVaccinationDue?: number;
  scheduledVaccineId?: string;
  vaccineStatus: VaccineStatus;
  schedule: ReactElement;
  vaccine: IScheduledVaccine;
  patient: IPatient;
  administeredData: IAdministeredVaccine[];
}

interface VaccineTableCellProps {
  data: IAdministeredVaccine & VaccineCellMetadata;
  onPress?: (item: any) => void;
}

const CellContent = ({
  cellStatus, status,
}: { status?: string; cellStatus?: string }): ReactElement => {
  const cellData = VaccineStatusCells[cellStatus] || VaccineStatusCells[status];
  const Icon = cellData.Icon;

  return (
    <StyledView
      width={85}
      borderRightWidth={1}
      borderColor={theme.colors.BOX_OUTLINE}
      background={cellData.background}
      borderBottomWidth={1}
      height={80}
      alignItems="center"
    >
      {cellStatus
        ? (
          <CenterView flex={1}>
            <Icon size={screenPercentageToDP(4.13, Orientation.Height)} />
          </CenterView>
        ) : <StyledImage source={require('../../assets/NullValueCell.png')} />
      }
    </StyledView>
  );
};

export const VaccineTableCell = ({
  data,
  onPress,
}: VaccineTableCellProps): JSX.Element => {
  if (!data) return <CellContent status={VaccineStatus.UNKNOWN} />;
  const {
    vaccine,
    vaccineStatus,
    weeksFromBirthDue,
    weeksFromLastVaccinationDue,
    id,
    index,
    patient,
    administeredData,
  } = data;
  const dueStatus = getVaccineStatus(
    { weeksFromBirthDue, weeksFromLastVaccinationDue, id, index, vaccine },
    patient,
    administeredData,
  );
  const administeredVaccine = administeredData && administeredData.find(
    v => {
      if (typeof v.scheduledVaccine === "string") {
        return v.scheduledVaccine === id;
      }
      return v.scheduledVaccine.id === id;
    }
  );

  let cellStatus = vaccineStatus || dueStatus.status || VaccineStatus.UNKNOWN;
  if (vaccineStatus === VaccineStatus.SCHEDULED) cellStatus = dueStatus.status;

  const onAdminister = useCallback(() => {
    onPress({ ...vaccine, status: vaccineStatus, scheduledVaccineId: id, administeredVaccine });
    Popup.hide();
  }, [data]);

  const onPressItem = useCallback(() => {
    if (dueStatus.warningMessage) {
      Popup.show({
        type: 'Warning',
        title: 'Vaccination Warning',
        button: true,
        textBody: dueStatus.warningMessage,
        buttonText: 'Ok',
        callback: (): void => Popup.hide(),
        icon: <BypassWarningIcon onBypassWarning={onAdminister} />,
      });

      return;
    }

    if (vaccineStatus) {
      onAdminister();
    }
  }, [data]);

  return (
    <StyledTouchableOpacity onPress={onPressItem}>
      <CellContent status={vaccineStatus} cellStatus={cellStatus} />
    </StyledTouchableOpacity>
  );
};

VaccineTableCell.defaultProps = {
  onPress: (): null => null,
};
