import React, { memo } from 'react';
import { SvgXml, SvgProps } from 'react-native-svg';

export const StethoscopeIcon = memo((props: SvgProps) => {
  const xml = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clipPath="url(#clip0)">
    <path d="M31.9612 17.8385C31.7248 16.2002 30.4378 14.9133 28.7996 14.6768V13.7072C28.7996 11.0321 26.766 8.85396 24.2663 8.85396C21.8386 8.85396 19.8061 10.9659 19.733 13.5622H19.764L19.733 13.5675V24.0777C19.733 27.4377 17.2211 30.1662 14.1331 30.1662C11.0452 30.1662 8.5332 27.434 8.5332 24.0777V23.1673C9.30652 23.1673 10.1332 22.6068 10.1332 21.034V19.6927C13.5561 18.8175 15.9998 15.8784 15.9998 12.5462V11.4342H14.9331L14.9107 4.49295C14.903 3.20811 13.981 2.11106 12.7166 1.88233C12.4439 1.0468 11.5454 0.590544 10.7098 0.863341C9.87431 1.13607 9.41805 2.03452 9.69085 2.87011C9.96358 3.70563 10.862 4.16189 11.6976 3.8891C12.145 3.74303 12.5048 3.40644 12.6803 2.96978C13.3636 3.16417 13.8369 3.78576 13.8425 4.49615L13.8665 11.4342H12.7998V12.5616C12.7573 14.4167 11.5136 16.0289 9.72998 16.5408C8.77566 16.8436 7.75101 16.8436 6.7967 16.5408C5.01519 16.0271 3.77427 14.4153 3.73328 12.5616V11.4342H2.1333V4.50095C2.13637 3.7801 2.62116 3.15024 3.31728 2.96284C3.64188 3.78916 4.57486 4.19583 5.40118 3.87123C6.2275 3.54663 6.63416 2.61358 6.30957 1.78733C5.98497 0.961072 5.05192 0.554345 4.22567 0.87894C3.77794 1.05487 3.43248 1.422 3.28422 1.87966C2.00604 2.09806 1.07018 3.20424 1.06665 4.50095V11.4342H0V12.5435C0 15.8795 2.4453 18.8197 5.86658 19.6927V21.034C5.86658 22.6068 6.69323 23.1673 7.46655 23.1673V24.0777C7.46655 28.0243 10.4569 31.2328 14.1331 31.2328C17.8093 31.2328 20.7997 28.0206 20.7997 24.0777V13.5931C20.853 11.5691 22.4093 9.92221 24.2663 9.92221C26.1777 9.92221 27.7329 11.6203 27.7329 13.7088V14.6768C25.6922 14.9713 24.2767 16.8644 24.5712 18.9051C24.8657 20.9458 26.7589 22.3614 28.7996 22.0668C30.8403 21.7723 32.2558 19.8791 31.9612 17.8385ZM11.1998 2.90098C10.9053 2.90098 10.6665 2.66218 10.6665 2.36765C10.6665 2.07312 10.9053 1.83433 11.1998 1.83433C11.4944 1.83433 11.7332 2.07312 11.7332 2.36765C11.7332 2.66218 11.4944 2.90098 11.1998 2.90098ZM4.79993 1.83433C5.09445 1.83433 5.33325 2.07312 5.33325 2.36765C5.33325 2.66218 5.09445 2.90098 4.79993 2.90098C4.5054 2.90098 4.2666 2.66218 4.2666 2.36765C4.2666 2.07312 4.5054 1.83433 4.79993 1.83433ZM1.06665 12.5435V12.5008H2.66663V12.5616C2.70662 14.8797 4.2488 16.9026 6.4735 17.5552C7.63928 17.9243 8.8906 17.9243 10.0564 17.5552C12.2821 16.9035 13.8257 14.8805 13.8665 12.5616V12.5008H14.9331V12.5435C14.9331 15.5104 12.6462 18.121 9.49319 18.7525C8.7528 18.9007 7.99441 18.9379 7.24309 18.8629C6.99576 18.8389 6.7499 18.8017 6.50657 18.7514C3.35355 18.121 1.06665 15.5104 1.06665 12.5435ZM7.46655 22.1007C6.98656 22.1007 6.93323 21.354 6.93323 21.034V19.9023C6.97589 19.9077 7.01962 19.9098 7.06282 19.9141C7.11616 19.9199 7.16949 19.9242 7.22282 19.929C7.47508 19.9514 7.72948 19.9663 7.98601 19.9669H8.01268C8.26867 19.9669 8.52254 19.9514 8.7732 19.929C8.82653 19.9242 8.88306 19.9199 8.93799 19.9141C8.98013 19.9093 9.02386 19.9077 9.06599 19.9023V21.034C9.06599 21.354 9.01266 22.1007 8.53267 22.1007H7.46655ZM28.2662 21.034C26.7935 21.034 25.5996 19.8401 25.5996 18.3674C25.5996 16.8947 26.7935 15.7008 28.2662 15.7008C29.7389 15.7008 30.9329 16.8947 30.9329 18.3674C30.9311 19.8395 29.7382 21.0323 28.2662 21.034Z" fill="black" />
    <path d="M28.2665 16.7675C27.3828 16.7675 26.6665 17.4838 26.6665 18.3674C26.6665 19.2511 27.3828 19.9674 28.2665 19.9674C29.1501 19.9674 29.8665 19.2511 29.8665 18.3674C29.8665 17.4838 29.1501 16.7675 28.2665 16.7675ZM28.2665 18.9007C27.972 18.9007 27.7332 18.662 27.7332 18.3674C27.7332 18.0729 27.972 17.8341 28.2665 17.8341C28.561 17.8341 28.7998 18.0729 28.7998 18.3674C28.7998 18.662 28.561 18.9007 28.2665 18.9007Z" fill="black" />
  </g>
  <defs>
    <clipPath id="clip0">
      <path d="M0 0H32V32H0V0Z" fill="white" />
    </clipPath>
  </defs>
</svg>`;
  return <SvgXml xml={xml} {...props} />;
});