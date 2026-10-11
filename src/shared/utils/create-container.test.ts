import { describe, expect, it } from 'vitest';
import { createContainer } from './create-container';

describe('createContainer', () => {
  it('creates a div with the given class', () => {
    const container = createContainer('box');

    expect(container.tagName).toBe('DIV');
    expect(container.className).toBe('box');
  });
});
