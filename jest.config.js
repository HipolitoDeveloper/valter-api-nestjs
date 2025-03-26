module.exports = {
  testEnvironment: 'node',
  coverageReporters: ['text'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  clearMocks: true,
  testRegex: '\\.unit\\.test\\.ts$',
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
};
