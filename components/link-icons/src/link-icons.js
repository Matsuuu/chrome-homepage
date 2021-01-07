import '../../icon/icon.js';

export default class LinkIcons extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const content = LinkIcons.template.content.cloneNode(true);
        const iconRow = content.querySelector('.icon-row');

        fetch('./links.json')
            .then(res => res.json())
            .then(res => {
                res.links.forEach(link => {
                    iconRow.appendChild(this.createAppIcon(link));
                });

                this.shadowRoot.innerHTML = '';
                this.shadowRoot.appendChild(content);
            });
    }

    createAppIcon(link) {
        const icon = document.createElement('app-icon');
        icon.setAttribute('icon', link.icon);
        icon.setAttribute('url', link.url);
        icon.dataset.title = link.title;
        return icon;
    }

    static get template() {
        const template = document.createElement('template');
        template.innerHTML = `${LinkIcons.style}${LinkIcons.html}`;
        return template;
    }

    static get html() {
        return `
            <div class="icon-row">
            </div>
        `;
    }

    static get style() {
        return `
            <style>
            :host {
                width: 100%;
                display: flex
            }

            .icon-row {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
            }

            .icon-row * {
                flex: 1 1 16.5%;
                text-align: center;
            }
            </style>
        `;
    }
}

if (!customElements.get('link-icons')) {
    customElements.define('link-icons', LinkIcons);
}
