# Project assignments

- framework: TypeScript without framework, using OOP.
- builder: webpack
- preprocessor: scss
- for style use css modules
- design: figma
- naming:
  - css: classes in lower case (.button .button_hidden .long-name-class)
  - file names: in lower case (build-client.ts)
  - directory names: in lower case
  - ts naming: in camelCase (const userName="Vadim")
  - class names: in PascalCase (class MyClass) - for class methods use arrow functions
  - interfaces: interface User (without I)
- import in TS:
  - import val1 from './script.ts'; // in same directory
  - import val2 from '@Src/.....'; // in other directory in src
  - import some from '@Assets/.....'; // from assets
  - import picture1 from '@Img/.....'; // from assets/img

## environments:

For exclude all problems wit environments, we can use the same versions of node and npm

(At the moment I use
node -v => v20.12.2
npm -v => 10.5.0
)

Also I for easy change versions I use [volta](https://docs.volta.sh/guide/getting-started)

If it installed, needed versions will be read from package.json and the same for everybody
