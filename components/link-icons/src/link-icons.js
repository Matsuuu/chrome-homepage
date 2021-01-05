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

            app-icon {
                margin: 1rem 2rem 1rem 0;
            }
            </style>
        `;
    }
}

if (!customElements.get('link-icons')) {
    customElements.define('link-icons', LinkIcons);
}
