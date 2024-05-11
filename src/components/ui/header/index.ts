import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import logoSvg from '@Assets/icons/logo.svg';
import userSvg from '@Assets/icons/user.svg';
import basketSvg from '@Assets/icons/basket.svg';
import Button, { ButtonClasses } from '../button';

import classes from './style.module.scss';
import HamburgerSidebar from '../hamburger-sidedar';

type HeaderProps = Omit<ElementProps<HTMLElement>, 'tag'>;

interface StringKeyObject {
  [key: string]: string;
}

export const LinkPath: StringKeyObject = {
  LOGIN: '/login',
  LOGOUT: '/#',
  SINGUP: '/singup',
  REGISTRATION: '/registration',
  HOME: '/main',
  CATALOGUE: '/catalogue',
  ABOUT: '/about',
};

const mainNavItems: StringKeyObject = {
  HOME: 'Home',
  CATALOGUE: 'Catalogue',
  ABOUT: 'About shop',
};

const sidebarNavItems: StringKeyObject = {
  LOGIN: 'Login',
  SINGUP: 'Sing in',
  PROFILE: 'Profile',
  LOGOUT: 'Logout',
};

const createListLinks = (obj: StringKeyObject): BaseElement<HTMLUListElement> => {
  const list = new BaseElement<HTMLUListElement>({ tag: 'ul', class: classes.navigationList });
  const listLinksName = Object.keys(obj);

  listLinksName.forEach((name) => {
    const listItem = new BaseElement<HTMLLIElement>({
      tag: 'li',
    });
    const link = new BaseElement<HTMLLinkElement>({
      tag: 'a',
      href: LinkPath[name],
      textContent: obj[name],
    });
    listItem.node.append(link.node);
    list.node.append(listItem.node);
  });

  return list;
};

export default class Header extends BaseElement<HTMLElement> {
  logoNavigationWrapper!: BaseElement<HTMLDivElement>;

  userActionsWrapper!: BaseElement<HTMLDivElement>;

  buttonContainer!: BaseElement<HTMLDivElement>;

  navigationList!: BaseElement<HTMLUListElement>;

  navigationListBurger!: BaseElement<HTMLUListElement>;

  burgerButton!: BaseElement<HTMLDivElement>;

  hamburgerSidebar!: HamburgerSidebar;

  #isLoginedUser: boolean = true;

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

    this.createBurgerMenu();
    this.createBurgerButton();

    this.node.append(this.logoNavigationWrapper.node);
    this.node.append(this.userActionsWrapper.node);
    this.node.append(this.burgerButton.node);
  };

  createUserActionsContent = () => {
    this.createBasketElement();
    this.createButtonContainer();
  };

  createBasketElement = () => {
    const basketIcon = new BaseElement<HTMLImageElement>({
      tag: 'img',
      class: classes.basketIcon,
      src: basketSvg,
    });
    const basketElement = new BaseElement<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.basket,
      },
      basketIcon,
    );
    this.userActionsWrapper.node.append(basketElement.node);
  };

  createButtonContainer = () => {
    this.buttonContainer = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.buttonContainer,
    });
    if (this.#isLoginedUser === false) {
      const loginButton = new Button({ text: 'Log in' }, ButtonClasses.NORMAL, () =>
        console.log('Click!'),
      );
      const signinButton = new Button({ text: 'Sign in' }, ButtonClasses.NORMAL, () =>
        console.log('Click!'),
      );
      this.buttonContainer.node.append(loginButton.node);
      this.buttonContainer.node.append(signinButton.node);
    } else {
      const userProfile = new BaseElement<HTMLImageElement>({
        tag: 'img',
        class: classes.userIcon,
        src: userSvg,
      });
      const logoutButton = new Button({ text: 'Log out' }, ButtonClasses.NORMAL, () =>
        console.log('Click!'),
      );
      this.buttonContainer.node.append(userProfile.node);
      this.buttonContainer.node.append(logoutButton.node);
    }
    this.userActionsWrapper.node.append(this.buttonContainer.node);
  };

  createLogoNavigationContent = () => {
    const logoIcon = new BaseElement<HTMLImageElement>({
      tag: 'img',
      class: classes.logoIcon,
      src: logoSvg,
    });

    this.navigationList = createListLinks(mainNavItems);

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

  createBurgerButton = () => {
    this.burgerButton = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.burgerButton,
    });

    let i = 0;
    while (i < 3) {
      const burgerBtnLine = new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.burgerBtnLine,
      });
      this.burgerButton.node.append(burgerBtnLine.node);
      i += 1;
    }
    this.burgerButton.node.addEventListener('click', this.hamburgerSidebar.openSidebar);
  };

  createBurgerMenu = () => {
    const burgerLinksName = Object.assign(mainNavItems, sidebarNavItems);
    this.navigationListBurger = createListLinks(burgerLinksName);
    this.hamburgerSidebar = new HamburgerSidebar(
      { class: classes.mobileMenu },
      this.navigationListBurger,
    );
    this.node.append(this.hamburgerSidebar.node);
  };
}
