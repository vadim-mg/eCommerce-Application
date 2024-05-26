import BaseElement from '@Src/components/common/base-element';
import tag from '@Src/components/common/tag';
import Router from '@Src/router';
import ROUTES, { AppRoutes } from '@Src/router/routes';
import classes from './style.module.scss';

export default class BreadCrumbs extends BaseElement<HTMLUListElement> {
  constructor() {
    console.log(Router.getInstance().currentRoutePath);
    console.log(window.location.pathname);
    super(
      { tag: 'ul', class: classes.breadCrumbs },
      // tag<HTMLLinkElement>({
      //   tag: 'a',
      //   class: classes.link,
      //   href: AppRoutes.MAIN,
      //   text: ROUTES[AppRoutes.MAIN].name
      // }),

      ...Router.getInstance()
        .currentRoutePath.split('/')
        .map((path, index, array) =>
          index === array.length - 1
            ? tag<HTMLSpanElement>({
                tag: 'span',
                text: path,
                class: classes.current,
              })
            : tag<HTMLLinkElement>({
                tag: 'a',
                text: index > 0 ? path : ROUTES[AppRoutes.MAIN].name,
                class: classes.link,
                href: array.filter((val, i) => i <= index).join('/'),
              }),
        ),
    );
  }
}
