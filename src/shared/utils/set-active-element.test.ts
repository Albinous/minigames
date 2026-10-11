import { beforeEach, describe, expect, it } from 'vitest';
import { setActiveElement } from './set-active-element';

beforeEach(() => {
  document.body.innerHTML = `
    <button id="one" class="active"></button>
    <button id="two"></button>
    <button id="three"></button>
  `;
});

describe('setActiveElement', () => {
  it('marks only the chosen element as active', () => {
    const elements = document.querySelectorAll<HTMLElement>('button');
    const target = document.querySelector<HTMLElement>('#two');

    if (!target) throw new Error('fixture is broken');

    setActiveElement(elements, target);

    expect([...elements].map((element) => element.classList.contains('active'))).toEqual([
      false,
      true,
      false,
    ]);
  });
});
