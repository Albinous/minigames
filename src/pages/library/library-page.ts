import './library-page.scss';
import categoriesJson from '../../data/categories.json';
import gameCardJson from '../../data/all-games-seed.json';
import { createElement, createContainer } from '../../shared';
import type { ArrowType, SortOption } from './library-page.types';
import { GameCard } from '../../components';
import type { IGame } from '../../core';
import arrowLeftIcon from '../../assets/icons/pagination_backward.svg';
import arrowRightIcon from '../../assets/icons/pagination_forward.svg';
import { setActiveElement } from '../../shared/utils/set-active-element';

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
  private readonly gamesPerPage: number = 6;
  private currentPage: number = 1;
  private readonly pageSum: number = Math.ceil(gameCardJson.meta.totalItems / this.gamesPerPage);

  private createSection(): HTMLElement {
    const section = createElement('section', { className: 'library' });
    const container = createContainer('container');
    const header = this.createHeader();
    const controls = this.createControls();
    const gameCards = this.createGameCards();
    const pagination = this.createPagination();

    container.append(header, controls, gameCards, pagination);
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
    return this.sortOptions.some((option) => option.value === value);
  }

  private createGameCards(): HTMLElement {
    const container = createContainer('game-cards');
    const gameData = gameCardJson.data;

    const gamesOnPage = this.getGamesPerPage(gameData, this.currentPage);

    for (const game of gamesOnPage) {
      const gameCard = new GameCard(game);
      container.append(gameCard.render());
    }

    return container;
  }

  private getGamesPerPage(games: IGame[], page: number): IGame[] {
    const start = (page - 1) * this.gamesPerPage;
    const end = this.gamesPerPage + start;

    return games.slice(start, end);
  }

  private createPagination(): HTMLElement {
    const container = createContainer('library-pagination');
    const previousButton = this.createArrowButton('prev', 'Previous', arrowLeftIcon);
    const nextButton = this.createArrowButton('next', 'Next', arrowRightIcon);
    const pageButtons = this.createPageButtons();

    container.append(previousButton, pageButtons, nextButton);
    return container;
  }

  private createArrowButton(type: ArrowType, label: string, iconSource: string): HTMLButtonElement {
    const isDisabled =
      (type === 'prev' && this.currentPage === 1) ||
      (type === 'next' && this.currentPage === this.pageSum);
    const button = createElement('button', {
      className: `btn btn-secondary library-pagination__arrow library-pagination__arrow-${type}`,
      attributes: {
        type: 'button',
        'aria-label': `${label} page`,
        disabled: isDisabled,
      },
    });
    const icon = createElement('img', {
      className: 'library-pagination__icon',
      attributes: {
        src: iconSource,
        alt: '',
      },
    });
    button.append(icon);

    return button;
  }

  private createPageButtons(): HTMLElement {
    const pageButtons = createContainer('library-pagination__pages');

    for (let index = 1; index <= this.pageSum; index++) {
      const pageButton = this.createPageButton(index);
      pageButtons.append(pageButton);
    }

    return pageButtons;
  }

  private createPageButton(page: number): HTMLButtonElement {
    const button = createElement('button', {
      className: 'btn btn-secondary library-pagination__page',
      text: `${page}`,
      attributes: {
        type: 'button',
        'data-page': `${page}`,
      },
    });

    if (button.textContent === `${this.currentPage}`) {
      button.classList.add('active');
    }

    return button;
  }

  private setCurrentPage(main: HTMLElement, page: number) {
    this.currentPage = page;

    const pageButtons = main.querySelectorAll<HTMLButtonElement>('.library-pagination__page');
    const pageButton = main.querySelector<HTMLButtonElement>(
      `[data-page="${CSS.escape(String(this.currentPage))}"]`,
    );
    if (!pageButton) return;

    setActiveElement(pageButtons, pageButton);
  }

  private setDisabledArrow(previous: HTMLButtonElement, next: HTMLButtonElement) {
    previous.disabled = this.currentPage === 1;
    next.disabled = this.currentPage === this.pageSum;
  }

  private bindPaginationEvents(main: HTMLElement): void {
    const pagesContainer = main.querySelector('.library-pagination');
    if (!pagesContainer) return;

    pagesContainer.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>('[data-page]');
      if (!button) return;

      const pageNumber = Number(button.dataset.page);
      if (!pageNumber) return;

      this.setCurrentPage(main, pageNumber);

      const previousButton = pagesContainer.querySelector<HTMLButtonElement>(
        '.library-pagination__arrow-prev',
      );
      const nextButton = pagesContainer.querySelector<HTMLButtonElement>(
        '.library-pagination__arrow-next',
      );

      if (!previousButton || !nextButton) return;
      this.setDisabledArrow(previousButton, nextButton);
    });
  }

  private bindPaginationArrowEvents(main: HTMLElement): void {
    const previousButton = main.querySelector<HTMLButtonElement>('.library-pagination__arrow-prev');
    const nextButton = main.querySelector<HTMLButtonElement>('.library-pagination__arrow-next');
    if (!previousButton || !nextButton) return;

    previousButton.addEventListener('click', () => {
      this.setCurrentPage(main, this.currentPage - 1);
      this.setDisabledArrow(previousButton, nextButton);
    });
    nextButton.addEventListener('click', () => {
      this.setCurrentPage(main, this.currentPage + 1);
      this.setDisabledArrow(previousButton, nextButton);
    });
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
      if (!(event.target instanceof Element)) return;
      const optionSelected = event.target.closest<HTMLButtonElement>('[data-sort]');

      if (!optionSelected) return;

      const sort = optionSelected.dataset.sort;

      if (!sort || !this.isSortOption(sort)) return;

      this.sortSelected = sort;

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
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>('[data-category]');

      if (!button) return;

      const buttons = categories.querySelectorAll<HTMLButtonElement>('[data-category]');

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
    this.bindPaginationEvents(main);
    this.bindPaginationArrowEvents(main);

    return main;
  }
}
