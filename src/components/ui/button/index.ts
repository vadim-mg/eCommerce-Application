import BaseElement, { ElementProps, Callback } from '@Src/components/common/base-element';

import classes from './style.module.scss';

export default class Button extends BaseElement<HTMLButtonElement> {
  #onClickCb: Callback;

  constructor(
    props: Omit<ElementProps<HTMLButtonElement>, 'tag'>,
    onClickCb: (event: Event) => void,
    iconPath?: string,
  ) {
    super({ tag: 'button', ...props });
    this.#onClickCb = onClickCb;
    this.node.classList.add(classes.button);
    this.node.addEventListener('click', this.onClickHandler);
    if (iconPath) {
      this.#addIcon(iconPath);
    }
  }

  #addIcon = (iconPath: string) => {
    const icon = new BaseElement<HTMLImageElement>({
      tag: 'img',
      src: iconPath,
      class: classes.icon,
    });
    this.node.prepend(icon.node);
  };

  onClickHandler = (event: Event) => {
    this.#onClickCb(event);
  };

  show = () => {
    this.node.hidden = false;
  };

  hide = () => {
    this.node.hidden = true;
  };

  disable = () => {
    this.node.disabled = true;
  };

  enable = () => {
    this.node.disabled = false;
  };
}
