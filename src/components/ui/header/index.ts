import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import logoSvg from '@Assets/icons/logo.svg';
import userSvg from '@Assets/icons/user.svg';
import basketSvg from '@Assets/icons/basket.svg';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import HamburgerSidebar from '@Src/components/ui/hamburger-sidedar';
import Link from '@Src/components/ui/link';
import State from '@Src/state';

import classes from './style.module.scss';

type HeaderProps = Omit<ElementProps<HTMLElement>, 'tag'>;

interface StringKeyObject {
  [key: string]: string;
}

export const LinkPath: StringKeyObject = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  SINGIN: 'registration',
  REGISTRATION: 'registration',
  HOME: 'main',
  CATALOGUE: 'catalogue',
  ABOUT: 'about',
  PROFILE: 'profile',
};

const mainNavItems: StringKeyObject = {
  HOME: 'Home',
  CATALOGUE: 'Catalogue',
  ABOUT: 'About shop',
};

const sidebarNavItems: StringKeyObject = {
  LOGIN: 'Login',
  SINGIN: 'Sing in',
  PROFILE: 'Profile',
  LOGOUT: 'Logout',
};


export default class Header extends BaseElement<HTMLElement> {
  logoNavigationWrapper!: BaseElement<HTMLDivElement>;

  userActionsWrapper!: BaseElement<HTMLDivElement>;

  buttonContainer!: BaseElement<HTMLDivElement>;

  navigationList!: BaseElement<HTMLUListElement>;

  navigationListBurger!: BaseElement<HTMLUListElement>;

  burgerButton!: BaseElement<HTMLDivElement>;

  hamburgerSidebar!: HamburgerSidebar;

  loginButton!: Button;

  signinButton!: Button;

  logoutButton!: Button;

  userProfileIco!: Link;

  loginLink!: Link;

  signinLink!: Link;

  logoutLink!: Link;

  userProfileLink!: Link;

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
    this.#changeNavView();
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
    this.loginButton = new Button({ text: 'Log in' }, ButtonClasses.NORMAL, () => {
      window.location.href = LinkPath.LOGIN;
    });
    this.signinButton = new Button({ text: 'Sign in' }, ButtonClasses.NORMAL, () => {
      window.location.href = LinkPath.SINGIN;
    });
    this.buttonContainer.node.append(this.loginButton.node);
    this.buttonContainer.node.append(this.signinButton.node);

    this.userProfileIco = new Link({
      href: LinkPath.PROFILE,
      class: classes.linkUserIcon
    },);
    const userProfileIcoSVG = new BaseElement<HTMLImageElement>({
      tag: 'img',
      class: classes.userIcon,
      src: userSvg,
    });
    this.userProfileIco.node.append(userProfileIcoSVG.node);


    this.logoutButton = new Button({ text: 'Log out' }, ButtonClasses.NORMAL, () => {
      // there need a callback for unlogging, now it is testing exemple
      State.getInstance().isLoggedIn = !State.getInstance().isLoggedIn;
      // after unlogging change button
      this.#changeNavView();
    });
    this.buttonContainer.node.append(this.userProfileIco.node);
    this.buttonContainer.node.append(this.logoutButton.node);

    this.userActionsWrapper.node.append(this.buttonContainer.node);
  };

  #changeNavView() {
    if (State.getInstance().isLoggedIn) {
      this.userProfileIco.node.classList.add(classes.hidden);
      this.userProfileLink.node.classList.add(classes.hidden);
      this.logoutButton.node.classList.add(classes.hidden);
      this.logoutLink.node.classList.add(classes.hidden);
      if (this.loginButton.node.classList.contains(classes.hidden)) {
        this.loginButton.node.classList.remove(classes.hidden);
        this.signinButton.node.classList.remove(classes.hidden);
        this.loginLink.node.classList.remove(classes.hidden);
        this.signinLink.node.classList.remove(classes.hidden);
      }
    } else {
      this.loginButton.node.classList.add(classes.hidden);
      this.loginLink.node.classList.add(classes.hidden);
      this.signinButton.node.classList.add(classes.hidden);
      this.signinLink.node.classList.add(classes.hidden);
      if (this.userProfileIco.node.classList.contains(classes.hidden)) {
        this.userProfileIco.node.classList.remove(classes.hidden);
        this.userProfileLink.node.classList.remove(classes.hidden);
        this.logoutButton.node.classList.remove(classes.hidden);
        this.logoutLink.node.classList.remove(classes.hidden);
      }
    }
  }

  createLogoNavigationContent = () => {
    const logoIcon = new BaseElement<HTMLImageElement>({
      tag: 'img',
      class: classes.logoIcon,
      src: logoSvg,
    });

    this.navigationList = this.#createListLinks(mainNavItems);
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
    const burgerLinksName = { ...mainNavItems, ...sidebarNavItems };
    const navigationListBurger = this.#createListLinks(burgerLinksName);
    this.hamburgerSidebar = new HamburgerSidebar(
      { class: classes.mobileMenu },
      navigationListBurger,
    );
    this.node.append(this.hamburgerSidebar.node);
  };

  #createListLinks = (navList: StringKeyObject): BaseElement<HTMLUListElement> => {
    const list = new BaseElement<HTMLUListElement>({ tag: 'ul', class: classes.navigationList });
    const listLinksName = Object.keys(navList);

    listLinksName.forEach((name) => {
      const listItem = new BaseElement<HTMLLIElement>({
        tag: 'li',
      });
      const link = new Link({
        href: LinkPath[name],
        textContent: navList[name],
        class: classes.navLink,
      });
      listItem.node.append(link.node);
      list.node.append(listItem.node);

      if (name === 'LOGIN') { this.loginLink = listItem; };
      if (name === 'SINGIN') { this.signinLink = listItem; };
      if (name === 'PROFILE') { this.userProfileLink = listItem; }
      if (name === 'LOGOUT') {
        this.logoutLink = listItem;
        link.node.addEventListener('click', (event: Event) => {
          event.preventDefault();
          // there need a callback for unlogging, now it is testing exemple
          State.getInstance().isLoggedIn = !State.getInstance().isLoggedIn;
          // after unlogging change button
          this.#changeNavView();
        });
      }
    });

    return list;
  };
};
