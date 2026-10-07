import './library-page.scss';
import { createElement, createContainer, setActiveElement } from '../../shared';
import type { ArrowType } from './library-page.types';
import { EmptyState, ErrorState, GameCard, GameCardSkeleton } from '../../components';
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
import { CategorySkeleton } from './category-skeleton/category-skeleton';
import { Snackbar } from '../../components/snackbar/snackbar';
import { updateUrl } from '../../shared/utils/update-url';

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
  private readonly onDetailsClick: (slug: string) => void;
  private readonly errorState = new ErrorState();
  private readonly emptyState = new EmptyState();
  private readonly snackbar = new Snackbar();

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

  private async retryLoadGames(main: HTMLElement): Promise<void> {
    const loadPromise = this.gamesService.loadGames(this.gamesQuery);

    this.updateCards(main);

    await loadPromise;

    if (this.store.games.error) {
      this.snackbar.show('Failed to load games', 'error');
    }

    this.updateCards(main);
    this.updatePageButtons(main);
  }

  private async retryLoadCategories(main: HTMLElement): Promise<void> {
    const loadPromise = this.categoriesService.loadCategories();

    this.updateCategories(main);

    await loadPromise;

    if (this.store.categories.error) {
      this.snackbar.show('Failed to load categories', 'error');
    } else {
      this.snackbar.show('Categories loaded successfully', 'success');
    }

    this.updateCategories(main);
  }

  private createSection(main: HTMLElement): HTMLElement {
    const section = createElement('section', { className: 'library' });
    const container = createContainer('container');
    const header = this.createHeader();
    const controls = this.createControls(main);
    const gameCards = this.createGameCards(main);
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

  private createControls(main: HTMLElement): HTMLElement {
    const container = createContainer('library-controls');
    const categories = this.createCategories(main);
    const sorting = this.createSorting();

    container.append(categories, sorting);

    return container;
  }

  private createCategories(main: HTMLElement): HTMLElement {
    const container = createElement('div', { className: 'library-categories' });
    if (this.store.categories.isLoading) {
      const skeleton = new CategorySkeleton();

      container.append(skeleton.render());

      return container;
    }

    if (this.store.categories.error) {
      const errorState = this.errorState.render(this.store.categories.error, () =>
        this.retryLoadCategories(main),
      );

      container.append(errorState);

      return container;
    }

    if (this.categoriesData.length === 0) {
      const emptyState = this.emptyState.render();

      container.append(emptyState);

      return container;
    }

    for (const category of this.categoriesData) {
      const categoryButton = createElement('button', {
        className: 'btn btn-secondary library-category',
        text: category.label,
        attributes: {
          type: 'button',
          'data-category': category.slug,
        },
      });

      if (category.slug === this.categorySelected) {
        categoryButton.classList.add('active');
      }

      container.append(categoryButton);
    }

    return container;
  }

  private updateCategories(main: HTMLElement): void {
    const categories = main.querySelector('.library-categories');

    if (!categories) return;

    const newCategories = this.createCategories(main);

    categories.replaceWith(newCategories);

    this.bindCategoryEvents(main);
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

  private createGameCards(main: HTMLElement): HTMLElement {
    const container = createContainer('game-cards');

    if (this.store.games.isLoading) {
      const skeleton = new GameCardSkeleton();

      for (let index = 0; index < this.gamesPerPage; index += 1) {
        container.append(skeleton.render());
      }

      return container;
    }

    if (this.store.games.error) {
      const errorState = this.errorState.render(this.store.games.error, () =>
        this.retryLoadGames(main),
      );

      container.append(errorState);
      return container;
    }

    if (this.gamesData.length === 0) {
      const emptyState = this.emptyState.render();

      container.append(emptyState);
      return container;
    }

    for (const game of this.gamesData) {
      const gameCard = new GameCard(game, this.onDetailsClick);
      container.append(gameCard.render());
    }

    return container;
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

      const buttons = categories.querySelectorAll<HTMLButtonElement>('[data-category]');

      setActiveElement(buttons, button);

      await this.gamesService.loadGames({ ...this.gamesQuery, page: 1 });

      if (this.store.games.error) {
        this.snackbar.show('Failed to load games', 'error');
      } else {
        this.snackbar.show('Games loaded successfully', 'success');
      }
      this.updateCards(main);
      this.updatePageButtons(main);

      updateUrl({
        category,
        page: 1,
      });
    });
  }

  private isCategoryOption(value: string): value is Category {
    return ['all', 'puzzle', 'card', 'match', 'farm', 'strategy', 'arcade'].includes(value);
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
      const sortButton = sortContainer.querySelector<HTMLButtonElement>('.library-sort__btn');
      if (sortButton) {
        sortButton.textContent = `Sort by: ${optionSelected.textContent}`;
      }

      const options = sortContainer.querySelectorAll<HTMLButtonElement>('.library-sort__option');

      setActiveElement(options, optionSelected);

      sortContainer.classList.remove('is-open');

      await this.gamesService.loadGames({ ...this.gamesQuery, page: 1 });

      if (this.store.games.error) {
        this.snackbar.show('Failed to load games', 'error');
      } else {
        this.snackbar.show('Games loaded successfully', 'success');
      }
      this.updateCards(main);
      this.updatePageButtons(main);

      updateUrl({ sort, page: 1 });
    });
  }

  private isSortOption(value: string): value is SortOption {
    return this.sortOptions.some((option) => option.value === value);
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
      (type === 'next' && this.currentPage === this.totalPages);
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

    const maxVisiblePages = window.innerWidth < 768 ? 3 : 4;

    for (let index = 1; index <= Math.min(maxVisiblePages, this.totalPages); index++) {
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

  private setDisabledArrow(previous: HTMLButtonElement, next: HTMLButtonElement) {
    previous.disabled = this.currentPage === 1;
    next.disabled = this.currentPage === this.totalPages;
  }

  private async changePage(main: HTMLElement, page: number): Promise<void> {
    await this.gamesService.loadGames({ ...this.gamesQuery, page });

    this.updateCards(main);
    this.updatePageButtons(main);
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
      void this.changePage(main, pageNumber);
      updateUrl({ page: pageNumber });
    });
  }

  private bindPaginationArrowEvents(main: HTMLElement): void {
    const previousButton = main.querySelector<HTMLButtonElement>('.library-pagination__arrow-prev');
    const nextButton = main.querySelector<HTMLButtonElement>('.library-pagination__arrow-next');
    if (!previousButton || !nextButton) return;

    previousButton.addEventListener('click', () => {
      const page = this.currentPage - 1;
      void this.changePage(main, page);
      updateUrl({ page });
    });
    nextButton.addEventListener('click', () => {
      const page = this.currentPage + 1;
      void this.changePage(main, page);
      updateUrl({ page });
    });
  }

  private bindResizeEvent(main: HTMLElement): void {
    window.addEventListener('resize', () => {
      this.updatePageButtons(main);
    });
  }

  private async updateCards(main: HTMLElement): Promise<void> {
    const gameCardsContainer = main.querySelector('.game-cards');
    if (!gameCardsContainer) return;
    const newGameCards = this.createGameCards(main);

    gameCardsContainer?.replaceWith(newGameCards);
  }

  private get categoriesData(): CategoryData[] {
    return this.store.categories.data?.data ?? [];
  }

  private get gamesData(): IGame[] {
    return this.store.games.data?.data ?? [];
  }

  private get currentPage(): number {
    return this.store.games.data?.meta?.page ?? 1;
  }

  private get totalPages(): number {
    return Math.max(this.store.games.data?.meta?.totalPages ?? 0, 1);
  }

  private get gamesQuery(): GamesQuery {
    return {
      page: this.currentPage,
      limit: this.gamesPerPage,
      category: this.categorySelected,
      sort: this.sortSelected,
    };
  }

  public async load(page: number = 1): Promise<void> {
    await Promise.all([
      this.gamesService.loadGames({
        ...this.gamesQuery,
        page,
      }),
      this.categoriesService.loadCategories(),
    ]);

    if (this.store.games.error) {
      this.snackbar.show('Failed to load games', 'error');
    } else {
      this.snackbar.show('Games loaded successfully', 'success');
    }

    if (this.store.categories.error) {
      this.snackbar.show('Failed to load categories', 'error');
    } else {
      this.snackbar.show('Categories loaded successfully', 'success');
    }
  }

  public async render(): Promise<HTMLElement> {
    const parameters = new URLSearchParams(globalThis.location.search);

    const category = parameters.get('category');
    const sort = parameters.get('sort');
    const page = Number(parameters.get('page') ?? '1');

    if (category && this.isCategoryOption(category)) {
      this.categorySelected = category;
      this.gamesQuery.category = category;
    }

    if (sort && this.isSortOption(sort)) {
      this.sortSelected = sort;
      this.gamesQuery.sort = sort;
    }

    const loadPromise = this.load(page);

    const main = createElement('main', { className: 'main' });
    const section = this.createSection(main);
    main.append(section);

    this.bindCategoryEvents(main);
    this.bindSortButtonEvents(main);
    this.bindSortOptionsEvents(main);
    this.bindPaginationEvents(main);
    this.bindPaginationArrowEvents(main);
    this.bindResizeEvent(main);

    void loadPromise.then(() => {
      this.updateCards(main);
      this.updateCategories(main);
      this.updatePageButtons(main);
    });

    return main;
  }
}
