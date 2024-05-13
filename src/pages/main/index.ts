import BaseElement from '@Src/components/common/base-element';
import tag from '@Src/components/common/tag';
import Link from '@Src/components/ui/link';
import ContentPage from '@Src/components/common/content-page';
import CheckBox from '@Src/components/ui/checkbox';
import State from '@Src/state';
import classes from './style.module.scss';

export default class MainPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'div', title: 'Main page' });
    this.#createContent();
    this.#showContent();
  }

  #createContent = () => {
    const tempAuthCheckbox = new CheckBox(
      { class: classes.isLoggedIn },
      'isLoggedIn',
      State.getInstance().isLoggedIn,
    );
    tempAuthCheckbox.node.addEventListener('input', (event) => {
      // temporary auth state checker
      State.getInstance().isLoggedIn = (event.target as HTMLInputElement).checked;
    });

    this.#content = tag<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.main,
      },
      tag<HTMLHeadingElement>({ tag: 'h1', text: 'MainPage' }),
      new Link({ text: 'login', href: 'login' }),
      new Link({ text: 'registration', href: 'registration' }),
      new Link({ text: 'rs.school', href: 'https://rs.school', target: '_blank' }),
      new Link({ text: 'example', href: 'hiddenExample' }),
      new BaseElement({ tag: 'br' }),
      tempAuthCheckbox,
    );
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
