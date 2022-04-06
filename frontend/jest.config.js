module.exports = {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/application/test'],
    testMatch: ['**/*.test.ts', '**/*.test.tsx'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    moduleNameMapper: {
      "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules"
    }
};