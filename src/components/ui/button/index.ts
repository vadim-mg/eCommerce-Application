import BaseElement, { Callback, ElementProps } from '@Src/components/common/base-element';

import classes from './style.module.scss';

export enum ButtonClasses {
  NORMAL = 'normal',
  BIG = 'big',
  CATEGORY = 'category',
  CURRENT_CATEGORY = 'current',
}

type ButtonProps = Omit<ElementProps<HTMLButtonElement>, 'tag'>;

export default class Button extends BaseElement<HTMLButtonElement> {
  #onClickCb: Callback;

  constructor(
    props: ButtonProps,
    buttonClass: ButtonClasses | ButtonClasses[],
    onClickCb: (event: Event) => void,
    iconPath?: string,
  ) {
    super({ tag: 'button', ...props });
    this.#onClickCb = onClickCb;
    this.node.addEventListener('click', this.onClickHandler);
    this.#addClasses(buttonClass);
    if (iconPath) {
      this.#addIcon(iconPath);
    }
  }

  #addClasses = (buttonClass: ButtonClasses | ButtonClasses[]) => {
    if (Array.isArray(buttonClass)) {
      buttonClass.forEach((className) => this.node.classList.add(classes[className]));
    } else {
      this.node.classList.add(classes[buttonClass]);
    }
  };

  #addIcon = (iconPath: string) => {
    const icon = new BaseElement<HTMLImageElement>({
      tag: 'img',
      src: iconPath,
    });
    icon.node.classList.add(classes.icon);
    this.node.prepend(icon.node);
  };

  onClickHandler = (event: Event) => {
    event.preventDefault();
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

  set currentStatus(isCurrentCategory: boolean) {
    this.node.classList[isCurrentCategory ? 'add' : 'remove'](
      classes[ButtonClasses.CURRENT_CATEGORY],
    );
  }
}
