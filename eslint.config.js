import globals from 'globals';
import js from '@eslint/js';
import markdown from 'eslint-plugin-markdown';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

const JS_EXTS = '{js,jsx,mjs,cjs,ts,tsx}';
const TS_EXTS = '{ts,tsx}';
const EXTS = `{${JS_EXTS},${TS_EXTS}}`;

export default [
  {
    files: [`packages/**/*.${TS_EXTS}`, `scripts/**/*.${TS_EXTS}`],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
    },
  },
  {
    files: [`packages/**/*.${JS_EXTS}`, `scripts/**/*.${JS_EXTS}`, `**/*.config.${JS_EXTS}`],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // import rules
      'no-useless-rename': 'error',
      'no-duplicate-imports': 'error',
      'sort-imports': 'off',

      // static analysis rules
      'no-constructor-return': 'error',
      'no-new-native-nonconstructor': 'error',
      'no-promise-executor-return': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unreachable-loop': 'error',
      'no-unused-private-class-members': 'error',
      'no-unused-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react/jsx-key': 'error',
      'require-atomic-updates': 'error',

      // https://eslint.org/blog/2022/07/interesting-bugs-caught-by-no-constant-binary-expression/
      'no-constant-binary-expression': 'error',

      // overrides for react
      'react/prop-types': 'off',
      'react/display-name': 'off',
    },
  },
  {
    // mobile rule exclusions (as warnings, until we fix them)
    files: [`packages/mobile/**/*.${TS_EXTS}`],
    rules: {
      'no-unused-vars': 'off',
      "@typescript-eslint/no-unused-vars": [
        'error',
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_",
        },
      ],
      'no-constructor-return': 'warn',
      'no-promise-executor-return': 'warn',
      'require-atomic-updates': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
      'react/jsx-key': 'warn',
    },
  },
  {
    files: [`**/*.${TS_EXTS}`],
    rules: {
      // Disable rules that are incompatible with or better handled by TypeScript
      ...typescriptPlugin.configs['eslint-recommended'].overrides[0].rules,

      // for ts multiple dispatch
      'no-dupe-class-members': 'off',
    },
  },
  {
    files: [
      `packages/*/__{mocks,tests}__/**/*.${EXTS}`,
      `packages/mobile/e2e/**/*.${EXTS}`,
      `packages/shared/src/test-helpers/**/*.${EXTS}`,
      `**/jest.*.${EXTS}`,
      `**/*.{spec,test}.${EXTS}`,
    ],
    languageOptions: {
      globals: globals.jest,
    },
  },
  {
    files: [`packages/mobile/e2e/**/*.${JS_EXTS}`],
    languageOptions: {
      globals: globals.jasmine,
    },
  },
  {
    // react-native globals
    files: [`packages/mobile/**/*.${TS_EXTS}`],
    languageOptions: {
      globals: {
        __DEV__: 'readonly',
        Element: 'readonly',
        FlatListProps: 'readonly',
        JSX: 'readonly',
        NodeJS: 'readonly',
        React: 'readonly',
        StyleProp: 'readonly',
        TextInputProps: 'readonly',
        TextStyle: 'readonly',
        ViewStyle: 'readonly',
      },
    },
  },
  {
    files: [`packages/web/**/*.${EXTS}`],
    languageOptions: {
      globals: {
        __VERSION__: 'readonly',
      },
    },
  },
  {
    files: [`packages/web/**/*.${JS_EXTS}`, 'packages/qr-tester/www/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        CryptoKeyPair: 'readonly',
      },
    },
  },
  {
    files: [
      `packages/!({web,qr-tester})/**/*.${JS_EXTS}`,
      `scripts/**/*.${JS_EXTS}`,
      `**/*.config.${JS_EXTS}`,
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        CryptoKeyPair: 'readonly',
      },
    },
  },
  {
    files: ['packages/qr-tester/www/js/**/*.js'],
    languageOptions: {
      globals: {
        X509: 'readonly',
        KEYUTIL: 'readonly',
      },
    },
  },
  {
    files: ['**/*.md'],
    ignores: ['AddAliases.md'],
    plugins: {
      markdown,
    },
    processor: 'markdown/markdown',
    settings: {
      sharedData: 'Hello',
    },
  },
  {
    // https://eslint.org/docs/latest/use/configure/configuration-files-new#globally-ignoring-files-with-ignores
    ignores: [
      // catch-all for non-js processed files
      '**/*.md',

      // generated files
      '**/dist/**/*',
      '**/__disttests__/**/*',
      '**/build/**/*',
      '**/vendor/**/*',
      '**/*.d.ts',

      // templates
      '**/.migrationTemplate.ts',

      // local config
      '**/config/local.*',
      '!**/config/local.example',
    ],
  },
];
