import BaseElement, { ElementProps } from '@Src/components/common/base-element';

import logoSvg from '@Assets/icons/logo.svg';
import classes from './style.module.scss';

type HeaderProps = Omit<ElementProps<HTMLElement>, 'tag'>;

export default class Header extends BaseElement<HTMLElement> {
  logoNavigationWrapper!: BaseElement<HTMLDivElement>;

  userActionsWrapper!: BaseElement<HTMLDivElement>;

  navigationList!: BaseElement<HTMLUListElement>;

  constructor(props: HeaderProps) {
    super({ tag: 'header', class: classes.header, ...props });
    this.#createContent();
  }

  #createContent = () => {
    this.logoNavigationWrapper = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: '',
    });
    this.createLogoNavigationContent();

    this.userActionsWrapper = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: '',
    });

    this.node.append(this.logoNavigationWrapper.node);
    this.node.append(this.userActionsWrapper.node);
  };

  createLogoNavigationContent = () => {
    const logoIcon = new BaseElement<HTMLImageElement>({
      tag: 'img',
      src: logoSvg,
    });

    this.navigationList = new BaseElement<HTMLUListElement>({
      tag: 'ul',
      class: '',
    });
    this.createListItems();

    const navigation = new BaseElement<HTMLElement>(
      {
        tag: 'nav',
        class: '',
      },
      this.navigationList,
    );

    this.logoNavigationWrapper.node.append(logoIcon.node);
    this.logoNavigationWrapper.node.append(navigation.node);
  };

  createListItems = () => {
    let i = 0;
    const itemNames = ['Home', 'Catalogue', 'About shop'];
    while (i < 3) {
      const listItem = new BaseElement<HTMLLIElement>({
        tag: 'li',
        textContent: itemNames[i],
      });
      this.navigationList.node.append(listItem.node);
      i += 1;
    }
  };
}
