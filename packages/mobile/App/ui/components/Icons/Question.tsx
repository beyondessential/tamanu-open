import React, { memo } from 'react';
import { SvgXml } from 'react-native-svg';
import { IconWithSizeProps } from '../../interfaces/WithSizeProps';

export const QuestionIcon = memo((props: IconWithSizeProps) => {
  const xml = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clipPath="url(#clip0)">
    <path d="M19.9215 18.1115L18.5485 14.1157C19.2089 12.7808 19.5582 11.2929 19.5605 9.79567C19.5645 7.21747 18.567 4.77962 16.7516 2.93135C14.9359 1.08272 12.5164 0.0421715 9.93889 0.00127311C8.58846 -0.0204065 7.27807 0.228421 6.04213 0.740022C4.85007 1.2335 3.78105 1.9483 2.8648 2.86455C1.94851 3.7808 1.23371 4.84982 0.74027 6.04189C0.22867 7.27782 -0.0198845 8.58887 0.00148263 9.93864C0.0423029 12.5162 1.08289 14.9357 2.93152 16.7514C4.7762 18.5632 7.20776 19.5604 9.78041 19.5604C9.78545 19.5604 9.79076 19.5604 9.7958 19.5604C11.293 19.558 12.7809 19.2088 14.1159 18.5484L18.1117 19.9214C18.2654 19.9742 18.4229 19.9999 18.5786 19.9999C18.9487 19.9999 19.3087 19.8546 19.5817 19.5815C19.9695 19.1937 20.0998 18.6304 19.9215 18.1115ZM18.7432 18.7431C18.7039 18.7824 18.6196 18.8421 18.497 18.8L14.2628 17.3451C14.2002 17.3236 14.1351 17.3129 14.0702 17.3129C13.9745 17.3129 13.8792 17.336 13.7929 17.3817C12.5692 18.0291 11.1864 18.3725 9.79392 18.3746C5.12401 18.3821 1.26105 14.589 1.18707 9.91985C1.14984 7.57067 2.04343 5.36283 3.70323 3.70302C5.36304 2.04326 7.57022 1.14983 9.92006 1.18697C14.5892 1.261 18.382 5.12205 18.3747 9.79383C18.3725 11.1863 18.0292 12.5691 17.3818 13.7928C17.3052 13.9376 17.292 14.1077 17.3452 14.2627L18.8001 18.4968C18.8423 18.6194 18.7826 18.7038 18.7432 18.7431Z" />
    <path d="M9.68397 14.1698C9.37385 14.1698 9.07674 14.4425 9.09107 14.7627C9.10545 15.0839 9.35158 15.3556 9.68397 15.3556C9.99409 15.3556 10.2912 15.0829 10.2769 14.7627C10.2625 14.4414 10.0164 14.1698 9.68397 14.1698Z" />
    <path d="M9.68406 4.98726C8.05753 4.98726 6.73425 6.31054 6.73425 7.93706C6.73425 8.26448 6.99972 8.52995 7.32714 8.52995C7.65456 8.52995 7.92003 8.26448 7.92003 7.93706C7.92003 6.96441 8.7114 6.17304 9.68406 6.17304C10.6567 6.17304 11.4481 6.96441 11.4481 7.93706C11.4481 8.90972 10.6567 9.70109 9.68406 9.70109C9.35663 9.70109 9.09117 9.96655 9.09117 10.294V12.7121C9.09117 13.0396 9.35663 13.305 9.68406 13.305C10.0115 13.305 10.2769 13.0396 10.2769 12.7121V10.827C11.6203 10.5518 12.6339 9.36058 12.6339 7.93706C12.6339 6.31054 11.3106 4.98726 9.68406 4.98726Z" />
  </g>
  <defs>
    <clipPath id="clip0">
      <path d="M0 0H20V20H0V0Z" fill="white" />
    </clipPath>
  </defs>
</svg>
  `;
  return <SvgXml xml={xml} {...props} height={props.size} width={props.size} />;
});