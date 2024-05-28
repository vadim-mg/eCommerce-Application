import arrowLeftSVG from '@Assets/icons/arrow-left.svg';
import arrowRightSVG from '@Assets/icons/arrow-right.svg';
import BaseElement from '@Src/components/common/base-element';
import Products, { ImageSize } from '@Src/controllers/products';
import { Image } from '@commercetools/platform-sdk';
import ModalWindow from '../modal';
import classes from './style.module.scss';

enum Direction {
  LEFT,
  RIGHT,
}

export enum SliderIsZoom {
  TRUE,
  FALSE,
}

export default class Slider extends BaseElement<HTMLElement> {
  #image: Image[];

  #imagesURL: string[];

  #imageListEl!: BaseElement<HTMLElement>;

  #imageList!: BaseElement<HTMLElement>[];

  #indicators!: BaseElement<HTMLElement>[];

  #index: number;

  #currentIndicator!: BaseElement<HTMLElement>;

  #arrowLeft!: BaseElement<HTMLElement>;

  #arrowRight!: BaseElement<HTMLElement>;

  #touchStartX = 0;

  #touchEndX = 0;

  constructor(
    className: string | string[],
    size: ImageSize,
    images: Image[],
    withZoom: SliderIsZoom,
    start: number,
  ) {
    super({ tag: 'div', class: className });
    this.node.classList.add(classes.slider);
    this.#image = images;
    this.#imagesURL = images.map((image) => Products.getImageUrl(image.url, size));
    this.#index = start;
    this.#createSlider(withZoom);
    this.#createControlsPanel();
    this.#addSwipeSupport();
  }

  #createSlider = (isZoom: SliderIsZoom) => {
    this.#imageListEl = new BaseElement<HTMLElement>({ tag: 'div', class: classes.wrapper });
    this.#imageList = [];
    this.#imagesURL.forEach((url, index) => {
      const imageLi = new BaseElement<HTMLLIElement>(
        { tag: 'div', class: classes.imageLi },
        new BaseElement<HTMLImageElement>({
          tag: 'img',
          class: classes.image,
          src: url,
          alt: 'slider image',
        }),
      );

      if (index === this.#index) {
        imageLi.node.classList.add(classes.active);
      }

      if (isZoom === SliderIsZoom.TRUE) {
        imageLi.node.addEventListener('click', () => {
          const slider = new Slider(
            classes.sliderInModal,
            ImageSize.large,
            this.#image,
            SliderIsZoom.FALSE,
            index,
          );
          const modal = new ModalWindow(classes.modal, slider);
          modal.show();
        });
      }
      this.#imageListEl.node.append(imageLi.node);
      this.#imageList.push(imageLi);
    });
    this.node.append(this.#imageListEl.node);
  };

  #createControlsPanel = () => {
    const controlsPanel = new BaseElement<HTMLElement>({
      tag: 'div',
      class: classes.controlsPanel,
    });

    this.#arrowLeft = this.#createArrow(Direction.LEFT, arrowLeftSVG);
    this.#arrowRight = this.#createArrow(Direction.RIGHT, arrowRightSVG);
    this.#changeArrowAvailability();

    const indicatorsWrapper = new BaseElement<HTMLElement>({
      tag: 'div',
      class: classes.indicators,
    });
    this.#indicators = [];
    for (let i = 0; i < this.#imagesURL.length; i += 1) {
      const li = new BaseElement<HTMLElement>({ tag: 'div', class: classes.indicator });
      this.#indicators.push(li);
      indicatorsWrapper.node.append(li.node);
      if (i === this.#index) {
        this.#currentIndicator = li;
        this.#currentIndicator.node.classList.add(classes.indicatorCurrent);
      }
    }

    controlsPanel.node.append(this.#arrowLeft.node);
    controlsPanel.node.append(indicatorsWrapper.node);
    controlsPanel.node.append(this.#arrowRight.node);
    this.#imageListEl.node.append(controlsPanel.node);
  };

  #createArrow = (direction: Direction, svg: string): BaseElement<HTMLElement> => {
    const arrow = new BaseElement<HTMLElement>({ tag: 'div', class: classes.arrow });
    arrow.node.addEventListener('click', () => this.#rotation(direction));
    arrow.node.innerHTML = svg;
    return arrow;
  };

  #changeArrowAvailability = () => {
    if (this.#index === 0) {
      this.#arrowLeft.node.classList.add(classes.arrowDisabled);
    }
    if (this.#index === this.#imageList.length - 1) {
      this.#arrowRight.node.classList.add(classes.arrowDisabled);
    }
    if (this.#index > 0 && this.#arrowLeft.node.classList.contains(classes.arrowDisabled)) {
      this.#arrowLeft.node.classList.remove(classes.arrowDisabled);
    }
    if (
      this.#index < this.#imageList.length - 1 &&
      this.#arrowRight.node.classList.contains(classes.arrowDisabled)
    ) {
      this.#arrowRight.node.classList.remove(classes.arrowDisabled);
    }
  };

  #rotation = (direction: Direction) => {
    if (direction === Direction.LEFT && this.#index > 0) {
      this.#hideItem();
      this.#index -= 1;
      this.#showItem();
      this.#changeArrowAvailability();
    }
    if (direction === Direction.RIGHT && this.#index < this.#indicators.length - 1) {
      this.#hideItem();
      this.#index += 1;
      this.#showItem();
      this.#changeArrowAvailability();
    }

    this.#changeIndicators();
  };

  #hideItem() {
    this.#imageList[this.#index].node.classList.remove(classes.active);
  }

  #showItem() {
    this.#imageList[this.#index].node.classList.add(classes.active);
  }

  #changeIndicators = () => {
    this.#currentIndicator.node.classList.remove(classes.indicatorCurrent);
    this.#currentIndicator = this.#indicators[this.#index];
    this.#currentIndicator.node.classList.add(classes.indicatorCurrent);
  };

  #addSwipeSupport = () => {
    this.#imageListEl.node.addEventListener('touchstart', this.#handleTouchStart);
    this.#imageListEl.node.addEventListener('touchmove', this.#handleTouchMove);
    this.#imageListEl.node.addEventListener('touchend', this.#handleTouchEnd);
  };

  #handleTouchStart = (event: TouchEvent) => {
    this.#touchStartX = event.touches[0].clientX;
  };

  #handleTouchMove = (event: TouchEvent) => {
    this.#touchEndX = event.touches[0].clientX;
  };

  #handleTouchEnd = () => {
    const difference = this.#touchStartX - this.#touchEndX;
    if (difference > 30) {
      this.#rotation(Direction.RIGHT);
    } else if (difference < -30) {
      this.#rotation(Direction.LEFT);
    }
  };
}
