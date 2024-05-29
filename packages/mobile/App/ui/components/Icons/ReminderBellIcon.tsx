import React from 'react';
import { SvgXml } from 'react-native-svg';

export const ReminderBellIcon = props => {
  const xml = `
    <svg width="${props.width || 12}" height="${props.width || 14}" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 13.1667C6.73333 13.1667 7.33333 12.5667 7.33333 11.8334H4.66666C4.66666 12.5667 5.26666 13.1667 6 13.1667ZM10 9.16669V5.83335C10 3.78669 8.91333 2.07335 7 1.62002V1.16669C7 0.613354 6.55333 0.166687 6 0.166687C5.44666 0.166687 5 0.613354 5 1.16669V1.62002C3.09333 2.07335 2 3.78002 2 5.83335V9.16669L0.666664 10.5V11.1667H11.3333V10.5L10 9.16669ZM8.66666 9.83335H3.33333V5.83335C3.33333 4.18002 4.34 2.83335 6 2.83335C7.66 2.83335 8.66666 4.18002 8.66666 5.83335V9.83335Z"
        fill="white"
      />
    </svg>
  `;
  return <SvgXml xml={xml} {...props} />;
};
