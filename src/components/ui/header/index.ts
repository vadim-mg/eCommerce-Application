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
  #mainNavItems = [AppRoutes.MAIN, AppRoutes.CATALOGUE, AppRoutes.ABOUT];

  #sidebarNavItems = [AppRoutes.LOGIN, AppRoutes.SIGNUP, AppRoutes.PROFILE, AppRoutes.LOGOUT];

  #burgerButton: BaseElement<HTMLDivElement>;

  #hamburgerSidebar: HamburgerSidebar;

  constructor(props: HeaderProps) {
    super({ tag: 'header', class: classes.header, ...props });
    this.#burgerButton = Header.#createBurgerButton();
    this.#hamburgerSidebar = this.#createBurgerMenu();
    this.#appendContent();
    this.#addEventListeners();
  }

  #addEventListeners = () => {
    this.#burgerButton.node.addEventListener('click', this.#hamburgerSidebar.openSidebar);
  };

  #appendContent = () => {
    this.node.append(
      this.#hamburgerSidebar.node,
      this.#createLogoNavigationWrapper().node,
      Header.#createUserActionsWrapper().node,
      this.#burgerButton.node,
    );
  };

  #createLogoNavigationWrapper = () =>
    new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.logoNavigationWrapper },
      new BaseElement<HTMLImageElement>({
        tag: 'img',
        class: classes.logoIcon,
        src: logoSvg,
      }),
      new BaseElement<HTMLElement>(
        {
          tag: 'nav',
          class: '',
        },
        new BaseElement<HTMLUListElement>(
          { tag: 'ul', class: classes.navigationList },
          ...this.#mainNavItems.map(Header.#createListItem),
        ),
      ),
    );

  #createBurgerMenu = () =>
    new HamburgerSidebar(
      { class: classes.mobileMenu },
      new BaseElement<HTMLUListElement>(
        { tag: 'ul', class: classes.navigationList },
        ...[...this.#mainNavItems, ...this.#sidebarNavItems]
          .filter(Header.#filterListItem)
          .map(Header.#createListItem),
      ),
    );

  static #createBurgerButton = () =>
    new BaseElement<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.burgerButton,
      },
      ...Array(3)
        .fill(1)
        .map(
          () =>
            new BaseElement<HTMLDivElement>({
              tag: 'div',
              class: classes.burgerBtnLine,
            }),
        ),
    );

  static #createUserActionsWrapper = () =>
    new BaseElement<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.userActionsWrapper,
      },
      // cart element
      new Link(
        { href: AppRoutes.CART, class: classes.basket },
        new BaseElement<HTMLDivElement>(
          {
            tag: 'div',
            class: classes.basket,
          },
          new BaseElement<HTMLImageElement>({
            tag: 'img',
            class: classes.basketIcon,
            src: basketSvg,
          }),
        ),
      ),
      this.#createButtonContainer(),
    );

  static #createButtonContainer = () =>
    new BaseElement<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.buttonContainer,
      },

      new Button(
        { text: 'Log in', hidden: State.getInstance().isLoggedIn },
        ButtonClasses.NORMAL,
        routeToLogin,
      ),
      new Button(
        { text: 'Sign up', hidden: State.getInstance().isLoggedIn },
        ButtonClasses.NORMAL,
        routeToSignup,
      ),
      new Link({
        href: AppRoutes.PROFILE,
        class: classes.linkUserIcon,
      }),

      new BaseElement<HTMLImageElement>({
        tag: 'img',
        class: classes.userIcon,
        src: userSvg,
        hidden: !State.getInstance().isLoggedIn,
      }),

      new Button(
        { text: 'Log out', hidden: !State.getInstance().isLoggedIn },
        ButtonClasses.NORMAL,
        auth.signOut,
      ),
    );

  // create list item for route
  static #createListItem = (route: AppRoutes) =>
    new BaseElement<HTMLLIElement>(
      {
        tag: 'li',
        class: Router.isCurrentPath(route) ? classes.current : '',
      },
      new Link({
        href: route,
        text: ROUTES[route].name,
        class: classes.navLink,
      }),
    );

  // filter routes which should be shown
  static #filterListItem = (route: AppRoutes) => {
    if (ROUTES[route].visibility === RouteVisibility.onlyAuth && !State.getInstance().isLoggedIn) {
      return false;
    }
    if (
      ROUTES[route].visibility === RouteVisibility.onlyNotAuth &&
      State.getInstance().isLoggedIn
    ) {
      return false;
    }
    return true;
  };
}
