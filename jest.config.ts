import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    roots: ["<rootDir>/test"],
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
        "^.+\\.jsx?$": "babel-jest",
    },
    // Set a different `tsconfig.json` for testing
    // globals: {
    //     "ts-jest": {
    //       "tsconfig": 'tsconfig.test.json'
    //     }
    // }
};

export default config;
