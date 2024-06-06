import BaseElement from '@Src/components/common/base-element';
import tag from '@Src/components/common/tag';
import Link from '@Src/components/ui/link';
import Router from '@Src/router';
import ROUTES, { AppRoutes } from '@Src/router/routes';
import classes from './style.module.scss';

export default class BreadCrumbs extends BaseElement<HTMLUListElement> {
  constructor() {
    super({ tag: 'ul', class: classes.breadCrumbs });
    this.#draw();
    Router.getInstance().setOnChangeCurrentRouteHandler(this.#draw);
  }

  #draw = () => {
    this.node.innerHTML = '';
    this.node.append(
      ...Router.getInstance()
        .currentRoutePath.split('/')
        .map((path, index, array) =>
          index === array.length - 1
            ? tag<HTMLSpanElement>({
                tag: 'span',
                text: path,
                class: classes.current,
              }).node
            : new Link({
                text: index > 0 ? path : ROUTES[AppRoutes.MAIN].name,
                class: classes.link,
                href: array.filter((val, i) => i <= index).join('/'),
              }).node,
        ),
    );
  };
}
