const SEARCH_DELAY = 300;
const SEARCH_URL = 'https://developer.mozilla.org/api/v1/search/en-US?q=';
const BASE_URL = 'https://developer.mozilla.org/en-US/docs/';

export default class MdnSearch extends HTMLElement {
    constructor() {
        super();
        this.currentSelection = null;
        this.selections = null;
        this.searchTimeout = null;
        this.resultContainer = null;
        this.heldKeys = [];
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
            const inputField = this.shadowRoot.querySelector('input');
            inputField.addEventListener('input', this.doSearch.bind(this));
            inputField.addEventListener('keydown', this.handleKeyDown.bind(this));
            inputField.addEventListener('keyup', this.handleKeyUp.bind(this));

            this.resultContainer = this.shadowRoot.querySelector('#results');
        });
    }

    doSearch(e) {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        const val = e.target.value;
        if (val.length < 2) {
            this.clearSearchArea();
            clearTimeout(this.searchTimeout);
            return;
        }

        this.searchTimeout = setTimeout(() => this.searchMDN(val), SEARCH_DELAY);
    }

    handleKeyDown(e) {
        const key = e.key;
        if (!this.heldKeys.includes(key)) {
            this.heldKeys.push(key);
        }
        console.log(this.heldKeys);
        if (this.selections) {
            if (key === 'Tab') {
                e.preventDefault();
                this.selections[this.currentSelection].removeAttribute('selected');
                if (this.heldKeys.includes('Shift')) {
                    this.currentSelection--;
                } else {
                    this.currentSelection++;
                }
                if (this.currentSelection < 0) this.currentSelection = this.selections.length - 1;
                if (this.currentSelection > this.selections.length - 1) this.currentSelection = 0;
                this.selections[this.currentSelection].setAttribute('selected', '');
            }
            if (key === 'Enter') {
                window.location = this.selections[this.currentSelection].href;
            }
        }
    }

    handleKeyUp(e) {
        console.log('Key up: ', e.key);
        this.heldKeys = this.heldKeys.filter(k => k !== e.key);
    }

    getPageUrl(selection) {
        return BASE_URL + selection.slug;
    }

    clearSearchArea() {
        this.resultContainer.innerHTML = '';
        this.selections = null;
        this.currentSelection = null;
    }

    async searchMDN(searchValue) {
        console.log('Searching with ', searchValue);
        const searchQuery = encodeURI(SEARCH_URL + searchValue);
        const searchResult = await fetch(searchQuery).then(res => res.json());

        const results = searchResult.documents;
        console.log(searchResult);
        console.log(results);

        this.selections = [];
        this.currentSelection = 0;
        const fragment = document.createDocumentFragment();
        results.forEach((result, i) => {
            const resultRow = this.createResultRow(result, searchValue);
            this.selections.push(resultRow);
            if (i === this.currentSelection) {
                resultRow.setAttribute('selected', '');
            }
            fragment.appendChild(resultRow);
        });

        const resultContainer = this.shadowRoot.querySelector('#results');
        resultContainer.innerHTML = '';
        resultContainer.appendChild(fragment);
    }

    createResultRow(result, searchValue) {
        const anchor = document.createElement('a');
        anchor.href = this.getPageUrl(result);
        // Mark is already provided so this isn't needed
        //const searchMatchRegex = new RegExp(searchValue, 'g');
        //anchor.innerHTML = `${result.replace(searchMatchRegex, `<span>${searchValue}</span>`)}`;
        const title = document.createElement('h3');
        title.innerText = result.title;
        anchor.appendChild(title);

        const content = document.createElement('p');
        content.innerHTML = result.excerpt;
        anchor.appendChild(content);
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
                    box-sizing: border-box;

                    --highlight-color: #c2e8f9;
                    --selected-color: #252627;
                }

                input {
                    font-size: inherit;
                    width: 100%;
                    padding: 1rem 0.5rem;
                    color: inherit;
                    border: 2px solid;
                    background: transparent;
                    outline: none;
                }

                #results {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    font-size: 1.1rem;
                }

                #results a {
                    width: 100%;
                    padding: 1rem 0.5rem;
                    margin: 0;
                    border-style: solid;
                    border-width: 0 2px 2px 2px;
                    color:inherit;
                    text-decoration: none;
                }

                #results a[selected] {
                    background-color: var(--selected-color);
                }

                #results h3 {
                    margin: 0.5rem 0;
                }

                #results span,
                #results mark {
                    background-color: inherit;
                    color: var(--highlight-color);
                }
            </style>
        `;
    }
}

if (!customElements.get('mdn-search')) {
    customElements.define('mdn-search', MdnSearch);
}
