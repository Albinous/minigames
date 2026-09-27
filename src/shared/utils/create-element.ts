type ElementOptions = {
  className?: string;
  text?: string;
  attributes?: Record<string, string | boolean>;
};

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagname: K,
  options: ElementOptions = {},
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagname);

  if (options.className) {
    element.className = options.className;
  }

  if (options.text) {
    element.textContent = options.text;
  }

  if (options.attributes) {
    for (const [name, value] of Object.entries(options.attributes)) {
      if (typeof value === 'boolean') {
        element.toggleAttribute(name, value);
      } else {
        element.setAttribute(name, value);
      }
    }
  }

  return element;
}
