'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

const config = configs.ember();

module.exports = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ['**/*.gts'],
      plugins: ['ember'],
      parser: 'ember-eslint-parser',
    },
    {
      files: ['**/*.gjs'],
      plugins: ['ember'],
      parser: 'ember-eslint-parser',
    },
    {
      files: ['**/*.ts'],
      rules: {
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
