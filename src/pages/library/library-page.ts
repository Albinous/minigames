import './library-page.scss';
import categoriesJson from '../../data/categories.json';
import { createElement, createContainer } from '../../shared';
import type { SortOption } from './library-page.types';

export class LibraryPage {
  private readonly sortOptions: {
    value: SortOption, label: string
  }[] = [
    { value: 'rating-asc', label: 'Rating ↑'},
    { value: 'rating-desc', label: 'Rating ↓'},
    { value: 'name-asc', label: 'Name A→Z'},
    { value: 'name-desc', label: 'Name Z→A'}
  ]
  private createSection(): HTMLElement {
    const section = createElement('section', { className: 'library' });
    const container = createContainer('container');
    const header = this.createHeader();
    const controls = this.createControls();

    container.append(header, controls);
    section.append(container);

    return section;
  }

  private createHeader(): HTMLElement {
    const container = createContainer('library-header');
    const title = createElement('h1', { className: 'library-title', text: 'Game Library' });
    const text = createElement('p', {
      className: 'library-text',
      text: 'Browse our collection of casual mini-games',
    });

    container.append(title, text);

    return container;
  }

  private createControls(): HTMLElement {
    const container = createContainer('library-controls');
    const categories = this.createCategories();
    const sorting = this.createSorting();

    container.append(categories, sorting);

    return container;
  }

  private createCategories(): HTMLElement {
    const categories = createElement('div', { className: 'library-categories' });
    const categoriesData = categoriesJson.data;
    for (const category of categoriesData) {
      const categoryButton = createElement('button', {
        className: 'btn btn-secondary library-category',
        text: category.label,
        attributes: {
          type: 'button',
          'data-category': category.slug,
        },
      });

      if (category.isDefault) {
        categoryButton.classList.add('active');
      }

      categories.append(categoryButton);
    }

    return categories;
  }

  private createSorting(): HTMLElement {
    const sortingButton = createElement('button', {
      className: 'btn btn-secondary library-sort__btn',
      text: 'Sort by: Rating ↓',
    });

    return sortingButton;
  }

  private bindCategoryEvents(main: HTMLElement): void {
    const categories = main.querySelector('.library-categories');
    categories?.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const button = target.closest<HTMLButtonElement>('[data-category]');

      if (!button) return;

      const buttons = categories.querySelectorAll<HTMLButtonElement>('[data-category');

      for (const categoryButton of buttons) {
        categoryButton.classList.toggle('active', categoryButton === button);
      }
    });
  }

  public render(): HTMLElement {
    const main = createElement('main', { className: 'main' });

    const section = this.createSection();
    main.append(section);

    this.bindCategoryEvents(main);

    return main;
  }
}
