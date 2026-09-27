import { createElement } from './create-element';

export function iconToSvg(icon: string, container: HTMLElement): SVGElement | undefined {
  if (!icon) return;

  const wrapper = createElement('div');
  wrapper.innerHTML = icon;
  const iconSvg = wrapper.firstElementChild;
  if (iconSvg instanceof SVGElement) {
    container.prepend(iconSvg);
    return iconSvg;
  }

  return;
}
