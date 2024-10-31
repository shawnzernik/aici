module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',  // Use the Node.js environment
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    collectCoverage: true,
    coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/tests/'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testMatch: ['**/?(*.)+(spec|test).+(ts|js)'],
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.json',
        },
    },
};