import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import classes from './style.module.scss';
import Button, { ButtonClasses } from '../button';

type BannerProps = Omit<ElementProps<HTMLElement>, 'tag'>;

export default class Banner extends BaseElement<HTMLElement> {
  bannerContentWrapper!: BaseElement<HTMLDivElement>;

  mainBannerSection!: BaseElement<HTMLDivElement>;

  bannerTitle!: BaseElement<HTMLHeadingElement>;

  bannerTextContent!: BaseElement<HTMLParagraphElement>;

  bannerButton!: Button;

  highlightBadgeSection!: BaseElement<HTMLDivElement>;

  highlightBadge!: BaseElement<HTMLParagraphElement>;

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

  createMainBannerSection = () => {
    this.bannerTitle = new BaseElement<HTMLHeadingElement>({
      tag: 'h1',
      class: classes.bannerTitle,
      text: 'Level Up Your Collection!',
    });
    this.bannerTextContent = new BaseElement<HTMLParagraphElement>({
      tag: 'p',
      class: classes.bannerTextContent,
      text: 'Celebrate Our Grand Opening with a Special Gift: 20%  Off Promo Code for All Games!',
    });
    this.bannerButton = new Button(
      { text: 'Use promo code: PLAYMORE', class: classes.bannerButton },
      ButtonClasses.BIG,
      () => console.log('use promo'),
    );
    this.mainBannerSection = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.mainBannerSection },
      this.bannerTitle,
      this.bannerTextContent,
      this.bannerButton,
    );
    this.bannerContentWrapper.node.append(this.mainBannerSection.node);
  };

  createHighlightBadgeSection = () => {
    this.highlightBadge = new BaseElement<HTMLParagraphElement>({ tag: 'p', class: classes.highlightBadge, text: '-20% for ALL' });
    this.highlightBadgeSection = new BaseElement<HTMLDivElement>({ tag: 'div', class: classes.highlightBadgeSection }, this.highlightBadge);
    this.bannerContentWrapper.node.append(this.highlightBadgeSection.node);
  }
}
