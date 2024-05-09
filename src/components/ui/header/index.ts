import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import logoSvg from '@Assets/icons/logo.svg';
import userSvg from '@Assets/icons/user.svg';
import basketSvg from '@Assets/icons/basket.svg';
import Button, { ButtonClasses } from '../button';

import classes from './style.module.scss';

type HeaderProps = Omit<ElementProps<HTMLElement>, 'tag'>;

export default class Header extends BaseElement<HTMLElement> {
  logoNavigationWrapper!: BaseElement<HTMLDivElement>;

  userActionsWrapper!: BaseElement<HTMLDivElement>;

  navigationList!: BaseElement<HTMLUListElement>;

  #isActiveUser: boolean = false;

  constructor(props: HeaderProps) {
    super({ tag: 'header', class: classes.header, ...props });
    this.#createContent();
  }

  #createContent = () => {
    this.logoNavigationWrapper = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.logoNavigationWrapper,
    });
    this.createLogoNavigationContent();

    this.userActionsWrapper = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.userActionsWrapper,
    });
    this.createUserActionsContent();

    this.node.append(this.logoNavigationWrapper.node);
    this.node.append(this.userActionsWrapper.node);
  };

  createUserActionsContent = () => {
    const basketIcon = new BaseElement<HTMLImageElement>({
      tag: 'img',
      class: classes.basketIcon,
      src: basketSvg,
    });
    const basketElement = new BaseElement<HTMLDivElement>(
      {
        tag: 'div',
      },
      basketIcon,
    );
    this.userActionsWrapper.node.append(basketElement.node);
    if (this.#isActiveUser === false) {
      const loginButton = new Button({ text: 'Log in' }, ButtonClasses.NORMAL, () =>
        console.log('Click!'),
      );
      const signinButton = new Button({ text: 'Sign in' }, ButtonClasses.NORMAL, () =>
        console.log('Click!'),
      );
      this.userActionsWrapper.node.append(loginButton.node);
      this.userActionsWrapper.node.append(signinButton.node);
    } else {
      const userProfile = new BaseElement<HTMLImageElement>({
        tag: 'img',
        class: classes.userIcon,
        src: userSvg,
      });
      const logoutButton = new Button({ text: 'Log out' }, ButtonClasses.NORMAL, () =>
        console.log('Click!'),
      );
      this.userActionsWrapper.node.append(userProfile.node);
      this.userActionsWrapper.node.append(logoutButton.node);
    }
  };

  createLogoNavigationContent = () => {
    const logoIcon = new BaseElement<HTMLImageElement>({
      tag: 'img',
      class: classes.logoIcon,
      src: logoSvg,
    });

    this.navigationList = new BaseElement<HTMLUListElement>({
      tag: 'ul',
      class: classes.navigationList,
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
