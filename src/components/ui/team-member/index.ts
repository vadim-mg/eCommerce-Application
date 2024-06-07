import BaseElement from '@Src/components/common/base-element';
import classes from './style.module.scss';
import Link from '../link';

export default class TeamMember extends BaseElement<HTMLElement> {
  constructor(
    name: string,
    role: string,
    location: string,
    education: string,
    courses: string,
    aboutInfo: string,
    github: string,
    githubPath: string,
    imgPath: string,
  ) {
    super({ tag: 'article', class: classes.wrapper });
    this.#createContent(
      name,
      role,
      location,
      education,
      courses,
      aboutInfo,
      github,
      githubPath,
      imgPath,
    );
  }

  #createContent = (
    name: string,
    role: string,
    location: string,
    education: string,
    courses: string,
    aboutInfo: string,
    github: string,
    githubPath: string,
    imgPath: string,
  ) => {
    const memberImage = new BaseElement<HTMLImageElement>({
      tag: 'img',
      src: imgPath,
      alt: `Photo of ${name}`,
    });
    const memberInfo = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.memberInfoWrapper },
      new BaseElement<HTMLHeadingElement>({ tag: 'h2', class: classes.memberName, text: name }),
      new BaseElement<HTMLUListElement>(
        { tag: 'ul', class: classes.infoList },
        new BaseElement<HTMLLIElement>(
          { tag: 'li', text: 'Role on the team: ' },
          new BaseElement<HTMLSpanElement>({ tag: 'span', text: role }),
        ),
        new BaseElement<HTMLLIElement>(
          { tag: 'li', text: 'Location: ' },
          new BaseElement<HTMLSpanElement>({ tag: 'span', text: location }),
        ),
        new BaseElement<HTMLLIElement>(
          { tag: 'li', text: 'Education: ' },
          new BaseElement<HTMLSpanElement>({ tag: 'span', text: education }),
        ),
        new BaseElement<HTMLLIElement>(
          { tag: 'li', text: 'Courses: ' },
          new BaseElement<HTMLSpanElement>({ tag: 'span', text: courses }),
        ),
        new BaseElement<HTMLLIElement>(
          { tag: 'li', text: 'About me: ' },
          new BaseElement<HTMLSpanElement>({ tag: 'span', text: aboutInfo }),
        ),
        new BaseElement<HTMLLIElement>(
          { tag: 'li', text: 'GitHub: ' },
          new Link({ href: githubPath, text: github, target: '_blank' }),
        ),
      ),
    );
    this.node.append(memberImage.node);
    this.node.append(memberInfo.node);
  };
}
