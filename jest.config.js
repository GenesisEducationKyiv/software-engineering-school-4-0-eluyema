module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.', // Ensures that Jest looks from the root of the project
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1', // Maps all imports starting with src/ to the correct directory
  },
  collectCoverageFrom: ['src/**/*.(t|j)s', '!src/**/*.d.ts', '!node_modules/'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};
