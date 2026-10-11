import { describe, expect, it } from 'vitest';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders a plain skeleton block by default', () => {
    const element = new Skeleton().render();

    expect(element.tagName).toBe('DIV');
    expect(element.className).toBe('skeleton');
  });

  it('adds the given class names', () => {
    expect(new Skeleton().render('wide tall').className).toBe('skeleton wide tall');
  });

  it('creates a new element on every call', () => {
    const skeleton = new Skeleton();

    expect(skeleton.render()).not.toBe(skeleton.render());
  });
});
