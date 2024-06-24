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

  #icon!: BaseElement<HTMLImageElement>;

  constructor(
    props: ButtonProps,
    buttonClass: ButtonClasses | ButtonClasses[],
    onClickCb: (event: Event) => void,
    iconSVG?: string,
  ) {
    super({ tag: 'button', ...props });
    this.#onClickCb = onClickCb;
    this.node.addEventListener('click', this.onClickHandler);
    this.#addClasses(buttonClass);
    if (iconSVG) {
      this.addIcon(iconSVG);
    }
  }

  #addClasses = (buttonClass: ButtonClasses | ButtonClasses[]) => {
    if (Array.isArray(buttonClass)) {
      buttonClass.forEach((className) => this.node.classList.add(classes[className]));
    } else {
      this.node.classList.add(classes[buttonClass]);
    }
  };

  addIcon = (iconSVG: string) => {
    this.#icon = new BaseElement<HTMLImageElement>({
      tag: 'div',
      innerHTML: iconSVG,
    });
    this.#icon.node.classList.add(classes.icon);
    this.node.prepend(this.#icon.node);
  };

  set icon(iconSVG: string) {
    this.#icon.node.innerHTML = iconSVG;
  }

  onClickHandler = (event: Event) => {
    event.preventDefault();
    this.#onClickCb(event);
  };

  show = () => {
    this.node.classList.remove(classes.hidden);
  };

  hide = () => {
    this.node.classList.add(classes.hidden);
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
