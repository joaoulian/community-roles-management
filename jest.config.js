module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testEnvironment: 'node',
  testRegex: './src/.*\\.(test|spec)?\\.(ts|ts)$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/shared/core/$1',
    '@utils/(.*)': '<rootDir>/src/shared/utils/$1',
    '@activity/(.*)': '<rootDir>/src/contexts/activity/$1',
    '@group/(.*)': '<rootDir>/src/contexts/group/$1',
  },
};
