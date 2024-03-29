import React, { memo } from 'react';
import { SvgXml } from 'react-native-svg';

export const FamilyPlanningIcon = memo(props => {
  const xml = `
  <svg width="177" height="177" viewBox="0 0 177 177" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clipPath="url(#clip0)">
    <path d="M171.999 88.5C171.999 134.624 134.601 172 88.4496 172C42.2984 172 4.8999 134.624 4.8999 88.5C4.99937 42.3762 42.3978 5 88.5491 5C134.601 5 171.999 42.3762 171.999 88.5Z" fill="#FFDB00" />
    <path d="M171.999 88.5C171.999 134.624 134.601 172 88.4496 172C42.2984 172 4.8999 134.624 4.8999 88.5C4.99937 42.3762 42.3978 5 88.5491 5C134.601 5 171.999 42.3762 171.999 88.5Z" fill="#FFD943" />
    <g clipPath="url(#clip1)">
      <path d="M112.8 168.7C112.7 168.7 112.5 168.8 112.4 168.8C112.5 168.8 112.7 168.8 112.8 168.7Z" fill="#2F4358" />
      <path d="M27.2002 148.9C27.3002 149 27.4002 149.1 27.5002 149.2C27.4002 149.1 27.3002 149 27.2002 148.9Z" fill="#2F4358" />
      <path d="M94.6 92.3C94.8 91.6 95 91 95.3 90.5C95.9 89.4 96.7 88.6 97.5 88C98.1 87.6 98.6 87.3 99.2 87.1C99.9 86.8 100.7 86.6 101.3 86.5C102.1 86.4 102.7 86.4 102.9 86.4C103.1 86.4 103.5 86.4 104.2 86.5C104.8 86.6 105.6 86.8 106.5 87.1C107.1 87.3 107.7 87.6 108.2 88C109 88.5 109.7 89.3 110.2 90.2C110.5 90.7 110.8 91.4 111 92C111.2 92.8 111.3 93.6 111.3 94.6C111.3 94.8 111.3 95.1 111.3 95.3C111.2 97.9 110.5 100.1 109.6 101.8C108.7 103.5 107.5 104.7 106.4 105.6C105.6 106.2 104.8 106.5 104.1 106.7C103.7 106.8 103.3 106.9 102.9 106.9C102.6 106.9 102.3 106.9 102 106.8C101.7 106.7 101.4 106.6 101 106.5C100.4 106.2 99.7 105.8 99 105.3C97.7 104.3 96.4 102.7 95.5 100.5C94.9 99 94.5 97.3 94.4 95.3C94.4 95.1 94.4 94.8 94.4 94.6C94.3 93.7 94.4 92.9 94.6 92.3ZM106.7 49.2C106.9 48.3 107.2 47.4 107.6 46.7C108.4 45.2 109.4 44.1 110.6 43.2C111.4 42.7 112.2 42.3 112.9 41.9C113.9 41.5 114.9 41.3 115.7 41.1C116.8 41 117.6 41 117.9 41C118.1 41 118.8 41 119.6 41.1C120.5 41.2 121.6 41.5 122.7 41.9C123.5 42.2 124.3 42.6 125.1 43.2C126.1 43.9 127.1 44.9 127.9 46.2C128.3 46.9 128.7 47.8 129 48.7C129.3 49.8 129.4 50.9 129.4 52.2C129.4 52.5 129.4 52.8 129.4 53.2C129.2 56.8 128.3 59.7 127.1 62C125.9 64.3 124.3 66 122.7 67.1C121.6 67.9 120.6 68.4 119.6 68.7C119 68.9 118.5 69 117.9 69C117.5 69 117.1 68.9 116.6 68.9C116.2 68.8 115.7 68.7 115.3 68.5C114.4 68.1 113.5 67.6 112.6 66.9C110.8 65.5 109.1 63.3 107.9 60.4C107.1 58.4 106.6 56.1 106.4 53.4C106.4 53.1 106.4 52.8 106.4 52.4C106.4 51.1 106.5 50.1 106.7 49.2ZM91.8 88.7C91.9 88.7 91.9 88.7 91.8 88.7V88.7ZM84.6 106.6C86.7 101.4 88.9 96.1 91 90.9C90.9 91.1 90.9 91.3 90.8 91.5C90.6 92.5 90.5 93.5 90.5 94.6C90.5 94.9 90.5 95.2 90.5 95.5C90.6 97.9 91.1 100 91.9 101.9C92.1 102.3 92.3 102.7 92.5 103.1C91.9 103.1 91.3 103.3 90.7 103.5C89.6 103.9 88.7 104.6 88 105.4C87.3 106.2 86.8 107 86.4 108C85.9 109.2 85.3 110.3 84.8 111.5C84 110 83.9 108.4 84.6 106.6ZM64.2 81.5C65 82 65.7 82.8 66.3 83.7C66.6 84.2 66.9 84.9 67.1 85.5C67.3 86.3 67.4 87.1 67.4 88.1C67.4 88.3 67.4 88.6 67.4 88.8C67.3 91.4 66.6 93.6 65.7 95.3C64.8 97 63.6 98.2 62.5 99.1C61.7 99.7 61 100 60.2 100.2C59.8 100.3 59.4 100.4 59 100.4C58.7 100.4 58.4 100.4 58.1 100.3C57.8 100.2 57.5 100.1 57.1 100C56.4 99.7 55.8 99.3 55.1 98.8C53.8 97.8 52.5 96.2 51.6 94C51 92.5 50.6 90.8 50.5 88.8C50.5 88.6 50.5 88.3 50.5 88.1C50.5 87.3 50.6 86.6 50.7 85.9C50.9 85.2 51.1 84.6 51.4 84.1C52 83 52.8 82.2 53.6 81.6C54.2 81.2 54.7 80.9 55.3 80.7C56 80.4 56.8 80.2 57.4 80.1C58.2 80 58.8 79.9 59 79.9C59.2 79.9 59.6 79.9 60.3 80C60.9 80.1 61.7 80.3 62.6 80.6C63.1 80.8 63.6 81.1 64.2 81.5ZM28.8 49.2C29 48.3 29.3 47.4 29.7 46.7C30.5 45.2 31.6 44.1 32.7 43.2C33.5 42.7 34.3 42.3 35 42C36 41.6 37 41.4 37.8 41.2C38.9 41 39.7 41 40 41C40.2 41 40.9 41 41.7 41.1C42.6 41.2 43.7 41.5 44.8 41.9C45.6 42.2 46.4 42.6 47.2 43.2C48.2 43.9 49.2 44.9 50 46.2C50.4 46.9 50.8 47.8 51.1 48.7C51.4 49.8 51.5 50.9 51.5 52.2C51.5 52.5 51.5 52.8 51.5 53.2C51.3 56.8 50.4 59.7 49.2 62C48 64.3 46.4 66 44.8 67.1C43.7 67.9 42.7 68.4 41.7 68.7C41.1 68.9 40.6 69 40 69C39.6 69 39.2 68.9 38.7 68.9C38.3 68.8 37.8 68.7 37.4 68.5C36.5 68.1 35.6 67.6 34.7 66.9C32.9 65.5 31.2 63.3 30 60.4C29.2 58.4 28.7 56.1 28.5 53.4C28.5 53.1 28.5 52.8 28.5 52.4C28.5 51.1 28.6 50.1 28.8 49.2Z" fill="#2F4358" />
      <path d="M30 60.2C31.2 63.2 32.9 65.3 34.7 66.7C35.6 67.4 36.5 67.9 37.4 68.3C37.8 68.5 38.3 68.6 38.7 68.7C39.1 68.8 39.5 68.8 40 68.8C40.6 68.8 41.1 68.7 41.7 68.5C42.7 68.2 43.8 67.7 44.8 66.9C46.4 65.8 48 64.1 49.2 61.8C50.4 59.5 51.3 56.6 51.5 53C51.5 52.7 51.5 52.4 51.5 52C51.5 50.7 51.3 49.5 51.1 48.5C50.8 47.6 50.5 46.7 50 46C49.2 44.7 48.3 43.7 47.2 43C46.4 42.5 45.6 42 44.8 41.7C43.6 41.2 42.5 41 41.7 40.9C40.9 41 40.2 41 40 41C39.7 41 38.9 41 37.8 41.2C37 41.3 36 41.6 35 42C34.2 42.3 33.5 42.7 32.7 43.3C31.6 44.1 30.5 45.2 29.7 46.8C29.3 47.5 29 48.4 28.8 49.3C28.6 50.2 28.5 51.2 28.5 52.3C28.5 52.6 28.5 52.9 28.5 53.3C28.7 55.9 29.2 58.2 30 60.2Z" fill="#2F4358" />
      <path d="M46.8 161C46.4 156.4 45.9 151.9 45.5 147.3C44.4 146.7 43.3 146 42.4 145.1C41.2 143.9 40.4 142.5 39.9 140.8C39.6 139.7 39.5 138.6 39.5 137.5V137.3C39.5 135.5 39.5 133.7 39.5 131.9C39.5 130.5 39.5 129 39.5 127.5V123.7C39.5 121.1 39.5 118.4 39.5 115.8C39.5 113.9 39.5 112 39.5 110.1C39.5 107.9 40 105.7 41.2 103.9C42.3 102.1 44.1 100.7 46.2 99.9C47.5 99.4 48.9 99.2 50.3 99.2C49.5 98.1 48.8 96.9 48.2 95.5C47.5 93.6 47 91.5 46.8 89.1V89.2V89.1C46.8 88.8 46.8 88.5 46.8 88.2C46.8 87.1 46.9 86.1 47.1 85.1C47.3 84.1 47.7 83.2 48.1 82.3C49 80.6 50.2 79.3 51.5 78.4C52.3 77.8 53.2 77.4 54 77.1C55.1 76.7 56 76.4 56.8 76.3C57.9 76.1 58.7 76.1 59 76.1C59.3 76.1 60 76.1 60.8 76.2C61.3 76.3 61.8 76.4 62.4 76.5C62 74.7 61.1 73.2 59.5 71.8C57.5 70.1 55.2 69.7 52.6 69.5C49.7 69.3 47.9 70.1 46.4 72.7C44.5 76 42.2 79 40 82.2C37.8 79 35.5 76.1 33.7 73C32.1 70.2 30.1 69.4 27 69.6C21.1 69.9 17 73.8 17 79.8C17 93 17 106.3 17 119.6C17 124.7 19.4 127.8 24.1 129.5C24.7 129.7 25.4 130.6 25.4 131.2C25.7 133.8 26.2 139.6 26.6 143.8C32.4 150.6 39.2 156.4 46.8 161Z" fill="#2F4358" />
      <path d="M115.3 151C117.9 151 118.3 150.5 117.8 147.9C117.2 144.8 116.6 141.8 115.9 138.7C114.5 131.9 113.2 125.1 111.9 118.3C112 118.2 112.2 118.2 112.3 118.1C114.8 123.3 117.2 128.6 119.7 133.8C120.1 134.7 120.8 135.7 121.6 136.2C122.9 137.1 124.4 136.9 125.5 135.8C126.9 134.4 126.7 132.9 125.9 131.3C122.4 124.1 118.9 116.9 115.4 109.7C113.7 106.1 112.7 105.8 109.2 107.7C104.6 110.2 100.2 110.2 95.7 107.4C93 105.7 91.2 106.3 89.9 109.1C86.5 116.5 83.1 123.9 79.7 131.3C78.6 133.6 79.2 135.5 81 136.4C82.9 137.2 84.8 136.4 85.9 134.3C87 131.9 88.1 129.6 89.2 127.2C90.7 124.1 92.1 121 93.6 117.9C92.1 127.5 90.2 136.9 88.3 146.3C87.4 150.8 87.3 150.9 91.8 150.8C93.8 150.8 94.7 151.3 94.9 153.5C95.5 159.6 96.4 165.7 97.1 171.8C101.1 171.4 105 170.6 108.8 169.6C109.4 164.8 110 160 110.5 155.2C111 151.1 110.9 151.1 115.3 151Z" fill="#2F4358" />
      <path d="M95.3998 100.4C96.2998 102.6 97.5998 104.2 98.8998 105.2C99.5998 105.7 100.2 106.1 100.9 106.4C101.2 106.5 101.5 106.6 101.9 106.7C102.2 106.8 102.5 106.8 102.8 106.8C103.2 106.8 103.6 106.7 104 106.6C104.7 106.4 105.5 106 106.3 105.5C107.5 104.7 108.6 103.4 109.5 101.7C110.4 100 111 97.9 111.2 95.2C111.2 95 111.2 94.7 111.2 94.5C111.2 93.5 111.1 92.7 110.9 91.9C110.7 91.2 110.5 90.6 110.1 90.1C109.5 89.1 108.8 88.4 108.1 87.9C107.5 87.5 106.9 87.2 106.4 87C105.5 86.7 104.7 86.5 104.1 86.4C103.5 86.3 103 86.3 102.8 86.3C102.6 86.3 102 86.3 101.2 86.4C100.6 86.5 99.8998 86.7 99.0998 87C98.4998 87.2 97.9998 87.5 97.3998 87.9C96.5998 88.5 95.7998 89.3 95.1998 90.4C94.8998 91 94.6998 91.6 94.4998 92.2C94.2998 92.9 94.2998 93.6 94.2998 94.4C94.2998 94.6 94.2998 94.9 94.2998 95.1C94.4998 97.2 94.8998 98.9 95.3998 100.4Z" fill="#2F4358" />
      <path d="M107.9 60.2C109.1 63.2 110.8 65.3 112.6 66.7C113.5 67.4 114.4 67.9 115.3 68.3C115.7 68.5 116.2 68.6 116.6 68.7C117 68.8 117.4 68.8 117.9 68.8C118.5 68.8 119 68.7 119.6 68.5C120.6 68.2 121.7 67.7 122.7 66.9C124.3 65.8 125.9 64.1 127.1 61.8C128.3 59.5 129.2 56.6 129.4 53C129.4 52.7 129.4 52.4 129.4 52C129.4 50.7 129.2 49.5 129 48.5C128.7 47.6 128.4 46.7 127.9 46C127.1 44.7 126.2 43.7 125.1 43C124.3 42.5 123.5 42 122.7 41.7C121.5 41.2 120.4 41 119.6 40.9C118.7 41 118.1 41 117.9 41C117.6 41 116.8 41 115.7 41.2C114.9 41.3 113.9 41.6 112.9 42C112.1 42.3 111.4 42.7 110.6 43.3C109.5 44.1 108.4 45.2 107.6 46.8C107.2 47.5 106.9 48.4 106.7 49.3C106.5 50.2 106.4 51.2 106.4 52.3C106.4 52.6 106.4 52.9 106.4 53.3C106.5 55.9 107.1 58.2 107.9 60.2Z" fill="#2F4358" />
      <path d="M132.6 140.8C133.9 140.9 135.3 140.8 136.6 140.8C139.9 140.8 140.4 140.1 139.4 137C136.4 127.9 133.3 118.7 130.4 109.6C129.8 107.7 129.6 105.6 129.7 103.6C129.8 100.3 130.3 97 130.6 93.7C130.9 90.8 131.3 87.9 131.6 84.9C132.3 85.4 132.6 86 132.8 86.6C136.1 94.5 139.3 102.3 142.6 110.1C143.7 112.8 146.4 113.9 148.8 112.9C151.1 111.9 152.1 109.5 151 106.8C146.3 95.4 141.7 84 136.9 72.6C135.6 69.6 133 68.8 130.1 70.5C121.7 75.3 113.4 75.2 105 70.4C102.3 68.9 99.5998 69.7 98.2998 72.5C97.3998 74.6 96.5998 76.7 95.6998 78.8C94.3998 81.9 93.0998 85.1 91.7998 88.2C92.6998 86.7 93.7998 85.5 94.9998 84.7C95.7998 84.1 96.6998 83.7 97.4998 83.4C98.5998 83 99.4998 82.7 100.3 82.6C101.4 82.4 102.2 82.4 102.5 82.4C102.8 82.4 103.5 82.4 104.3 82.5C105.2 82.6 106.2 82.9 107.4 83.3C108.2 83.6 109.1 84 109.9 84.6C111.1 85.4 112.2 86.5 113 88C113.5 88.8 113.9 89.7 114.2 90.7C114.5 91.8 114.7 93 114.7 94.3C114.7 94.6 114.7 94.9 114.7 95.2V95.1V95.2C114.5 98.1 113.8 100.7 112.8 102.9C113.4 103 114 103.1 114.5 103.4C115.3 103.8 115.9 104.3 116.4 104.8C117.4 105.9 117.9 106.9 118.5 108.1C122 115.3 125.5 122.5 129 129.7C129.5 130.8 130 132 130 133.6C130 134.5 129.8 135.4 129.5 136.3C129.1 137.2 128.6 138 127.9 138.6C127.3 139.2 126.5 139.7 125.7 140.1C124.9 140.5 123.9 140.7 123 140.7C121.8 140.7 120.7 140.4 119.7 139.8C120.2 142.2 120.7 144.7 121.2 147.1C121.3 147.8 121.5 148.5 121.5 149.3C121.5 149.9 121.4 150.5 121.2 151.3C120.9 152.1 120.4 152.9 119.7 153.4C119.3 153.8 118.8 154 118.4 154.2C117.8 154.4 117.3 154.5 116.9 154.6C116.3 154.7 115.7 154.7 115.2 154.7C114.9 154.7 114.6 154.7 114.4 154.7C114.4 155 114.3 155.3 114.3 155.7C113.8 160 113.3 164.3 112.8 168.6C117.6 167.1 122.2 165.1 126.6 162.8C127.6 156.5 128.9 148.6 129.8 143.1C130 141.3 130.9 140.7 132.6 140.8Z" fill="#2F4358" />
      <path d="M70.4002 144.3C73.7002 142.9 75.2002 140.5 75.2002 137C75.2002 128.3 75.2002 119.7 75.2002 111C75.2002 105.8 72.4002 103 67.2002 102.9C61.6002 102.9 56.0002 102.9 50.4002 102.9C46.0002 102.9 43.3002 105.7 43.2002 110.1C43.2002 114.6 43.2002 119.2 43.2002 123.7C43.2002 128.2 43.2002 132.8 43.2002 137.3C43.2002 140.7 44.8002 142.9 47.8002 144.2C48.4002 144.5 49.0002 145.3 49.1002 146C49.7002 151.7 50.2002 157.5 50.8002 163.3C55.8002 165.9 61.1002 168.1 66.7002 169.6C67.5002 161.8 68.2002 153.9 69.1002 146.1C69.2002 145.4 69.8002 144.5 70.4002 144.3Z" fill="#2F4358" />
      <path d="M86.3999 107.8C86.7999 106.9 87.2999 106 87.9999 105.2C88.6999 104.4 89.5999 103.7 90.6999 103.3C91.2999 103.1 91.8999 103 92.4999 102.9C92.2999 102.5 92.0999 102.1 91.8999 101.7C91.1999 99.8 90.6999 97.7 90.4999 95.3C90.4999 95 90.4999 94.7 90.4999 94.4C90.4999 93.3 90.6 92.3 90.8 91.3C90.8 91.1 90.8999 90.9 90.9999 90.7C88.8999 95.9 86.6999 101.2 84.5999 106.4C83.8999 108.2 84 109.9 84.8 111.2C85.3 110.1 85.7999 109 86.3999 107.8Z" fill="#2F4358" />
      <path d="M58.8999 79.9C58.6999 79.9 58.0999 79.9 57.2999 80.1C56.6999 80.2 55.9999 80.4 55.1999 80.7C54.5999 80.9 54.0999 81.2 53.4999 81.6C52.6999 82.2 51.8999 83 51.2999 84.1C50.9999 84.7 50.7999 85.3 50.5999 85.9C50.3999 86.6 50.3999 87.3 50.3999 88.1C50.3999 88.3 50.3999 88.6 50.3999 88.8C50.4999 90.8 50.8999 92.5 51.4999 94C52.3999 96.2 53.6999 97.8 54.9999 98.8C55.6999 99.3 56.2999 99.7 56.9999 100C57.2999 100.1 57.5999 100.2 57.9999 100.3C58.2999 100.4 58.5999 100.4 58.8999 100.4C59.2999 100.4 59.6999 100.3 60.0999 100.2C60.7999 100 61.5999 99.6 62.3999 99.1C63.5999 98.3 64.6999 97 65.5999 95.3C66.4999 93.6 67.0999 91.5 67.2999 88.8C67.2999 88.6 67.2999 88.3 67.2999 88.1C67.2999 87.1 67.1999 86.3 66.9999 85.5C66.7999 84.8 66.5999 84.2 66.1999 83.7C65.5999 82.8 64.8999 82 64.0999 81.5C63.4999 81.1 62.8999 80.8 62.3999 80.6C61.4999 80.3 60.6999 80.1 60.0999 80C59.5999 79.9 59.0999 79.9 58.8999 79.9Z" fill="#2F4358" />
    </g>
  </g>
  <defs>
    <clipPath id="clip0">
      <rect x="5" y="5" width="167" height="167" fill="white" />
    </clipPath>
    <clipPath id="clip1">
      <rect x="17" y="41" width="134.6" height="131" fill="white" />
    </clipPath>
  </defs>
</svg>
  `;
  return <SvgXml xml={xml} {...props} />;
});
