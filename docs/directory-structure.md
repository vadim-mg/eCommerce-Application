# Directory structure

- **.vscode** - vscode settings
- **dist** - build directory
- **docs** - for manuals and agreements
- **src** - project directory
  - **api** - for api
  - **assets** - common assets
      - **images**
      - **icons**
      - **fonts**
      - ...
  - **components** - for visual components (each component should has it's own directory, with same name, in directory there are: index.ts - file with export component's class, style.module.scss - component's styles, and all files needed for component)
    - **common** - common components which can be extended by othe components, for example base-element, base-page, base-form
      - **base-page** - base template for all pages
      - ...
    - **logic** - components with business logic
      - ...
    - **ui** - ui components: buttons, labels, inputs, and etc.
      - **button** - button component
      - ...
  - **pages** - contain site pages directories
      - **main**
      - **login**
      - ...
  - **constants** - contain files with constants
  - **router** - contains router
  - **store** - contains app store
  - **styles** - common styles for all project
  