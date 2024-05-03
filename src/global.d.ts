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

