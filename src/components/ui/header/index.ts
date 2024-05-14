import basketSvg from '@Assets/icons/basket.svg';
import logoSvg from '@Assets/icons/logo.svg';
import userSvg from '@Assets/icons/user.svg';
import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import HamburgerSidebar from '@Src/components/ui/hamburger-sidedar';
import Link from '@Src/components/ui/link';
import ROUTES, { AppRoutes, RouteVisibility } from '@Src/router/routes';
import State from '@Src/state';

import auth from '@Src/controllers/auth';
import Router from '@Src/router';
import classes from './style.module.scss';

type HeaderProps = Omit<ElementProps<HTMLElement>, 'tag'>;

const routeToLogin = () => Router.getInstance().route(AppRoutes.LOGIN);

const routeToSignup = () => Router.getInstance().route(AppRoutes.SIGNUP);

export default class Header extends BaseElement<HTMLElement> {
  userActionsWrapper!: BaseElement<HTMLDivElement>;

  buttonContainer!: BaseElement<HTMLDivElement>;

  navigationList!: BaseElement<HTMLUListElement>;

  navigationListBurger!: BaseElement<HTMLUListElement>;

  burgerButton!: BaseElement<HTMLDivElement>;

  hamburgerSidebar!: HamburgerSidebar;

  #mainNavItems: AppRoutes[];

  #sidebarNavItems: AppRoutes[];

  constructor(props: HeaderProps) {
    super({ tag: 'header', class: classes.header, ...props });
    this.#mainNavItems = [
      AppRoutes.MAIN,
      AppRoutes.CATALOGUE,
      AppRoutes.ABOUT
    ];
    this.#sidebarNavItems = [
      AppRoutes.LOGIN,
      AppRoutes.SIGNUP,
      AppRoutes.PROFILE,
      AppRoutes.LOGOUT
    ];
    this.#createContent();
  }

  #createContent = () => {
    this.createButtonContainer();

    this.createBurgerMenu();

    this.createBurgerButton();

    this.node.append(this.#createLogoNavigationWrapper().node);
    this.node.append(Header.#createCartElement().node);
    this.node.append(this.buttonContainer.node);
    this.node.append(this.burgerButton.node);
    this.node.append(this.hamburgerSidebar.node);
    this.burgerButton.node.addEventListener('click', this.hamburgerSidebar.openSidebar);
  };

  #createLogoNavigationWrapper = () => {
    const navigationList = this.#mainNavItems.map((route) => new BaseElement<HTMLLIElement>(
      {
        tag: 'li',
        class: Router.isCurrentPath(route) ? classes.current : '',
      },
      new Link({
        href: route,
        text: ROUTES[route].name,
        class: classes.navLink,
      })
    ));

    return new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.logoNavigationWrapper },
      new BaseElement<HTMLImageElement>(
        {
          tag: 'img',
          class: classes.logoIcon,
          src: logoSvg,
        }),
      new BaseElement<HTMLElement>(
        {
          tag: 'nav',
          class: '',
        },
        new BaseElement<HTMLUListElement>({ tag: 'ul', class: classes.navigationList }, ...navigationList)
      ),
    );
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
  };

  static #createCartElement = () => new BaseElement<HTMLDivElement>(
    {
      tag: 'div',
      class: classes.userActionsWrapper,
    },
    new BaseElement<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.basket,
      },
      new BaseElement<HTMLImageElement>({
        tag: 'img',
        class: classes.basketIcon,
        src: basketSvg,
      })
    )
  );

  createButtonContainer = () => {
    this.buttonContainer = new BaseElement<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.buttonContainer,
      },
      new Button({ text: 'Log in', hidden: State.getInstance().isLoggedIn },
        ButtonClasses.NORMAL,
        routeToLogin),
      new Button({ text: 'Sign up', hidden: State.getInstance().isLoggedIn },
        ButtonClasses.NORMAL,
        routeToSignup),
      new Link({
        href: AppRoutes.PROFILE,
        class: classes.linkUserIcon,
      }),

      new BaseElement<HTMLImageElement>({
        tag: 'img',
        class: classes.userIcon,
        src: userSvg,
        hidden: !State.getInstance().isLoggedIn
      }),

      new Button({ text: 'Log out', hidden: !State.getInstance().isLoggedIn },
        ButtonClasses.NORMAL,
        auth.signOut)
    );
  };


  createBurgerMenu = () => {
    const navigationListBurger = [...this.#mainNavItems, ...this.#sidebarNavItems]
      .filter(Header.#filterListItem)
      .map(Header.#createListItem);
    this.hamburgerSidebar = new HamburgerSidebar(
      { class: classes.mobileMenu },
      new BaseElement<HTMLUListElement>(
        { tag: 'ul', class: classes.navigationList },
        ...navigationListBurger
      ),
    );
  };

  // create list item for route
  static #createListItem = (route: AppRoutes) => new BaseElement<HTMLLIElement>(
    {
      tag: 'li',
      class: Router.isCurrentPath(route) ? classes.current : '',
    },
    new Link({
      href: route,
      text: ROUTES[route].name,
      class: classes.navLink,
    })
  );

  // filter routes which should be shown
  static #filterListItem = (route: AppRoutes) => {
    if (ROUTES[route].visibility === RouteVisibility.onlyAuth && !State.getInstance().isLoggedIn) {
      return false;
    }
    if (ROUTES[route].visibility === RouteVisibility.onlyNotAuth && State.getInstance().isLoggedIn) {
      return false;
    }
    return true;
  };
}
