# All about tests in our project

1. use [Jest](https://jestjs.io/ru/docs/tutorial-jquery) with TS (use [ts-jest](https://kulshekhar.github.io/ts-jest/docs/))
2. config in jest.config.ts
3. tests for each module write in tests folder in the same directory
4. testEnvironment: [jsdom](https://github.com/jsdom/jsdom)
5. mock functions should be in `__mocks__` directories
6. set [mocking css modules](https://jestjs.io/ru/docs/webpack#%D0%BC%D0%BE%D0%BA%D0%B8%D0%BD%D0%B3-css-%D0%BC%D0%BE%D0%B4%D1%83%D0%BB%D0%B5%D0%B9)
