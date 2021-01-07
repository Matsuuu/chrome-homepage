export default class HomepageClock extends HTMLElement {
    static get attributes() {
        return {
            title: { default: 'Hello Matsuuu!' },
        };
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.setDefaults();
        this.requestRender();
    }

    render() {
        const date = new Date();
        const content = HomepageClock.template.content.cloneNode(true);
        content.querySelector('h2').innerText = this.title;

        let dateString = "It's ";
        dateString += HomepageClock.dayNames[date.getDay()];
        dateString += `, ${date.getDate()}${HomepageClock.getDateEnding(date.getDay())} of `;
        dateString += HomepageClock.monthNames[date.getMonth()];
        dateString += `, ${date.getHours()}:${date.getMinutes()}`;
        content.querySelector('#dayname').innerText = dateString;

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(content);
    }

    static get template() {
        const template = document.createElement('template');
        template.innerHTML = `${HomepageClock.style}${HomepageClock.html}`;
        return template;
    }

    static get html() {
        return `
            <h2>title</h2>
            <p id="dayname"></p>
        `;
    }

    static get style() {
        return `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
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
        const attributes = HomepageClock.attributes;
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
        const attributes = HomepageClock.attributes;
        return Object.keys(attributes).filter(attr => {
            return typeof attributes[attr].watch === 'undefined' || attributes[attr].watch;
        });
    }

    static get dayNames() {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }

    static get monthNames() {
        return [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
    }

    static getDateEnding(date) {
        const dateString = date.toString();
        const lastNum = dateString.substring(-1);
        switch(parseInt(lastNum)) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3: 
                return "rd";
        }
        return "th";
    }
}

if (!customElements.get('homepage-clock')) {
    customElements.define('homepage-clock', HomepageClock);
}
