import { createElement } from './create-element';

export function createContainer(className: string): HTMLElement {
  const container = createElement('div', { className: className });

  return container;
}
