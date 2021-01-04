const SEARCH_DELAY = 100;
const SEARCH_URL = 'https://developer.mozilla.org/en-US/search.json?q=';

const testData = [
    'Matsu',
    'Matsuu',
    'Matsuuuu',
    'Matsu12894',
    'Matsu125hah',
    'Matsuuasjsj',
    'Thing',
    'ThingTwo',
    'Twiit',
    'Taat',
];

export default class MdnSearch extends HTMLElement {
    constructor() {
        super();
        this.searchTimeout = null;
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const content = MdnSearch.template.content.cloneNode(true);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(content);
        window.requestAnimationFrame(() => {
            this.shadowRoot.querySelector('input').addEventListener('input', this.doSearch.bind(this));
        });
    }

    doSearch(e) {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        const val = e.target.value;
        if (val.length < 1) {
            this.clearSearchArea();
            return;
        }

        this.searchTimeout = setTimeout(() => this.searchMDN(val), SEARCH_DELAY);
    }

    clearSearchArea() {
        const resultContainer = this.shadowRoot.querySelector('#results');
        resultContainer.innerHTML = '';
    }

    async searchMDN(searchValue) {
        console.log('Searching with ', searchValue);
        const searchQuery = encodeURI(SEARCH_URL + searchValue);

        //const searchResult = await fetch(searchQuery);

        const results = testData.filter(d => d.includes(searchValue)).slice(0, 5);
        console.log(results);

        const fragment = document.createDocumentFragment();
        results.forEach(result => {
            fragment.appendChild(this.createResultRow(result, searchValue));
        });

        const resultContainer = this.shadowRoot.querySelector('#results');
        resultContainer.innerHTML = '';
        resultContainer.appendChild(fragment);
    }

    createResultRow(result, searchValue) {
        const anchor = document.createElement('a');
        const searchMatchRegex = new RegExp(searchValue, 'g');
        anchor.innerHTML = `${result.replace(searchMatchRegex, `<span>${searchValue}</span>`)}`;
        return anchor;
    }

    static get template() {
        const template = document.createElement('template');
        template.innerHTML = `${MdnSearch.style}${MdnSearch.html}`;
        return template;
    }

    static get html() {
        return `
            <input type="text" id="mdn-search" placeholder="Search from MDN...">
            <div id="results"></div>
        `;
    }

    static get style() {
        return `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    font-size: 1.6rem;

                    --highlight-color: #c2e8f9;
                }

                input {
                    font-size: inherit;
                    width: 100%;
                    padding: 1rem 0.5rem;
                }

                #results {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                }

                #results a {
                    width: 100%;
                    padding: 1rem 0.5rem;
                    margin: 0;
                }

                #results span {
                    color: var(--highlight-color);
                }
            </style>
        `;
    }
}

if (!customElements.get('mdn-search')) {
    customElements.define('mdn-search', MdnSearch);
}
