import { createElement } from '../../shared/utils/create-element';
import categoriesJson from '../../data/categories.json';

export class LibraryPage {
  private createSection(): HTMLElement {
    const section = createElement('section', { className: 'library' });
    const container = createElement('div', { className: 'container' });
    const title = createElement('h1', { className: 'library-title', text: 'Game Library' });
    const text = createElement('p', {
      className: 'library-text',
      text: 'Browse our collection of casual mini-games',
    });
    const controls = this.createControls();

    container.append(title, text, controls);
    section.append(container);

    return section;
  }

  private createContainer(className: string): HTMLElement {
    const container = createElement('div', {className: className});

    return container
  }

  private createControls(): HTMLElement {
    const container = this.createContainer('library-controls');
    const categories = this.createCategories();
    const sorting = this.createSorting();

    container.append(categories, sorting);

    return container;
  }

  private createCategories():HTMLElement {
    const categories = createElement('div', {className: 'library-categories'});
    const categoriesData = categoriesJson.data;
    for (const category of categoriesData) {
      const categoryButton = createElement('button', {className: 'library-category', text: category.label});
      categories.append(categoryButton);
    }

    return categories;
  }

  private createSorting(): HTMLElement {
    const sortingButton = createElement('button', {className: 'library-sort', text:'Sort by: Rating ↓'});

    return sortingButton;
  }

  public render(): HTMLElement {
    const main = createElement('main', { className: 'main' });

    const wrapper = this.createSection();

    main.append(wrapper);

    return main;
  }
}
