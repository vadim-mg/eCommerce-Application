import BaseElement from '@Src/components/common/base-element';
import Link from '../link';
import classes from './style.module.scss';

export default class Footer extends BaseElement<HTMLElement> {
  constructor() {
    super({ tag: 'footer', class: classes.footer });
    this.#createContent();
  }

  #createContent = () => {
    this.#addTeamLinks();
    this.#addCopy();
    this.#addRSSLink();
  };

  #addTeamLinks = () => {

    const blockHeading = new BaseElement<HTMLDivElement>({ tag: 'div', text: 'Development team:', class: classes.teamTitle });
    const ul = new BaseElement<HTMLUListElement>(
      { tag: 'ul', class: classes.teamList },
      new BaseElement<HTMLLIElement>({ tag: 'li', class: classes.teamItem, },
        new Link({
          text: 'Vadim Mg',
          href: 'https://github.com/vadim-mg',
          target: '_blank',
          class: classes.teamLink,
        })),
      new BaseElement<HTMLLIElement>({ tag: 'li', class: classes.teamItem, },
        new Link({
          text: 'Yanina Lysukha',
          href: 'https://github.com/YanaLysukha',
          target: '_blank',
          class: classes.teamLink,
        })),
      new BaseElement<HTMLLIElement>({ tag: 'li', class: classes.teamItem, },
        new Link({
          text: 'Natalia Repkina',
          href: 'https://github.com/Nuttik',
          target: '_blank',
          class: classes.teamLink,
        })),
    );

    const wrapper = new BaseElement<HTMLDivElement>({ tag: 'div', class: classes.teamWrapper, }, blockHeading, ul);
    this.node.append(wrapper.node);
  };

  #addCopy = () => {
    const copy = new BaseElement<HTMLDivElement>({ tag: 'div', class: classes.copy, text: '2024 ©' });
    this.node.append(copy.node);
  };

  #addRSSLink = () => {
    const link = new Link({
      href: 'https://rs.school',
      target: '_blank',
      class: classes.rssLink,
    });
    this.node.append(link.node);
  };
}