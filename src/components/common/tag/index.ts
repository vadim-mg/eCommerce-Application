import BaseElement, { ElementProps } from '@Src/components/common/base-element';

/**
 * Return new exemplar of BaseElement
 * @param props: ElementProps
 * @param children: array of child elements
 * @returns BaseElement
 */
function tag<T extends HTMLElement>(
  props: ElementProps<T>,
  ...children: BaseElement<HTMLElement>[]
) {
  return new BaseElement(props, ...children);
}

export default tag;
