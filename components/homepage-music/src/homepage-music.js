export default class HomepageMusic extends HTMLElement {
    static get attributes() {
        return {
            title: { default: 'How are we vibing today? ' },
            playlists: {},
        };
    }

    constructor() {
        super();
        fetch('./playlists.json')
            .then(res => res.json())
            .then(json => {
                this.playlists = json.playlists;
                this.requestRender();
            });
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.setDefaults();
        this.requestRender();
    }

    render() {
        const content = HomepageMusic.template.content.cloneNode(true);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(content);
        this.shadowRoot.innerHTML += `<h2>${this.title}</h2>`;
        this.shadowRoot.innerHTML += this.createPlaylistElements();
    }

    createPlaylistElements() {
        if (!Array.isArray(this.playlists)) {
            return '';
        }
        return this.playlists
            .map(pl => {
                return `
            <a href="${pl.url}">
                <img src="${pl.thumbnail}" />
                <div>
                    <p>${pl.name}</p>
                </div>
            </a>
            `;
            })
            .reduce((a, b) => `${a}${b}`);
    }

    static get template() {
        const template = document.createElement('template');
        template.innerHTML = `${HomepageMusic.style}`;
        return template;
    }

    static get style() {
        return `
            <style>
                :host {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    --background: #202330;
                    --text: #FAE8B6;

                    font-size: 1.6rem;
                    color: var(--text);
                    justify-content: space-between;
                }

                h2 {
                    flex-basis: 100%;
                    text-align: left;
                    margin-bottom: 2rem;
                }

                a {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-basis: 45%;

                    color: inherit;
                    text-decoration: none;
                    margin: 0 0 3rem;
                    background: var(--background);
                    border-radius: 8px;
                    filter: saturate(0.4);
                    transform: scale(1);
                    transition: 300ms ease-in-out;
                    box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
                }

                a:hover,
                a:focus,
                a:focus-within {
                    filter: saturate(1);
                    transform: scale(1.05);
                }

                a div {
                    display: flex;
                    height: 100%;
                    width: 100%;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }

                a div p {
                    margin: 0 0.5rem;
                }

                img {
                    width: 50%;
                    height: 150px;
                    border-radius: 8px 0 0 8px;
                }
            </style>
        `;
    }

    requestRender() {
        if (this._requestRenderCalled) return;

        this._requestRenderCalled = true;
        window.requestAnimationFrame(() => {
            this.render();
            this._requestRenderCalled = false;
        });
    }

    setDefaults() {
        const attributes = HomepageMusic.attributes;
        Object.keys(attributes).forEach(attr => {
            if (!this[attr]) {
                this[attr] = attributes[attr].default;
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        this[name] = newValue === '' ? true : newValue;
        this.requestRender();
    }

    static get observedAttributes() {
        const attributes = HomepageMusic.attributes;
        return Object.keys(attributes).filter(attr => {
            return typeof attributes[attr].watch === 'undefined' || attributes[attr].watch;
        });
    }
}

if (!customElements.get('homepage-music')) {
    customElements.define('homepage-music', HomepageMusic);
}
