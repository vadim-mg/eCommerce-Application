import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import TeamMember from '@Src/components/ui/team-member';
import vadimPhoto from '@Assets/img/vadim.jpg';
import yaninaPhoto from '@Assets/img/yanina.jpg';
import natalyaPhoto from '@Assets/img/natalya.jpg';
import Link from '@Src/components/ui/link';
import classes from './style.module.scss';

export default class AboutPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'main', title: 'about page', showBreadCrumbs: true });
    this.#createContent();
    this.#showContent();
  }

  #createContent = () => {
    this.#content = new BaseElement<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.about,
      },
      new BaseElement<HTMLHeadingElement>({ tag: 'h1', text: 'About us', class: classes.mainTitle }),
      new Link({ href: 'https://rs.school', target: '_blank', class: classes.rssLink }),
      new BaseElement<HTMLDivElement>({ tag: 'div', class: classes.textWrapper },
        new BaseElement<HTMLParagraphElement>({ tag: 'p', text: 'We are a team ‘Code juggling’ of students from' }),
        new Link({ href: 'https://rs.school', target: '_blank', text: 'RS School\'s' }),
        new BaseElement<HTMLParagraphElement>({ tag: 'p', text: ' frontend development course, and we are very excited to work together to create a fully functional web application. This app is our final project.' }),
        new BaseElement<HTMLParagraphElement>({ tag: 'p', text: 'Our team consists of three talented and passionate professionals: Vadim, our team leader, Yanina, frontend developer and tester, and Natalia, frontend developer and designer.' }),
        new BaseElement<HTMLParagraphElement>({ tag: 'p', text: 'Each member of our team contributed significantly to the project using their unique skills and talents. Vadim, our team leader, took on the development of complex application logic, working with APIs and organising the routing that became the basis of our product\'s functionality. Yanina was a real star as an executive and attentive to details frontend developer, performing application and test writing tasks, which ensured high quality and stability of our code. Natalia is our ui designer. She has both frontend development skills and design talents, developed the visual concept of the app and implemented some UI components and pages, giving our product an aesthetic and modern look.' }),
        new BaseElement<HTMLParagraphElement>({ tag: 'p', text: 'Our co-operation is based on friendly relations and mutual support. We are always ready to help each other and solve problems together, which allows us to work efficiently on the project and achieve our goals. Thanks to our joint efforts and well-coordinated teamwork, we managed to create a successful and high-quality web application.' }),
      ),
      new BaseElement<HTMLHeadingElement>({ tag: 'h2', text: 'Our team' }),
      new BaseElement<HTMLDivElement>(
        { tag: 'div', class: classes.teamMembersWrapper },
        new TeamMember(
          'Vadim',
          'TeamLead',
          'Russia, Tyumen',
          'higher education TGNGU',
          'RSScool: NodeJs, Frontend (stage0, stage1, stage2)',
          'I like to learn new things, at this stage it is front-end development. Hobbies: tourism and many others)',
          'vadim-mg',
          'https://github.com/vadim-mg',
          vadimPhoto,
        ),
        new TeamMember(
          'Yanina',
          'frontend, tester',
          'Poland, Wroclaw',
          'VSMU, Pharmaceutical faculty',
          'RSScool Frontend (stage1, stage2)',
          'I strive to become a better version of myself. Hobbies: board games, piano, bouldering',
          'YanaLysukha',
          'https://github.com/YanaLysukha',
          yaninaPhoto,
        ),
        new TeamMember(
          'Natalya',
          'frontend, ui designer',
          'Russia, Vladimir',
          'vocational education VPC',
          'RSScool/Frontend: stage0, stage1, stage2, TGNGU: UI designer',
          'I love interfaces. Thinking through the user path, drawing and implementing. Hobbies: juggling, fire show.',
          'Nuttik',
          'https://github.com/Nuttik',
          natalyaPhoto,
        ),
      ),
    );
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
