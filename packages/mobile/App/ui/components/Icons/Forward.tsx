import React, { memo } from 'react';
import { SvgXml } from 'react-native-svg';

export const ForwardIcon = memo(props => {
  const xml = `
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.307 17.8227L27.267 17.8227L19.504 25.8517C18.994 26.3427 18.994 27.1407 19.504 27.6317C20.014 28.1227 20.84 28.1227 21.349 27.6317L32 16.5378L21.514 5.36575C21.259 5.11875 20.925 4.99475 20.592 4.99475C20.259 4.99475 19.923 5.11775 19.669 5.36575C19.158 5.85675 19.158 6.65275 19.669 7.14375L27.352 15.3047L1.307 15.3047C0.585 15.3047 1.06063e-06 15.8677 9.99701e-07 16.5647C9.38942e-07 17.2597 0.585 17.8227 1.307 17.8227Z" fill="black" />
</svg>
  `;
  return <SvgXml xml={xml} {...props} />;
});
