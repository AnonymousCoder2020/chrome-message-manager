module.exports = {
  bail: true,
  verbose: true,
  moduleFileExtensions: ['ts', 'js', 'jsx', 'tsx'],
  moduleNameMapper: {
    '^~(.+)': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.jsx?$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest',
    '^.+\\.svg$': 'jest-svg-transformer',
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  testMatch: ['<rootDir>/src/lib/*/*.test.ts', '**/tests/**/*.test.ts'],
  transformIgnorePatterns: ['/node_modules/(?!next-ts-utility|lodash-es)/'],
  moduleDirectories: [
    'node_modules', //これは必須です
  ],
  testEnvironment: 'node',
}
