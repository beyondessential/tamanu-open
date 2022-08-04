import React, { memo } from 'react';
import { SvgXml } from 'react-native-svg';
import { IconWithSizeProps } from '../../interfaces/WithSizeProps';

export const HomeBottomLogoIcon = memo((props: IconWithSizeProps) => {
  const xml = `<svg width="100%" height="100%" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M10.0936 3.54846H11.9097V5.43006H13.7262V7.31166H11.9097V9.19327H10.0936V7.31166H8.2774V5.43006H10.0936V3.54846Z" fill="white" />
  <path fillRule="evenodd" clipRule="evenodd" d="M6.13493 6.25943C6.13493 7.59386 6.62926 8.95225 7.57041 10.0499C8.41559 11.0358 9.39454 12.0135 10.3735 12.9914L11.0021 13.6199L11.6309 12.9914C12.6096 12.0135 13.5886 11.0358 14.4338 10.0499C15.3749 8.95225 15.8692 7.5936 15.8692 6.25943C15.8692 4.99842 15.4209 3.75569 14.4823 2.78321C13.5217 1.7878 12.2618 1.28983 11.0021 1.28983C9.74241 1.28983 8.48272 1.7878 7.52192 2.78321C6.5835 3.75569 6.13493 4.99842 6.13493 6.25943ZM11.0021 15.4245C9.5487 13.9182 7.9327 12.4125 6.64169 10.9068C4.37968 8.2688 4.23322 4.36624 6.64169 1.87126C9.0499 -0.623713 12.9543 -0.623713 15.3627 1.87126C17.771 4.36624 17.6245 8.26855 15.3627 10.9068C14.0712 12.4125 12.4555 13.9182 11.0021 15.4245Z" />
  <path fillRule="evenodd" clipRule="evenodd" d="M12.5795 18.0675L11.9725 17.3536C12.4902 17.3753 12.9729 16.9123 13.4789 17.3268C14.2303 17.9425 15.0161 18.3836 16.7318 18.7048C17.0155 18.7579 16.5749 19.11 15.1399 18.9895C13.9329 18.8882 15.2361 19.2551 13.7188 19.1095C13.1914 19.0588 13.4736 19.1858 14.4377 19.3743C14.9208 19.4689 14.7502 19.9063 12.1244 19.7381C10.3431 19.6242 10.0059 19.6879 7.6668 19.7901C6.8813 19.8244 5.62807 19.4614 6.93177 19.1886C7.65014 19.0384 5.18149 18.8787 5.18149 18.6765C5.18149 18.4686 6.39741 18.2092 6.93824 18.0394C7.95698 17.7194 8.79942 17.2359 9.18086 16.9314C10.534 15.851 10.8476 17.1715 12.5795 18.0675Z" fill="white" />
  <path fillRule="evenodd" clipRule="evenodd" d="M20.2793 18.9596C21.3687 19.2665 22 19.631 22 20.022C22 21.1146 17.0749 22 11 22C4.92486 22 0 21.1146 0 20.022C0 19.631 0.631583 19.2665 1.72069 18.9596C1.16918 19.1696 0.862088 19.402 0.862088 19.6462C0.862088 20.5865 5.40104 21.3488 11 21.3488C16.599 21.3488 21.1379 20.5865 21.1379 19.6462C21.1379 19.402 20.8311 19.1696 20.2793 18.9596Z" />
  <path fillRule="evenodd" clipRule="evenodd" d="M18.4242 18.8438C19.2955 19.0473 19.8005 19.2889 19.8005 19.5478C19.8005 20.2717 15.8603 20.8586 11.0001 20.8586C6.13991 20.8586 2.19946 20.2717 2.19946 19.5478C2.19946 19.2889 2.70473 19.0473 3.57627 18.8438C3.1349 18.9831 2.88923 19.1369 2.88923 19.299C2.88923 19.9221 6.5206 20.427 11.0001 20.427C15.4797 20.427 19.111 19.9221 19.111 19.299C19.111 19.1369 18.8651 18.9831 18.4242 18.8438Z" />
</svg>`;
  return <SvgXml xml={xml} {...props} height={props.size} width={props.size} />;
});
