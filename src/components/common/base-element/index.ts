export type TagName = keyof HTMLElementTagNameMap;

export type Callback = (event: Event) => void;

export type ElementProps<T extends HTMLElement = HTMLElement> = {
  tag: TagName;
  class?: string | string[];
  text?: string;
} & Omit<Partial<T>, 'tag' | 'class' | 'text'>;

export default class BaseElement<T extends HTMLElement> {
  #node: T;

  /**
   * constructor creates Html Element with
   * if element should have non standard properties or methods, it should extend BaseElement
   * @param props : ElementProps<T> - properties of html element
   * @param children : BaseElement<HTMLElement>[] - array child elements
   */
  constructor(props: ElementProps<T>, ...children: BaseElement<HTMLElement>[]) {
    this.#node = document.createElement(props.tag) as T;

    // add class or classes to element
    if (props.class) {
      if (typeof props.class === 'string') {
        this.node.classList.add(props.class);
      } else if (Array.isArray(props.class)) {
        this.node.classList.add(...props.class);
      }
    }

    // add text to element if it is
    if (props.text) {
      this.node.textContent = props.text;
    }

    // add children if they are
    if (children) {
      children.forEach((element) => {
        this.node.append(element.node);
      });
    }

    // assign other props to this element
    Object.assign(this.#node, props);
  }

  get node() {
    return this.#node;
  }
}
