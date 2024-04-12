import React, { ReactElement, useEffect, useState } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import { keyBy, mapValues } from 'lodash';

import { Dropdown, SelectOption } from '../Dropdown';
import { StyledText, StyledView } from '../../styled/common';
import { theme } from '../../styled/theme';
import { Orientation, screenPercentageToDP } from '../../helpers/screen';
import * as overrides from '/root/serverOverrides.json';
import { useTranslation } from '~/ui/contexts/TranslationContext';

type Server = {
  name: string;
  type: string;
  host: string;
};

const fetchServers = async (): Promise<SelectOption[]> => {
  // To use a local server, just edit this and select it.
  // The central server config is sticky, so you can safely revert it after
  // the first sync begins and it'll stay connecting to your local server.
  // return [{ label: 'Local', value: 'http://192.168.0.1:3000' }];

  // allows overriding the central server list or meta server in builds
  const { metaServer: metaServerOverride, centralServers: centralServerOverrides } = overrides;
  if (centralServerOverrides) {
    return centralServerOverrides;
  }

  const defaultMetaServer = __DEV__ ? 'https://meta-dev.tamanu.io' : 'https://meta.tamanu.io';
  const metaServer = metaServerOverride || defaultMetaServer;
  const response = await fetch(`${metaServer}/servers`);
  const servers: Server[] = await response.json();

  return servers.map(s => ({
    label: s.name,
    value: s.host,
  }));
};

export const ServerSelector = ({ onChange, label, value, error }): ReactElement => {
  const [options, setOptions] = useState([]);
  const netInfo = useNetInfo();
  const { setLanguageOptions, setLanguage, host, setHost } = useTranslation();

  const updateHost = value => {
    onChange(value);
    setHost(value);
    if (!value) {
      setLanguage('en');
      setLanguageOptions(null);
    }
  };

  useEffect(() => {
    const getOptions = async () => {
      const response = await fetch(`${host}/api/public/translation/languageOptions`);
      const { languageNames, languagesInDb } = await response.json();
      if (languageNames.length > 0) {
        const languageDisplayNames = mapValues(keyBy(languageNames, 'language'), 'text');
        const languageOptions = languagesInDb.map(({ language }) => {
          return {
            label: languageDisplayNames[language],
            value: language,
          };
        });
        setLanguage(languageOptions[0].value);
        setLanguageOptions(languageOptions);
      }
    };
    if (host) getOptions();
  }, [host, setLanguage, setLanguageOptions]);

  useEffect(() => {
    (async (): Promise<void> => {
      if (!value && netInfo.isInternetReachable) {
        const servers = await fetchServers();
        setOptions(servers);
      }
    })();
  }, [netInfo.isInternetReachable]);

  if (!netInfo.isInternetReachable) {
    return <StyledText color={theme.colors.ALERT}>No internet connection available.</StyledText>;
  }

  return (
    <StyledView
      marginBottom={screenPercentageToDP(7, Orientation.Height)}
      height={screenPercentageToDP(5.46, Orientation.Height)}
      style={{ zIndex: 9999 }}
    >
      <Dropdown
        value={value}
        options={options}
        onChange={updateHost}
        label={label}
        fixedHeight
        selectPlaceholderText="Select"
        labelColor="white"
        error={error}
      />
    </StyledView>
  );
};
