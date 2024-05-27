import arrowLeftSVG from '@Assets/icons/arrow-left.svg';
import arrowRightSVG from '@Assets/icons/arrow-right.svg';
import BaseElement from '@Src/components/common/base-element';
import Products, { ImageSize } from '@Src/controllers/products';
import { Image } from '@commercetools/platform-sdk';
import classes from './style.module.scss';

enum Direction {
  LEFT,
  RIGHT,
}

export enum SliderPositionControlsPanel {
  INSIDE,
  OUTSIDE,
}

export default class Slider extends BaseElement<HTMLElement> {
  #images: Image[];

  #size: ImageSize;

  #imageList!: BaseElement<HTMLUListElement>;

  #indicators!: BaseElement<HTMLElement>[];

  #index: number;

  #currentIndicator!: BaseElement<HTMLElement>;

  constructor(
    className: string | string[],
    size: ImageSize,
    images: Image[],
    positionControlsPanel: SliderPositionControlsPanel,
  ) {
    super({ tag: 'div', class: className });
    this.node.classList.add(classes.slider);
    this.#images = images;
    this.#size = size;
    this.#index = 0;
    const classPositionControl =
      positionControlsPanel === SliderPositionControlsPanel.INSIDE
        ? classes.controlsInside
        : classes.controlsOutside;
    this.node.classList.add(classPositionControl);
    this.#createSlider();
    this.#createControlsPanel();
  }

  #createSlider = () => {
    const wrapper = new BaseElement<HTMLElement>({ tag: 'div', class: classes.wrapper });

    this.#imageList = new BaseElement<HTMLUListElement>({ tag: 'ul', class: classes.imageList });
    this.#images.forEach((image) => {
      const url = Products.getImageUrl(image.url, this.#size);
      const imageLi = new BaseElement<HTMLLIElement>(
        { tag: 'li', class: classes.imageLi },
        new BaseElement<HTMLImageElement>({
          tag: 'img',
          class: classes.image,
          src: url,
          alt: 'slider image',
        }),
      );
      imageLi.node.addEventListener('click', () => console.log('show a modal window with slider'));
      this.#imageList.node.append(imageLi.node);
    });
    wrapper.node.append(this.#imageList.node);
    this.node.append(wrapper.node);
  };

  #createControlsPanel = () => {
    const controlsPanel = new BaseElement<HTMLElement>({
      tag: 'div',
      class: classes.controlsPanel,
    });

    const arrowLeft = new BaseElement<HTMLElement>({ tag: 'div', class: classes.arrow });
    arrowLeft.node.addEventListener('click', () => this.#rotation(Direction.LEFT));
    arrowLeft.node.innerHTML = arrowLeftSVG;
    const arrowRight = new BaseElement<HTMLElement>({ tag: 'div', class: classes.arrow });
    arrowRight.node.addEventListener('click', () => this.#rotation(Direction.RIGHT));
    arrowRight.node.innerHTML = arrowRightSVG;

    const indicatorsWrapper = new BaseElement<HTMLElement>({
      tag: 'div',
      class: classes.indicators,
    });
    this.#indicators = [];
    for (let i = 0; i < this.#images.length; i += 1) {
      const li = new BaseElement<HTMLElement>({ tag: 'div', class: classes.indicator });
      this.#indicators.push(li);
      indicatorsWrapper.node.append(li.node);
    }
    [this.#currentIndicator] = this.#indicators;
    this.#currentIndicator.node.classList.add(classes.indicatorCurrent);

    controlsPanel.node.append(arrowLeft.node);
    controlsPanel.node.append(indicatorsWrapper.node);
    controlsPanel.node.append(arrowRight.node);

    this.node.append(controlsPanel.node);
  };

  #rotation = (direction: Direction) => {
    if (direction === Direction.LEFT && this.#index > 0) this.#index -= 1;
    if (direction === Direction.RIGHT && this.#index < this.#indicators.length - 1) this.#index += 1;

    this.#changeIndicators();
  };

  #changeIndicators = () => {
    this.#currentIndicator.node.classList.remove(classes.indicatorCurrent);
    this.#currentIndicator = this.#indicators[this.#index];
    this.#currentIndicator.node.classList.add(classes.indicatorCurrent);
  };
}
