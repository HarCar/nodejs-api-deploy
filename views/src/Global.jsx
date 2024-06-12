class Global {
    constructor() {
        this.screen = '';
        this.action = null
    }

    setScreen(screensName) {
        this.screen = screensName;
    }

    getScreen() {
        return this.screen;
    }

    setAction(action) {
        this.action = action;
    }

    getAction() {
        return this.action;
    }
}

const global = new Global();
export default global;
