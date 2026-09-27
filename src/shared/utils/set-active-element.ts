export function setActiveElement(
  elements: NodeListOf<HTMLElement>,
  activeElement: HTMLElement,
): void {
  for (const element of elements) {
    element.classList.toggle('active', element === activeElement);
  }
}
