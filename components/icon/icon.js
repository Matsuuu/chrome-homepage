class AppIcon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        this[name] = newValue;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const content = AppIcon.template.content.cloneNode(true);
        const anchor = content.querySelector('a');
        anchor.href = this.url;

        const image = content.querySelector('img');
        image.src = '/assets/' + this.icon + '.svg';

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(content);
    }

    static get template() {
        const template = document.createElement('template');
        template.innerHTML = `
        <style>
            :host {
              --size: 5rem;
              margin: 1rem 0;
              display: block;
              transition: ease-in-out 200ms;
              filter: saturate(0.4);
              transform: scale(1);
            }

            img {
              width: var(--size);
            }

            
            :host(:hover) {

              filter: saturate(1);
              transform: scale(1.05);
            }
        </style>
          <a href="#">
            <img>
          </a>
        `;
        return template;
    }

    static get observedAttributes() {
        return ['icon', 'url', 'newtab'];
    }
}

if (!customElements.get('app-icon')) {
    customElements.define('app-icon', AppIcon);
}
