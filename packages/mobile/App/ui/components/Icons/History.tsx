import React, { memo } from 'react';
import { SvgXml } from 'react-native-svg';

export const HistoryIcon = memo(props => {
  const xml = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path fillRule="evenodd" clipRule="evenodd" d="M3.09211 0H16.9079C17.9253 0 18.75 0.814028 18.75 1.81818V18.1818C18.75 19.186 17.9253 20 16.9079 20H3.09211C2.07474 20 1.25 19.186 1.25 18.1818V1.81818C1.25 0.814028 2.07474 0 3.09211 0ZM10.8929 6.24999C10.3997 6.24999 10 5.83026 10 5.3125C10 4.79473 10.3997 4.375 10.8929 4.375H15.3571C15.8503 4.375 16.25 4.79473 16.25 5.3125C16.25 5.83026 15.8503 6.24999 15.3571 6.24999H10.8929ZM7.65188 4.13318C7.42063 3.87371 7.01947 3.84791 6.75588 4.07556L5.06935 5.53211L4.78633 5.28768C4.52274 5.06003 4.12158 5.08583 3.89032 5.3453C3.65906 5.60478 3.68527 5.99966 3.94886 6.22731L4.65062 6.83337C4.8902 7.04028 5.2485 7.04028 5.48808 6.83337L7.59334 5.01519C7.85693 4.78754 7.88314 4.39265 7.65188 4.13318ZM10.8929 10.9376C10.3997 10.9376 10 10.5179 10 10.0001C10 9.48238 10.3997 9.06265 10.8929 9.06265H15.3571C15.8503 9.06265 16.25 9.48238 16.25 10.0001C16.25 10.5179 15.8503 10.9376 15.3571 10.9376H10.8929ZM7.65188 8.67878C7.42063 8.41931 7.01947 8.39351 6.75588 8.62115L5.06935 10.0777L4.78633 9.83327C4.52274 9.60563 4.12158 9.63143 3.89032 9.8909C3.65906 10.1504 3.68527 10.5453 3.94886 10.7729L4.65062 11.379C4.8902 11.5859 5.2485 11.5859 5.48808 11.379L7.59334 9.56078C7.85693 9.33313 7.88314 8.93825 7.65188 8.67878ZM10.8929 15.625C10.3997 15.625 10 15.2053 10 14.6875C10 14.1697 10.3997 13.75 10.8929 13.75H15.3571C15.8503 13.75 16.25 14.1697 16.25 14.6875C16.25 15.2053 15.8503 15.625 15.3571 15.625H10.8929ZM3.43201 14.5454C3.43201 15.0475 3.85092 15.4545 4.36768 15.4545H6.23902C6.75578 15.4545 7.1747 15.0475 7.1747 14.5454C7.1747 14.0433 6.75578 13.6363 6.23902 13.6363H4.36768C3.85092 13.6363 3.43201 14.0433 3.43201 14.5454Z" fill="#B8B8B8" />
    </svg>`;
  return <SvgXml xml={xml} {...props} />;
});
