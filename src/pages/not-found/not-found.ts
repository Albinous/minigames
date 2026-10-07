import './not-found.scss';
import { createContainer, createElement } from "../../shared";

export class NotFound {
  public render(onHomeClick: () => void): HTMLElement {
        const container = createContainer('container')

    const wrapper = createContainer('not-found__wrapper');
    const title = createElement('h1', {
      className: 'not-found__title',
      text: '404'
    });

    const message = createElement('p', {
      className: 'not-found__text',
      text: 'The requested page does not exist'
    });

    const button = createElement('button', {
      className: 'not-found__btn btn btn-primary',
      text: 'Return to Home Page',
      attributes: {
        type: 'button'
      }
    })

    button.addEventListener('click', onHomeClick);

    const main = createElement('main', {
      className: 'not-found'
    });

    wrapper.append(title, message, button);
    container.append(wrapper)
    main.append(container);
    return main;
  }
}