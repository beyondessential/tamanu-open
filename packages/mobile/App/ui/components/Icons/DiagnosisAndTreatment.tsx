import React, { memo } from 'react';
import { SvgXml } from 'react-native-svg';

export const DiagnosisAndTreatmentIcon = memo(props => {
  const xml = `
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_8000_22816)">
<path d="M59.0286 29.9999C59.0286 35.7432 57.3255 41.3576 54.1346 46.1331C50.9438 50.9085 46.4085 54.6305 41.1024 56.8284C35.7962 59.0263 29.9574 59.6013 24.3244 58.4809C18.6914 57.3604 13.5172 54.5947 9.45601 50.5335C5.39484 46.4724 2.62915 41.2981 1.50867 35.6651C0.388198 30.0321 0.963265 24.1933 3.16115 18.8872C5.35904 13.581 9.08104 9.04572 13.8565 5.85488C18.6319 2.66404 24.2463 0.960938 29.9896 0.960938C37.6912 0.960938 45.0774 4.02039 50.5233 9.46625C55.9691 14.9121 59.0286 22.2983 59.0286 29.9999Z" fill="#FFDA00"/>
<path d="M35.7732 39.0158C35.0438 41.4358 33.3879 48.2599 33.0076 50.8423C32.6273 53.4247 32.9212 53.9882 32.0811 54.2509C31.2411 54.5137 28.8696 53.9813 25.1187 52.9822C21.3678 51.9831 16.9567 49.8951 16.0855 49.1069C15.2143 48.3187 15.3941 43.2299 15.4529 42.5835C15.5116 41.937 17.8728 40.9621 17.8728 40.9621C30.0208 34.456 36.8345 24.2163 36.8345 24.2163C36.8897 24.128 36.9623 24.0517 37.0479 23.9923C37.1335 23.9328 37.2302 23.8915 37.3323 23.8706C37.7126 23.7635 39.8629 25.1601 40.5197 25.8895C41.1765 26.619 40.3503 27.3484 39.3512 29.4434C37.9856 32.5668 36.7912 35.7624 35.7732 39.0158ZM21.921 32.6169C21.921 32.6169 21.6306 34.456 21.2641 37.2182C21.9037 36.7342 22.8371 35.991 23.4662 35.4897C23.5388 34.985 23.6011 34.5425 23.6564 34.176C23.7117 33.8096 23.7601 33.4639 23.7947 33.253C23.7947 33.1458 23.8223 33.0629 23.8327 33.011C23.8431 32.9591 23.8327 32.9626 23.8327 32.9488V32.928C23.873 32.6731 23.8105 32.4127 23.6588 32.2039C23.5071 31.9952 23.2786 31.8552 23.0237 31.8149C22.7689 31.7745 22.5084 31.8371 22.2996 31.9888C22.0909 32.1405 21.9509 32.3689 21.9106 32.6238L21.921 32.6169ZM39.3409 49.6704C39.1749 49.5321 38.9952 49.3973 38.8258 49.2694C38.9606 46.9808 39.0125 44.713 39.0125 42.6008C39.0125 39.5966 38.9087 36.9071 38.805 34.9296C38.1586 36.5959 37.4222 38.8845 37.042 40.1152C37.042 40.9068 37.0662 41.7331 37.0662 42.5835C37.0662 44.3396 37.0281 46.203 36.9382 48.0871C36.3886 47.7932 35.8424 47.5339 35.3307 47.3092C35.1924 47.9488 35.0645 48.6091 34.9401 49.2659L35.2305 49.4042C35.7456 49.6496 36.2676 49.9262 36.7723 50.227C37.1306 50.438 37.4768 50.6688 37.8094 50.9184C38.2295 51.2212 38.6023 51.5847 38.9157 51.9969C39.0226 52.1439 39.1098 52.3043 39.1749 52.474C39.2249 52.5994 39.2507 52.7331 39.251 52.8681C39.25 53.0331 39.2097 53.1954 39.1334 53.3417C39.1334 53.3417 39.1334 53.3417 39.0816 53.3936C39.0294 53.4318 38.9724 53.4632 38.9122 53.4869C38.7392 53.551 38.5594 53.5951 38.3764 53.6183C38.1115 53.6522 37.8448 53.6683 37.5778 53.6667C36.7169 53.652 35.8587 53.5641 35.0127 53.4039L34.266 53.2622C34.1519 54.002 34.062 54.6623 33.9894 55.1912C34.2176 55.2396 34.4492 55.2811 34.6808 55.3226C35.637 55.4982 36.6058 55.5965 37.5778 55.6164C37.8978 55.6176 38.2176 55.5991 38.5354 55.5611C38.7686 55.5352 38.9997 55.4924 39.2268 55.4332C39.5611 55.3498 39.879 55.2108 40.1671 55.0218C40.317 54.9228 40.4551 54.8068 40.5785 54.6761C40.7082 54.5355 40.8155 54.3758 40.8965 54.2025C41.2372 53.524 41.304 52.7406 41.0832 52.0142C40.9269 51.5083 40.6719 51.0383 40.333 50.6314C40.0349 50.2791 39.7025 49.9571 39.3409 49.6704ZM17.6481 35.5277C17.8094 34.1628 18.0401 32.8071 18.3395 31.4657C18.4619 30.9189 18.6165 30.3798 18.8027 29.8513C18.8751 29.6499 18.9582 29.4526 19.0516 29.2601C19.1169 29.1232 19.1945 28.9925 19.2833 28.8695C19.4866 28.5916 19.7183 28.3355 19.9747 28.1055C20.5329 27.6111 21.1346 27.1679 21.7723 26.7815C22.7193 26.2034 23.7058 25.6928 24.7246 25.2535C25.1291 25.0771 25.4782 24.9354 25.741 24.8421L25.8101 24.9285C25.9968 25.1739 26.2319 25.4989 26.5015 25.8481C26.7055 26.1108 26.9267 26.3874 27.1687 26.6605C27.5295 27.0843 27.9339 27.469 28.3752 27.8082C28.6027 27.979 28.8472 28.1262 29.1046 28.2472C29.3787 28.3753 29.6718 28.4582 29.9723 28.4927H30.1694C30.3819 28.492 30.593 28.4581 30.7951 28.3924C31.1418 28.2793 31.466 28.1061 31.7527 27.8808C32.0045 27.6842 32.2414 27.4693 32.4614 27.2378C32.8752 26.7999 33.263 26.3381 33.623 25.855C34.1934 25.1221 34.7603 24.3373 35.31 23.6736C35.4414 23.5111 35.5693 23.359 35.7006 23.2138C35.1613 22.7679 33.7509 22.5224 33.7474 22.5224C33.6022 22.7022 33.457 22.8889 33.3118 23.0755C32.9661 23.5319 32.6204 23.9986 32.2747 24.4341C32.0258 24.7626 31.7804 25.0737 31.5453 25.3537C31.2634 25.7057 30.946 26.0278 30.5981 26.3148C30.5006 26.3925 30.3951 26.4597 30.2835 26.5153C30.2486 26.5317 30.2112 26.5423 30.1729 26.5464C30.0607 26.5324 29.9525 26.496 29.8548 26.4392C29.7052 26.3589 29.5639 26.2639 29.4331 26.1557C29.1308 25.9063 28.8519 25.6297 28.5999 25.3295C28.3925 25.091 28.1885 24.8352 27.9984 24.5863C27.8532 24.3996 27.7184 24.2198 27.5905 24.047C27.4626 23.8741 27.4038 23.7946 27.3139 23.6805L27.1238 23.4385C27.0754 23.3798 27.0304 23.3244 26.9786 23.2691L26.8645 23.1481C26.7883 23.0757 26.7062 23.0098 26.619 22.9511C26.5506 22.9065 26.4776 22.8695 26.4013 22.8405C26.2805 22.7914 26.1513 22.7668 26.021 22.7679H25.8827L25.7168 22.799L25.4471 22.8716C25.2673 22.9303 25.053 23.0064 24.8007 23.1032C23.5709 23.5891 22.3795 24.167 21.2365 24.8317C20.5604 25.219 19.9123 25.6534 19.2971 26.1315C18.6988 26.5847 18.1639 27.1161 17.7069 27.7114C17.5487 27.9293 17.4099 28.1607 17.292 28.4028C17.0519 28.9131 16.8553 29.4428 16.7043 29.9861C16.3946 31.1041 16.1545 32.2402 15.9853 33.3878C15.7018 35.1993 15.5186 37.0661 15.4045 38.4904C15.3319 39.4238 15.2869 40.167 15.2627 40.5646C15.8677 40.1809 16.732 39.69 17.292 39.3754C17.3404 38.3901 17.4579 36.9831 17.6481 35.5277ZM23.7151 10.734V10.6821H23.6356V9.80059L23.525 9.26129L23.6391 9.23709V8.85682H24.6485L24.7177 8.76003H24.5414V6.93818H26.5153V5.58994L33.8719 5.56574V6.90015H34.6773L34.7811 6.87595V6.90015H35.2028V8.3037L36.074 8.12048L36.2192 8.81188V8.87065L36.4543 9.98381L36.5061 10.2223L36.2226 10.2846C36.2226 10.3295 36.2572 10.371 36.2745 10.4194H36.7654V12.0165V12.2309H36.6133C36.6271 12.4176 36.634 12.6111 36.634 12.8117C36.634 12.988 36.634 13.1574 36.634 13.3579C36.5664 15.1144 36.1182 16.8353 35.3204 18.4016C34.7215 19.5645 33.8612 20.5726 32.8071 21.347C32.2658 21.7457 31.6601 22.0486 31.0164 22.2424C30.702 22.3352 30.3762 22.3841 30.0484 22.3876C29.8042 22.3852 29.5609 22.3574 29.3224 22.3046C29.0674 22.2457 28.8177 22.1659 28.5757 22.0661C28.0194 21.8356 27.4981 21.5284 27.027 21.1534C25.8072 20.161 24.8701 18.865 24.3098 17.3957C23.9656 16.5139 23.7254 15.5951 23.5942 14.6577L23.2968 14.7234L22.9235 12.9465L23.2139 12.8808L22.8025 10.931L23.7151 10.734ZM32.9143 12.2378L28.2611 12.2551L23.442 13.2749L23.6391 14.2048L32.9143 12.2378ZM34.7085 12.8082C34.7085 12.6319 34.7085 12.4625 34.6877 12.3069L25.5128 14.2498C25.6478 15.3785 25.9826 16.4741 26.5015 17.4855C26.9601 18.3826 27.619 19.162 28.4271 19.7637C28.7869 20.0295 29.1889 20.2328 29.6163 20.3652C29.7586 20.4095 29.9063 20.434 30.0553 20.4378C30.1566 20.4356 30.2574 20.4228 30.3561 20.3998C30.5051 20.3666 30.6508 20.3204 30.7917 20.2615C31.1795 20.0987 31.5426 19.8823 31.8703 19.6185C32.8226 18.8396 33.5515 17.8221 33.9825 16.6697C34.4037 15.5738 34.6442 14.4168 34.6946 13.2438C34.705 13.0951 34.7085 12.9499 34.7085 12.8082ZM33.5504 10.855L28.9733 11.8229L36.3678 11.7987V10.8446L33.5504 10.855ZM27.5974 8.84299H32.2505L34.629 8.31407L34.4319 7.38413L27.5974 8.84299ZM26.9544 6.0359V6.96929L33.4225 6.94855V6.01169L26.9544 6.0359ZM24.9804 7.37376V8.31407H28.0191L32.3024 7.40833L26.4981 7.42907V7.37722L24.9804 7.37376ZM24.0885 9.29932V10.2362H26.104L30.5981 9.28549L24.0885 9.29932ZM23.3971 11.3044L23.6391 12.4556L35.9461 9.84553L35.7041 8.6978L23.3971 11.3044ZM60.0069 29.9999C60.0077 36.9415 57.6015 43.6687 53.1983 49.035C48.7951 54.4014 42.6674 58.0749 35.8593 59.4297C29.0512 60.7845 21.9839 59.7367 15.8617 56.4649C9.73956 53.1931 4.94128 47.8996 2.2845 41.4866C-0.372281 35.0735 -0.723176 27.9376 1.2916 21.2948C3.30638 14.6521 7.56217 8.91341 13.3338 5.05672C19.1054 1.20002 26.0358 -0.536075 32.944 0.144246C39.8522 0.824566 46.3107 3.87921 51.2192 8.78768C54.008 11.5706 56.2195 14.8773 57.7264 18.5176C59.2333 22.1579 60.006 26.0601 60 29.9999H60.0069ZM58.0641 29.9999C58.0652 24.8904 56.6711 19.8775 54.0323 15.5021C51.3935 11.1267 47.61 7.55484 43.0902 5.17188C38.5703 2.78892 33.4856 1.6853 28.3845 1.98009C23.2835 2.27488 18.3598 3.95689 14.1445 6.84465C9.92923 9.73241 6.58246 13.7163 4.46523 18.3666C2.34799 23.0168 1.54067 28.1569 2.13034 33.2323C2.72002 38.3078 4.68432 43.1258 7.81132 47.1668C10.9383 51.2078 15.1093 54.3182 19.8744 56.1627C19.8744 55.6856 19.8502 55.1981 19.8502 54.6934C19.8502 54.0504 19.8502 53.3901 19.8779 52.716C20.5005 52.9841 21.1477 53.1914 21.8103 53.3348C21.8103 53.798 21.8103 54.2509 21.8103 54.6934C21.8103 55.447 21.8265 56.165 21.8587 56.8471C28.4771 58.8505 35.6015 58.3459 41.8714 55.4298C41.9302 54.7591 41.9924 54.0193 42.0615 53.2415C42.3104 50.2892 42.6043 46.8322 42.7529 44.8271C42.7944 44.2809 42.8152 43.6759 42.8152 43.0329C42.8152 41.5948 42.7115 39.9665 42.5524 38.3728C42.3934 36.7792 42.1687 35.2097 41.9371 33.8787C41.7815 32.9972 41.626 32.2228 41.4773 31.6282C41.3471 31.0788 41.1594 30.5446 40.9173 30.0345L41.9163 27.8912C42.5995 28.8819 43.0929 29.9908 43.3718 31.1615C43.5308 31.8183 43.6933 32.6273 43.8557 33.5434C44.0182 34.4595 44.1669 35.4759 44.3017 36.5406C44.5858 38.69 44.7393 40.8546 44.7615 43.0225C44.7615 43.7139 44.7407 44.3604 44.6923 44.9723C44.5126 47.2124 44.1703 51.2295 43.9041 54.3581C46.0767 53.1181 48.075 51.5952 49.8467 49.8294C52.4536 47.2276 54.5208 44.1365 55.9298 40.7336C57.3388 37.3307 58.0617 33.683 58.0572 29.9999H58.0641Z" fill="#2F4358"/>
</g>
<defs>
<clipPath id="clip0_8000_22816">
<rect width="60" height="60" fill="white"/>
</clipPath>
</defs>
</svg>

  `;
  return <SvgXml xml={xml} {...props} />;
});
