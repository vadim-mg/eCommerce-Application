import BaseElement from '@Src/components/common/base-element';
import classes from './style.module.scss';

export default class RangeSlider extends BaseElement<HTMLElement> {
  minValue: number;

  maxValue: number;

  #start: number;

  #end: number;

  #minInput!: BaseElement<HTMLInputElement>;

  #maxInput!: BaseElement<HTMLInputElement>;

  #thumbLeft!: BaseElement<HTMLElement>;

  #thumbLeftText!: BaseElement<HTMLElement>;

  #thumbRight!: BaseElement<HTMLElement>;

  #thumbRightText!: BaseElement<HTMLElement>;

  #rangeBetween!: BaseElement<HTMLElement>;

  constructor(start: number, end: number, className: string) {
    super({ tag: 'div', class: className });
    this.node.classList.add(classes.wrapperRangeSlider);

    this.#start = start;
    this.#end = end;
    this.minValue = start;
    this.maxValue = end;

    this.#create();
    this.#setStartValue();
    this.#setEndValue();
    this.#setEvents();
  }

  #create = () => {
    this.#minInput = new BaseElement<HTMLInputElement>({
      tag: 'input',
      type: 'range',
      id: 'input-min',
      min: String(this.#start),
      max: String(this.#end),
      step: '1',
      value: String(this.#start),
      class: classes.inputMin,
    });
    this.#maxInput = new BaseElement<HTMLInputElement>({
      tag: 'input',
      type: 'range',
      id: 'input-max',
      min: String(this.#start),
      max: String(this.#end),
      step: '1',
      value: String(this.#end),
      class: classes.inputMax,
    });
    this.minValue = parseInt(this.#minInput.node.value, 10);
    this.maxValue = parseInt(this.#maxInput.node.value, 10);

    const trackWrapper = new BaseElement<HTMLElement>(
      {
        tag: 'div',
        class: classes.trackWrapper,
      },
      new BaseElement<HTMLElement>({
        tag: 'div',
        class: classes.track,
      }),
      (this.#rangeBetween = new BaseElement<HTMLElement>({
        tag: 'div',
        class: classes.rangeBetween,
      })),
      (this.#thumbLeft = new BaseElement<HTMLElement>({
        tag: 'div',
        class: [classes.thumb, classes.left],
      },
        this.#thumbLeftText = new BaseElement<HTMLElement>({
          tag: 'div',
          class: [classes.thumb, classes.thumbText],
        }))),
      (this.#thumbRight = new BaseElement<HTMLElement>({
        tag: 'div',
        class: [classes.thumb, classes.right],
      },
        this.#thumbRightText = new BaseElement<HTMLElement>({
          tag: 'div',
          class: [classes.thumb, classes.thumbText],
        })
      )),
    );

    const wrapper = new BaseElement<HTMLElement>(
      {
        tag: 'div',
        class: classes.rangeSlider,
      },
      this.#minInput,
      this.#maxInput,
      trackWrapper,
    );
    this.node.append(wrapper.node);
  };

  #setStartValue = () => {
    const maximum = Math.min(
      parseInt(this.#minInput.node.value, 10),
      parseInt(this.#maxInput.node.value, 10) - 1,
    );
    const percent =
      ((maximum - Number(this.#minInput.node.min)) /
        (Number(this.#minInput.node.max) - Number(this.#minInput.node.min))) *
      100;
    this.#thumbLeft.node.style.left = `${percent}%`;
    this.#rangeBetween.node.style.left = `${percent}%`;

    /* if (Number(this.#minInput.node.value) >= Number(this.#maxInput.node.value) - 1) {
      this.#minInput.node.value = String(+this.#maxInput.node.value - 1);
    } */
    this.#thumbLeftText.node.innerHTML = this.#minInput.node.value;
  };

  #setEndValue = () => {
    const minimum = Math.max(
      parseInt(this.#maxInput.node.value, 10),
      parseInt(this.#minInput.node.value, 10) + 1,
    );
    const percent =
      ((minimum - Number(this.#maxInput.node.min)) /
        (Number(this.#maxInput.node.max) - Number(this.#maxInput.node.min))) *
      100;
    this.#thumbRight.node.style.right = `${100 - percent}%`;
    this.#rangeBetween.node.style.right = `${100 - percent}%`;
    this.#thumbRightText.node.innerHTML = this.#maxInput.node.value;
  };

  #setEvents = () => {
    this.#minInput.node.addEventListener('input', () => this.#setStartValue());
    this.#maxInput.node.addEventListener('input', () => this.#setEndValue());

    // add css classes on hover and drag
    this.#minInput.node.addEventListener('mouseover', () =>
      this.#thumbLeft.node.classList.add(classes.hover),
    );
    this.#minInput.node.addEventListener('mouseout', () =>
      this.#thumbLeft.node.classList.remove(classes.hover),
    );
    this.#minInput.node.addEventListener('mousedown', () =>
      this.#thumbLeft.node.classList.add(classes.active),
    );
    this.#minInput.node.addEventListener('pointerup', () =>
      this.#thumbLeft.node.classList.remove(classes.active),
    );

    this.#maxInput.node.addEventListener('mouseover', () =>
      this.#thumbRight.node.classList.add(classes.hover),
    );
    this.#maxInput.node.addEventListener('mouseout', () =>
      this.#thumbRight.node.classList.remove(classes.hover),
    );
    this.#maxInput.node.addEventListener('mousedown', () =>
      this.#thumbRight.node.classList.add(classes.active),
    );
    this.#maxInput.node.addEventListener('pointerup', () =>
      this.#thumbRight.node.classList.remove(classes.active),
    );

    // Mobile
    this.#minInput.node.addEventListener('touchstart', () =>
      this.#thumbLeft.node.classList.add(classes.active),
    );
    this.#minInput.node.addEventListener('touchend', () =>
      this.#thumbLeft.node.classList.remove(classes.active),
    );
    this.#maxInput.node.addEventListener('touchstart', () =>
      this.#thumbRight.node.classList.add(classes.active),
    );
    this.#maxInput.node.addEventListener('touchend', () =>
      this.#thumbRight.node.classList.remove(classes.active),
    );
  };
}
