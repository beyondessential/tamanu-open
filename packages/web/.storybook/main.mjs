import { mergeConfig } from 'vite';
import path from 'path';

export default {
  framework: '@storybook/react-vite',
  stories: ['../**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    reactDocgen: false,
  },
  features: {
    storyStoreV7: false,
  },
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: { docs: false }, // no mdx
    },
    '@storybook/addon-links',
  ],
  async viteFinal(config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      define: {
        process: JSON.stringify({
          env: {
            NODE_ENV: process.env.NODE_ENV,
            STORYBOOK: true,
          },
          arch: 'wasm',
          platform: 'web',
        }),
      },
      resolve: {
        alias: {
          '/@react-refresh': path.resolve(__dirname, './__mocks__/react-refresh.js'),
          buffer: path.resolve(__dirname, './__mocks__/buffer.js'),
          sequelize: path.resolve(__dirname, './__mocks__/sequelize.js'),
          config: path.resolve(__dirname, './__mocks__/config.js'),
          yargs: path.resolve(__dirname, './__mocks__/module.js'),
          child_process: path.resolve(__dirname, './__mocks__/module.js'),
        },
      },
    });
  },
};
