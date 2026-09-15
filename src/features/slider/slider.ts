import { getSliderView } from "./slider.view";

export class Slider {
  public render(): HTMLElement {
    const slider = document.createElement('games');

    slider.className = 'slider';
    slider.innerHTML = getSliderView();

    return slider;
  }
}