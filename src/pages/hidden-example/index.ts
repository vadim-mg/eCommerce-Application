import BaseElement from '@Src/components/common/base-element';
import BasePage from '@Src/components/common/base-page';
import tag from '@Src/components/common/tag';
import CheckBox from '@Src/components/ui/checkbox';

import Button, { ButtonClasses } from '@Src/components/ui/button';
import InputText, { InputsPatterns } from '@Src/components/ui/input-text';

// imports pictures for example
import imageBoard from '@Img/board-game-example-image.webp';
import imageSvg from '@Assets/icons/favicon.svg';
import basketSvg from '@Assets/icons/basket.svg';

// import api for example
import categoriesApi from '@Src/api/categories';

import Select from '@Src/components/ui/select';
import classes from './style.module.scss';

export default class HiddenExamplePage extends BasePage {
  #content!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'div', title: 'Hidden Example page' });
    this.#createContent();
    this.#showContent();
    this.#showCategories();
  }

  #createContent = () => {
    this.#content = new BaseElement<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.hiddenExample,
      },

      // variant1 use class BaseElement<T>
      new BaseElement<HTMLDivElement>({ tag: 'h1', text: 'Hello' }),
      new BaseElement<HTMLParagraphElement>({ tag: 'p', text: 'This is hidden example page' }),
      new BaseElement<HTMLOListElement>(
        { tag: 'ol' },
        new BaseElement({ tag: 'li', text: 'one', class: classes.listItem }),
        new BaseElement<HTMLLIElement>({ tag: 'li', text: 'two' }),
        new BaseElement<HTMLLIElement>({ tag: 'li', text: 'three', title: 'dfdfd' }),
      ),
      new Button({ text: 'Buy' }, ButtonClasses.NORMAL, () => console.log('Click!'), basketSvg),
      new Button({ text: 'Category' }, ButtonClasses.CATEGORY, () => console.log('Click!')),
      new Button(
        { text: 'Category' },
        [ButtonClasses.CURRENT_CATEGORY, ButtonClasses.CATEGORY],
        () => console.log('Click!'),
      ),
      new Button({ text: 'Button' }, ButtonClasses.BIG, () => console.log('Click!')),
      new Button({ text: 'Button' }, ButtonClasses.BIG, () => console.log('Click!'), basketSvg),
      new InputText(false, 'test', 'placeholder', InputsPatterns.TEXT, 'Label'),
      new InputText(false, 'test', 'placeholder', InputsPatterns.TEXT),

      // more short variant, use function Tag. Result is equivalent!
      tag({ tag: 'h1', text: 'Hello' }),
      tag({ tag: 'p', text: 'This is hidden example page' }),
      tag(
        { tag: 'ol' },
        tag({ tag: 'li', text: 'one', class: classes.listItem }),
        tag({ tag: 'li', text: 'two' }),
        tag({ tag: 'li', text: 'three', title: 'title props' }),
      ),

      // the same what was in component 'example' on branch 'test'
      tag({ tag: 'div', text: 'example', class: classes.example }),
      tag({ tag: 'div', text: 'example2 - google font', class: classes.example3 }),
      tag<HTMLImageElement>({ tag: 'img', src: imageBoard, class: classes.example2 }),
      tag<HTMLImageElement>({ tag: 'img', src: imageSvg, class: classes.imageExample }),
      new CheckBox({}, 'example', 'example'),
    );
  };

  // exapmle of using SDK for get categories by API
  #showCategories = () => {
    categoriesApi
      .getCategories()
      .then((resp) => {
        const categoryList = resp.body.results.map((category) => category.name['en-GB']);

        const selectCategory1 = new Select('Select category', categoryList, (selectedValue) => {
          console.log(`selected value: ${selectedValue}`);
        });
        this.#content.node.append(selectCategory1.node);
        const category1 = categoryList[0];
        console.log(category1);
        selectCategory1.selectedValue = category1;

        const selectCategory2 = new Select('', categoryList, (selectedValue) => {
          console.log(`selected value: ${selectedValue}`);
        });
        this.#content.node.append(selectCategory2.node);
        const category2 = categoryList[2];
        selectCategory2.selectedValue = category2;

        console.log('resp.body.results');
        console.log(resp.body.results);
        this.#content.node.append(
          tag({ tag: 'ul', text: `categories` }).node,
          ...categoryList.map(
            (categoryName: string) => tag({ tag: 'li', text: `${categoryName}` }).node,
          ),
        );
      })
      .catch(console.error);
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
