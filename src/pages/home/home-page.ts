import { Slider } from '../../features/slider/slider';
import { getHomePageView } from './home-page.view';

export class HomePage {
  public render(): HTMLElement {
    const main: HTMLElement = document.createElement('main');

    main.className = 'main';
    main.innerHTML = getHomePageView();

    const slider = new Slider();
    const sliderPlaceholder = main.querySelector('.slider-placeholder');

    sliderPlaceholder?.replaceWith(slider.render());
    return main;
  }
}
