import baseConfig, { nodemon } from '../../common.webpack.config.mjs';

export default {
  ...baseConfig,
  devtool: 'eval',
  mode: 'development',
  plugins: [
    nodemon({
      args: process.env.TAMANU_ARGS ? process.env.TAMANU_ARGS.split(' ') : null,
    }),
  ],
};
