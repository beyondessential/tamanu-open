import React, { ReactElement, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Linking, TouchableHighlight } from 'react-native';
import { getUniqueId } from 'react-native-device-info';
import { FlatList } from 'react-native-gesture-handler';
import styled from 'styled-components';

import { CenterView, FullView, RowView, StyledText, StyledView } from '/styled/common';
import { Orientation, screenPercentageToDP, setStatusBar } from '/helpers/screen';
import { theme } from '/styled/theme';
import { UserAvatar } from '/components/UserAvatar';
import { Button } from '/components/Button';
import { Separator } from '/components/Separator';
import { CameraOutlineIcon, LaunchIcon } from '/components/Icons';
import { version as AppVersion } from '/root/package.json';
import { useAuth } from '~/ui/contexts/AuthContext';
import { useFacility } from '~/ui/contexts/FacilityContext';
import { authUserSelector } from '/helpers/selectors';
import { useLocalisation } from '~/ui/contexts/LocalisationContext';
import { TranslatedText } from '~/ui/components/Translations/TranslatedText';

const StyledSeparator = styled(Separator)`
  padding-left: ${screenPercentageToDP(4.86, Orientation.Width)}px;
  padding-right: ${screenPercentageToDP(4.86, Orientation.Width)}px;
`;

const StyledFlatList = styled(FlatList)`
  padding-left: ${screenPercentageToDP(4.86, Orientation.Width)}px;
  padding-right: ${screenPercentageToDP(4.86, Orientation.Width)}px;
`;

const CameraInCircle = (
  <StyledView position="absolute" right="-20%" bottom={0} zIndex={2}>
    <CenterView
      borderRadius={50}
      paddingTop={screenPercentageToDP('0.97', Orientation.Height)}
      paddingLeft={screenPercentageToDP('0.97', Orientation.Height)}
      paddingRight={screenPercentageToDP('0.97', Orientation.Height)}
      paddingBottom={screenPercentageToDP('0.97', Orientation.Height)}
      background={theme.colors.TEXT_SOFT}
    >
      <CameraOutlineIcon
        height={screenPercentageToDP('2.43', Orientation.Height)}
        width={screenPercentageToDP('2.43', Orientation.Height)}
        fill={theme.colors.WHITE}
      />
    </CenterView>
  </StyledView>
);

const MoreMenuButton = ({ Icon, title, onPress, textProps }): React.ReactElement => (
  <TouchableHighlight underlayColor={theme.colors.DEFAULT_OFF} onPress={onPress}>
    <RowView
      width="100%"
      height={screenPercentageToDP('9', Orientation.Height)}
      paddingLeft={screenPercentageToDP('4.86', Orientation.Width)}
      alignItems="center"
    >
      <StyledText
        fontWeight={500}
        color={theme.colors.TEXT_SUPER_DARK}
        fontSize={screenPercentageToDP('2', Orientation.Height)}
        {...textProps}
      >
        {title}
        {Icon && ' '}
      </StyledText>
      {Icon && (
        <StyledView>
          <Icon size={screenPercentageToDP(2, Orientation.Height)} fill={theme.colors.TEXT_SOFT} />
        </StyledView>
      )}
    </RowView>
  </TouchableHighlight>
);

type FooterProps = {
  version: string;
  deviceId: string;
};

const Footer = ({ version, deviceId }: FooterProps): ReactElement => (
  <StyledText
    marginTop={screenPercentageToDP(2.43, Orientation.Height)}
    marginLeft={screenPercentageToDP(4.86, Orientation.Width)}
    color={theme.colors.TEXT_MID}
    fontSize={screenPercentageToDP(1.45, Orientation.Height)}
  >
    <TranslatedText stringId="expandedMeta.version" fallback="Tamanu Version" /> {version}
    {'\n'}
    <TranslatedText stringId="expandedMeta.deviceId" fallback="Device ID mobile" />-{deviceId}
  </StyledText>
);

export const MoreScreen = (): ReactElement => {
  const { getLocalisation } = useLocalisation();
  const supportDeskUrl = getLocalisation('supportDeskUrl');
  const authCtx = useAuth();
  const user = useSelector(authUserSelector);
  const { facilityName } = useFacility();
  const settings = useMemo(
    () => [
      {
        title: <TranslatedText stringId="externalLink.supportCentre" fallback="Support centre" />,
        Icon: LaunchIcon,
        onPress: (): Promise<void> => Linking.openURL(supportDeskUrl),
      },
    ],
    [],
  );

  const signOut = useCallback(() => {
    authCtx.signOut();
  }, []);

  setStatusBar('dark-content', theme.colors.BACKGROUND_GREY);

  return (
    <FullView>
      <CenterView
        height={screenPercentageToDP(31.59, Orientation.Height)}
        paddingTop={screenPercentageToDP(4.86, Orientation.Height)}
        background={theme.colors.BACKGROUND_GREY}
      >
        <UserAvatar
          size={screenPercentageToDP(9.72, Orientation.Height)}
          displayName={user.displayName}
          Icon={CameraInCircle}
        />
        <StyledText
          fontSize={screenPercentageToDP(2.55, Orientation.Height)}
          color={theme.colors.TEXT_SUPER_DARK}
          fontWeight="bold"
        >
          {user.displayName}
        </StyledText>
        <RowView alignItems="center">
          <StyledText
            fontSize={screenPercentageToDP(1.7, Orientation.Height)}
            color={theme.colors.TEXT_SUPER_DARK}
          >
            {user.role} | {facilityName}
          </StyledText>
        </RowView>
        <Button
          marginTop={screenPercentageToDP(1.21, Orientation.Height)}
          width={screenPercentageToDP(29.19, Orientation.Width)}
          height={screenPercentageToDP(6.07, Orientation.Height)}
          buttonText={<TranslatedText stringId="auth.action.signOut" fallback="Sign out" />}
          onPress={signOut}
          outline
          borderColor={theme.colors.PRIMARY_MAIN}
        />
      </CenterView>
      <StyledView background={theme.colors.WHITE} flex={1}>
        <StyledView>
          <StyledFlatList
            showsVerticalScrollIndicator={false}
            data={settings}
            keyExtractor={(item): string => item.title}
            renderItem={({ item }): ReactElement => <MoreMenuButton {...item} />}
            ItemSeparatorComponent={StyledSeparator}
            ListFooterComponent={StyledSeparator}
          />
        </StyledView>
        <Footer version={AppVersion} deviceId={getUniqueId()} />
      </StyledView>
    </FullView>
  );
};
