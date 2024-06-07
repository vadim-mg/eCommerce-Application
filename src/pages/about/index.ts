import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import TeamMember from '@Src/components/ui/team-member';
import vadimPhoto from '@Assets/img/vadim.jpg';
import yaninaPhoto from '@Assets/img/yanina.jpg';
import natalyaPhoto from '@Assets/img/natalya.jpg';
import classes from './style.module.scss';

export default class AboutPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'main', title: 'about page', showBreadCrumbs: true });
    this.#createContent();
    this.#showContent();
  }

  #createContent = () => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.about,
      },
      tag<HTMLHeadingElement>({ tag: 'h1', text: 'About us', class: classes.mainTitle }),
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
