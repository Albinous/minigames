import './library-page.scss';
import { createElement, createContainer, setActiveElement } from '../../shared';
import type { ArrowType } from './library-page.types';
import { GameCard } from '../../components';
import {
  CategoriesService,
  type Category,
  type CategoryData,
  type GamesQuery,
  type GamesService,
  type IGame,
  type SortOption,
  type Store,
} from '../../core';
import { arrowLeftIcon, arrowRightIcon } from '../../assets/icons';

export class LibraryPage {
  private readonly store: Store;
  private readonly gamesService: GamesService;
  private readonly categoriesService: CategoriesService;
  private readonly sortOptions: {
    value: SortOption;
    label: string;
  }[] = [
    { value: 'rating-asc', label: 'Rating ↑' },
    { value: 'rating-desc', label: 'Rating ↓' },
    { value: 'name-asc', label: 'Name A→Z' },
    { value: 'name-desc', label: 'Name Z→A' },
  ];

  private categorySelected: Category = 'all';
  private sortSelected: SortOption = 'rating-desc';
  private readonly gamesPerPage: number = 6;
  private currentPage: number = 1;
  private readonly onDetailsClick: (slug: string) => void;

  constructor(
    store: Store,
    gamesService: GamesService,
    categoriesService: CategoriesService,
    onDetailsClick: (slug: string) => void,
  ) {
    this.store = store;
    this.gamesService = gamesService;
    this.categoriesService = categoriesService;
    this.onDetailsClick = onDetailsClick;
  }

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
    for (const category of this.categoriesData) {
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

    for (const game of this.gamesData) {
      const gameCard = new GameCard(game, this.onDetailsClick);
      container.append(gameCard.render());
    }

    return container;
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

    const maxVisiblePages = window.innerWidth < 768 ? 3 : this.pageSum;

    for (let index = 1; index <= Math.min(maxVisiblePages, this.pageSum); index++) {
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

  private bindPaginationEvents(main: HTMLElement): void {
    const pagesContainer = main.querySelector('.library-pagination');
    if (!pagesContainer) return;

    pagesContainer.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>('[data-page]');
      if (!button) return;

      const pageNumber = Number(button.dataset.page);
      if (!pageNumber) return;

      const previousButton = pagesContainer.querySelector<HTMLButtonElement>(
        '.library-pagination__arrow-prev',
      );
      const nextButton = pagesContainer.querySelector<HTMLButtonElement>(
        '.library-pagination__arrow-next',
      );

      if (!previousButton || !nextButton) return;
      this.changePage(main, pageNumber, previousButton, nextButton);
    });
  }

  private bindPaginationArrowEvents(main: HTMLElement): void {
    const previousButton = main.querySelector<HTMLButtonElement>('.library-pagination__arrow-prev');
    const nextButton = main.querySelector<HTMLButtonElement>('.library-pagination__arrow-next');
    if (!previousButton || !nextButton) return;

    previousButton.addEventListener('click', () => {
      this.changePage(main, this.currentPage - 1, previousButton, nextButton);
    });
    nextButton.addEventListener('click', () => {
      this.changePage(main, this.currentPage + 1, previousButton, nextButton);
    });
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

  private async changePage(
    main: HTMLElement,
    page: number,
    previousButton: HTMLButtonElement,
    nextButton: HTMLButtonElement,
  ): Promise<void> {
    this.setCurrentPage(main, page);
    await this.updateCards(main);
    this.setDisabledArrow(previousButton, nextButton);
  }

  private updatePageButtons(main: HTMLElement): void {
    const pageButtons = main.querySelector('.library-pagination__pages');
    if (!pageButtons) return;
    const newPageButtons = this.createPageButtons();
    const previousButton = main.querySelector<HTMLButtonElement>('.library-pagination__arrow-prev');
    const nextButton = main.querySelector<HTMLButtonElement>('.library-pagination__arrow-next');

    pageButtons?.replaceWith(newPageButtons);
    if (!previousButton || !nextButton) return;
    this.setDisabledArrow(previousButton, nextButton);
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

    sortContainer?.addEventListener('click', async (event) => {
      if (!(event.target instanceof Element)) return;
      const optionSelected = event.target.closest<HTMLButtonElement>('[data-sort]');

      if (!optionSelected) return;

      const sort = optionSelected.dataset.sort;

      if (!sort || !this.isSortOption(sort)) return;

      this.sortSelected = sort;
      this.currentPage = 1;

      const sortButton = sortContainer.querySelector<HTMLButtonElement>('.library-sort__btn');
      if (sortButton) {
        sortButton.textContent = `Sort by: ${optionSelected.textContent}`;
      }

      const options = sortContainer.querySelectorAll<HTMLButtonElement>('.library-sort__option');

      setActiveElement(options, optionSelected);

      sortContainer.classList.remove('is-open');

      await this.updateCards(main);
      this.setCurrentPage(main, this.currentPage);
    });
  }

  private bindCategoryEvents(main: HTMLElement): void {
    const categories = main.querySelector('.library-categories');
    categories?.addEventListener('click', async (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>('[data-category]');
      if (!button) return;

      const category = button.dataset.category;
      if (!category || !this.isCategoryOption(category)) return;

      this.categorySelected = category;
      this.currentPage = 1;

      const buttons = categories.querySelectorAll<HTMLButtonElement>('[data-category]');

      setActiveElement(buttons, button);

      await this.updateCards(main);
      this.updatePageButtons(main);
      this.setCurrentPage(main, this.currentPage);
    });
  }

  private isCategoryOption(value: string): value is Category {
    return this.categoriesData.some((option) => option.slug === value);
  }

  private async updateCards(main: HTMLElement): Promise<void> {
    await this.gamesService.loadGames(this.gamesQuery);

    const gameCardsContainer = main.querySelector('.game-cards');
    if (!gameCardsContainer) return;
    const newGameCards = this.createGameCards();

    gameCardsContainer?.replaceWith(newGameCards);
  }

  private get categoriesData(): CategoryData[] {
    return this.store.categories.data?.data ?? [];
  }

  private get gamesData(): IGame[] {
    return this.store.games.data?.data ?? [];
  }

  private get pageSum(): number {
    return this.store.games.data?.meta?.totalPages ?? 0;
  }

  private get gamesQuery(): GamesQuery {
    return {
      page: this.currentPage,
      limit: this.gamesPerPage,
      category: this.categorySelected,
      sort: this.sortSelected,
    };
  }

  public async load(): Promise<void> {
    await Promise.all([
      this.gamesService.loadGames(this.gamesQuery),
      this.categoriesService.loadCategories(),
    ]);
  }

  public async render(): Promise<HTMLElement> {
    await this.load();

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
