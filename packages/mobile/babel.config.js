module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['ts', '.tsx', '.json'],
        alias: {
          '~': './App',
          '/styled': './App/ui/styled',
          '/components': './App/ui/components',
          '/interfaces': './App/ui/interfaces',
          '/helpers': './App/ui/helpers',
          '/types': './App/types/',
          '/navigation': './App/ui/navigation',
          '/containers': './App/ui/containers',
          '/contexts': './App/ui/contexts',
          '/store': './App/ui/store',
          '/models': './App/ui/models',
          '/services': './App/ui/services',
          '/domain': './App/domain',
          '/data': './App/data',
          '/infra': './App/infra',
          '/presentation': './App/presentation',
          '/root': './',
        },
      },
    ],
  ],
};
