import classes from './style.module.scss';

export type PageProps = {
  title: string;
};

export default class BasePage {
  protected title: string;

  constructor(props: PageProps = { title: '' }) {
    console.log(3);
    this.title = props.title;
  }

  // this method render page (clear document.body and append container created by constructor)
  render() {
    document.body.innerHTML = '';
    document.body.classList.remove(...document.body.classList);
    document.body.classList.add(classes.page);
    document.title = this.title;
  }
}
