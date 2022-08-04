import React, { memo } from 'react';
import { SvgXml } from 'react-native-svg';

export const MedicineIcon = memo(props => {
  const xml = `
  <svg width="175" height="174" viewBox="0 0 175 174" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M171.3 86.8C171.3 133.2 133.7 170.8 87.3003 170.8C40.9003 170.8 3.30029 133.2 3.30029 86.8C3.30029 40.4 40.9003 2.8 87.3003 2.8C133.8 2.8 171.3 40.4 171.3 86.8Z" fill="#FFD943" />
  <g clipPath="url(#clip0)">
    <path d="M93.6004 47.4002C95.3004 61.1002 97.2004 75.4002 95.8004 87.8002C94.0004 88.4002 92.2004 89.1002 90.5004 89.7002C85.9004 91.4002 81.5004 93.4002 77.4004 95.7002C75.2004 96.9002 73.2004 98.2002 71.2004 99.7002C73.6004 92.2002 75.7004 82.1002 77.1004 67.7002L76.2004 68.0002C76.2004 68.0002 73.8004 87.0002 65.3004 104.7C64.7004 105.3 64.2004 105.9 63.6004 106.5C63.0004 105.7 62.4004 104.9 61.8004 104.2C59.1004 100.8 55.9004 97.7002 52.5004 94.7002C51.6004 82.9002 52.2004 68.3002 61.1004 52.5002C72.9004 31.6002 88.3004 23.1002 93.6004 20.0002C93.6004 20.0002 91.4004 29.5002 93.6004 47.4002ZM36.3004 84.8002C24.9004 76.1002 20.9004 69.4002 20.9004 69.4002C19.5004 74.5002 15.0004 89.0002 19.8004 108.1C24.5004 127.2 36.9004 136.2 45.1004 142.4C50.0004 146.1 52.5004 148.6 53.6004 150C53.1004 146.2 52.8004 142.5 52.8004 138.9C52.8004 138.8 52.8004 138.7 52.8004 138.6C48.4004 121.6 37.6004 107.3 37.6004 107.3L37.9004 106.5C46.1004 116.6 50.7004 124.2 53.4004 130.3C53.9004 126.6 54.7004 123.1 56.0004 119.7C57.5004 115.7 59.5004 111.9 62.2004 108.4C56.0004 99.6002 45.8004 92.1002 36.3004 84.8002ZM54.8004 163.8C56.2004 158.3 57.6004 154.5 57.6004 154.5C53.9004 135.2 56.3004 117.7 68.5004 106.1C80.7004 94.5002 100.9 89.3002 119.7 84.0002C138.5 78.7002 147.1 72.2002 147.1 72.2002C146.3 79.3002 144.6 100 129 121.9C113.3 143.8 93.1004 148.9 79.6004 152.7C66.1004 156.5 63.0004 159.2 63.0004 159.2C74.4004 131.5 106.9 112 106.9 112V110.9C68.0004 132.7 65.0004 145.9 61.2004 156.6C60.2004 159.3 59.5004 162.4 58.9004 165.7L54.8004 163.8Z" fill="#2F4358" />
  </g>
  <defs>
    <clipPath id="clip0">
      <rect x="17.6006" y="20.0002" width="129.4" height="145.7" fill="white" />
    </clipPath>
  </defs>
</svg>
  `;
  return <SvgXml xml={xml} {...props} />;
});