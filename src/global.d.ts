declare module '*.jpg';
declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';

declare module '*.module.scss' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    TEST_SECRET: string;
    TEST_SECRET2: string;
  }
}
