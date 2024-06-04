import crossSVG from '@Assets/icons/cross.svg';
import BaseElement from '@Src/components/common/base-element';
import classes from './style.module.scss';

export default class ModalWindow extends BaseElement<HTMLElement> {
  #modal!: BaseElement<HTMLElement>;

  #cross!: BaseElement<HTMLElement>;

  constructor(
    className: string | string[],
    closeByWrapperClick = false,
    ...children: BaseElement<HTMLElement>[]
  ) {
    super({ tag: 'div', class: className });
    this.node.classList.add(classes.modalWrapper);
    if (closeByWrapperClick) {
      this.node.addEventListener('click', this.#close);
    }
    this.#createContent(children);
    document.body.append(this.node);
    this.#cross.node.addEventListener('click', this.#close);
  }

  #createContent = (children: BaseElement<HTMLElement>[]) => {
    this.#modal = new BaseElement<HTMLElement>(
      { tag: 'div', class: classes.modal },
      ...children,
      (this.#cross = new BaseElement<HTMLButtonElement>({
        tag: 'button',
        class: classes.cross,
        innerHTML: crossSVG,
      })),
    );
  };

  #close = (event: Event) => {
    const target = event.target as HTMLElement;
    const isCrossClicked = target.closest(`.${classes.cross}`);
    // Проверка на клик вне модального окна или на крестик
    if (!this.#modal.node.contains(target) || isCrossClicked) {
      this.node.remove();
      this.node.removeEventListener('click', this.#close);
    }
  };

  show = () => {
    this.node.append(this.#modal.node);
  };
}
