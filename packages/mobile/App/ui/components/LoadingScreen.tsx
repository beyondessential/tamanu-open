import React, { memo } from 'react';
import { ActivityIndicator } from "react-native";
import { FullView, CenterView } from '~/ui/styled/common';

export const LoadingScreen: React.FC = memo(() => (
  <FullView padding={12} justifyContent="center" alignItems="center">
    <CenterView>
      <ActivityIndicator size="large" />
    </CenterView>
  </FullView>
));
