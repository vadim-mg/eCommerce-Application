import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import { getDiscountCodes } from '@Src/controllers/cart';
import Button, { ButtonClasses } from '../button';
import classes from './style.module.scss';

type BannerProps = Omit<ElementProps<HTMLElement>, 'tag'>;

export default class Banner extends BaseElement<HTMLElement> {
  bannerContentWrapper!: BaseElement<HTMLDivElement>;

  mainBannerSection!: BaseElement<HTMLDivElement>;

  bannerTitle!: BaseElement<HTMLHeadingElement>;

  bannerTextContent!: BaseElement<HTMLParagraphElement>;

  bannerButton!: Button;

  highlightBadgeSection!: BaseElement<HTMLDivElement>;

  highlightBadge!: BaseElement<HTMLParagraphElement>;

  mobileHighlightBadge!: BaseElement<HTMLParagraphElement>;

  bigBtnText!: BaseElement<HTMLSpanElement>;

  constructor(props: BannerProps) {
    super({ tag: 'div', class: classes.banner, ...props });
    this.addBannerContent();
  }

  addBannerContent = () => {
    this.bannerContentWrapper = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.bannerContentWrapper,
    });
    this.createMainBannerSection();
    this.createHighlightBadgeSection();
    this.node.append(this.bannerContentWrapper.node);
  };

  createBannerTextContent = () => {
    const bannerTextPart1 = new BaseElement<HTMLSpanElement>({
      tag: 'span',
      text: 'Celebrate Our Grand Opening with a ',
    });
    const bannerTextPart2 = new BaseElement<HTMLSpanElement>({
      tag: 'span',
      text: 'Special Gift: 20% ',
      class: classes.highlight,
    });
    const bannerTextPart3 = new BaseElement<HTMLSpanElement>({
      tag: 'span',
      text: 'Off Promo Code for All Games!',
    });
    this.bannerTextContent = new BaseElement<HTMLParagraphElement>(
      {
        tag: 'p',
        class: classes.bannerTextContent,
      },
      bannerTextPart1,
      bannerTextPart2,
      bannerTextPart3,
    );
    return this.bannerTextContent;
  };

  createMainBannerSection = () => {
    this.mainBannerSection = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.mainBannerSection,
    });
    this.bannerContentWrapper.node.append(this.mainBannerSection.node);
    // get Promo from backend
    getDiscountCodes().then((discount) => {
      // todo: not in this sprint :) we can get all settings for banner in props, and from discount from api
      // now all magic numbers are hardcoded, don't change discounts in
      //  https://mc.us-central1.gcp.commercetools.com/board-game-shop/discounts it make broke banner actuality
      this.mainBannerSection.node.append(
        this.createBannerTitle().node,
        this.createMobileHighlightBadge().node,
        this.createBannerTextContent().node,
        this.createBannerButton(discount.body.results[0].key ?? '').node,
      );
    });
  };

  createBannerButton = (promoCode: string) => {
    const smallBtnText = new BaseElement<HTMLSpanElement>({
      tag: 'span',
      text: 'Use promo code: ',
      class: classes.smallBtnText,
    });
    this.bigBtnText = new BaseElement<HTMLSpanElement>({
      tag: 'span',
      text: promoCode,
      class: classes.bigBtnText,
    });
    this.bannerButton = new Button(
      { class: classes.bannerButton, title: 'Copy promo code' },
      ButtonClasses.BIG,
      () => navigator.clipboard.writeText(this.bigBtnText.node.innerText),
    );
    this.bannerButton.node.append(smallBtnText.node);
    this.bannerButton.node.append(this.bigBtnText.node);
    return this.bannerButton;
  };

  createBannerTitle = () => {
    const titleSecondPart = new BaseElement<HTMLSpanElement>({
      tag: 'span',
      text: ' Your Collection!',
      class: classes.titleSecondPart,
    });
    this.bannerTitle = new BaseElement<HTMLHeadingElement>(
      {
        tag: 'h1',
        class: classes.bannerTitle,
        text: 'Level Up',
      },
      titleSecondPart,
    );
    return this.bannerTitle;
  };

  createHighlightBadgeSection = () => {
    this.highlightBadge = new BaseElement<HTMLParagraphElement>({
      tag: 'p',
      class: classes.highlightBadge,
      text: '-20% for ALL',
    });
    this.highlightBadgeSection = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.highlightBadgeSection },
      this.highlightBadge,
    );
    this.bannerContentWrapper.node.append(this.highlightBadgeSection.node);
  };

  createMobileHighlightBadge = () => {
    this.mobileHighlightBadge = new BaseElement<HTMLParagraphElement>({
      tag: 'p',
      class: classes.highlightBadgeMobile,
      text: '-20% for ALL',
    });
    return this.mobileHighlightBadge;
  };
}
