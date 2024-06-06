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
    CTP_PROJECT_KEY: string;
    CTP_CLIENT_SECRET: string;
    CTP_CLIENT_ID: string;
    CTP_AUTH_URL: string;
    CTP_API_URL: string;
    CTP_SCOPES: string;
    LOCALE: string;
  }
}
