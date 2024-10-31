module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    collectCoverage: true,
    coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/tests/', '<rootDir>/dist/'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'], // Add dist here
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testMatch: ['**/?(*.)+(spec|test).+(ts|js)'],
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.json',
        },
    },
};