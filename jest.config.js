const { jsWithBabel: tsjPreset } = require('ts-jest/presets');

module.exports = {
    transformIgnorePatterns: ['node_modules/(?!(@jupyterlab/.*)/)'],
    transform: {
        ...tsjPreset.transform,
        "^.+\\.svg$": "<rootDir>/svgTransform.js"
    },
    preset: 'ts-jest/presets/js-with-babel',
    // moduleNameMapper: {
    //     '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    //     '\\.(gif|ttf|eot|svg)$': '@jupyterlab/testutils/lib/jest-file-mock.js'
    // },
    setupFiles: ['@jupyterlab/testutils/lib/jest-shim.js'],
    // setupFilesAfterEnv: ['@jupyterlab/testutils/lib/jest-script.js'],
    testPathIgnorePatterns: ['/dev_mode/', '/lib/', '/node_modules/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    // rootDir: path.resolve(path.join(baseDir, '..', '..')),
    reporters: ['default', 'jest-junit'],
    // collectCoverageFrom: [
    //     `packages/${name}/src/**.{ts,tsx}`,
    //     `!packages/${name}/src/*.d.ts`
    // ],
    coverageReporters: ['json', 'lcov', 'text', 'html'],
    // coverageDirectory: path.join(baseDir, 'coverage'),
    // testRegex: `tests\/test-${name}\/src\/.*\.spec\.tsx?$`,
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.test.json'
        }
    }
};
