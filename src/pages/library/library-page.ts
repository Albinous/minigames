import './library-page.scss';
import categoriesJson from '../../data/categories.json';
import { createElement, createContainer } from '../../shared';
import type { SortOption } from './library-page.types';

export class LibraryPage {
  private readonly sortOptions: {
    value: SortOption;
    label: string;
  }[] = [
    { value: 'rating-asc', label: 'Rating ↑' },
    { value: 'rating-desc', label: 'Rating ↓' },
    { value: 'name-asc', label: 'Name A→Z' },
    { value: 'name-desc', label: 'Name Z→A' },
  ];
  private sortSelected: SortOption = 'rating-desc';
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
    const container = createContainer('library-sort');
    const button = this.createSortButton();
    const options = this.createSortOptions();

    container.append(button, options);
    return container;
  }

  private createSortButton(): HTMLButtonElement {
    const selectedSort = this.sortOptions.find((option) => option.value === this.sortSelected);
    const buttonText = selectedSort?.label;
    const sortingButton = createElement('button', {
      className: 'btn btn-secondary library-sort__btn',
      text: `Sort by: ${buttonText}`,
    });

    return sortingButton;
  }

  private createSortOptions(): HTMLElement {
    const container = createContainer('library-sort__options');
    for (const option of this.sortOptions) {
      const sortOption = createElement('button', {
        className: 'library-sort__option',
        text: option.label,
        attributes: {
          type: 'button',
          'data-sort': option.value,
        },
      });

      if (option.value === this.sortSelected) {
        sortOption.classList.add('active');
      }

      container.append(sortOption);
    }

    return container;
  }

  private isSortOption(value: string): value is SortOption {
    return this.sortOptions.some(option => option.value === value);
  }

  private bindSortButtonEvents(main: HTMLElement): void {
    const sortContainer = main.querySelector('.library-sort');
    const sortButton = main.querySelector('.library-sort__btn');

    if (!sortContainer || !sortButton) return;

    sortButton.addEventListener('click', () => {
      sortContainer.classList.toggle('is-open');
    });
  }

  private bindSortOptionsEvents(main: HTMLElement): void {
    const sortContainer = main.querySelector('.library-sort');

    sortContainer?.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const optionSelected = target.closest<HTMLButtonElement>('[data-sort]');

      if (!optionSelected) return;

      const sort = optionSelected.dataset.sort;
      if (!sort) return;

      this.sortSelected = sort as SortOption;

      const sortButton = sortContainer.querySelector<HTMLButtonElement>('.library-sort__btn');
      if (sortButton) {
        sortButton.textContent = `Sort by: ${optionSelected.textContent}`;
      }

      const options = sortContainer.querySelectorAll<HTMLButtonElement>('.library-sort__option');

      for (const option of options) {
        option.classList.toggle('active', option === optionSelected);
      }

      sortContainer.classList.remove('is-open');
    });
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
    this.bindSortButtonEvents(main);
    this.bindSortOptionsEvents(main);

    return main;
  }
}
