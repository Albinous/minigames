import { describe, expect, it } from 'vitest';
import { iconToSvg } from './icon-to-svg';

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><path d="M0 0"/></svg>';

describe('iconToSvg', () => {
  it('puts the svg into the container and returns it', () => {
    const container = document.createElement('div');
    const icon = iconToSvg(SVG, container);

    expect(icon).toBeInstanceOf(SVGElement);
    expect(container.firstElementChild).toBe(icon);
  });

  it('places the svg before existing content', () => {
    const container = document.createElement('div');

    container.textContent = 'label';
    iconToSvg(SVG, container);

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(container.textContent).toBe('label');
  });

  it('does nothing for an empty icon', () => {
    const container = document.createElement('div');

    expect(iconToSvg('', container)).toBeUndefined();
    expect(container.childNodes).toHaveLength(0);
  });

  it.each(['<div></div>', 'plain text'])('ignores markup that is not an svg: %j', (markup) => {
    const container = document.createElement('div');

    expect(iconToSvg(markup, container)).toBeUndefined();
    expect(container.childNodes).toHaveLength(0);
  });
});
