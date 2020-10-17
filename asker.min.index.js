// Copyright Trebossa 2020 Version 1.2
const Readline = require('readline');
const colors = require('colors');
function executeQueueItem(this_, Index) {
    const component = this_.queue[Index];
    if (component.skipped === true && !this_.strict) {
        this_.remove(Index);
        return false;
    };
    if (this_.blocked == true) return false;
    if (!component) return new Error('Component is not available.');
    let Rl = Readline.createInterface(process.stdin, process.stdout);
    function closeRL() {
        Rl.close();
    };
    /**
     * @description Skips to a position, skipped components will be removed.
     * @param {Number} Index Index - This indicates the position, where the Asker-Instance should continue executing the components.
     */
    function goTo(Index) {
        let skippedComponents = this_.queue.slice(0, Index);
        skippedComponents.map(c => {
            c.skipped = true;
        });
        let components = this_.queue.slice(Index);
        this_.queue = [...skippedComponents, ...components];
    };
    /**
     * @description Blocks the asker. No components will be executed as long as Asker.blocked is equal to true.
     * @param {String} message message - This is the message, it gets logged after the asker was blocked.
     */
    function blockAsker(message) {
        this_.blocked = true;
        if (message) console.log(message);
    };
    return new Promise(resolve => {
        const { message, question } = component;
        if (question === true) {
            Rl.question(message, response => {
                closeRL();
                component.on_response(response, blockAsker, goTo);
                this_.remove(Index);
                resolve(response);
            });
        } else {
            resolve('resolve, invalid type. Did you set in your component question equal to false ?');
        };
    });
};
/**
 * @constructor
 */
class Asker {
    constructor(strict = false) {
        this.queue = [];
        this.blocked = false;
        this.strict = strict;
        /**
         * @description Add a component
         * @param {Component} Component Component - The component which should be added
         * @param {Number} Index Index - The position, where the component should get added (Default: It gets added at the end)
         * @return Error|Boolean
         */
        this.add = (Component = Component, Index = undefined) => {
            if (!Component || typeof Component !== 'object') return new Error('Invalid Component!');
            if (Index !== undefined) {
                let arrBefore = this.queue.slice(0, Index);
                let arrBehind = this.queue.slice(Index);
                this.queue = [...arrBefore, Component, ...arrBehind];
            } else this.queue.push(Component);
            return true;
        };
        /**
         * @description Remove a component
         * @param {Number} Index Index - The position, where the component should get removed (Default: 0)
         * @return Component
         */
        this.remove = (Index = 0) => this.queue.splice(Index, 1);
        /**
         * @description Execute a component. Components will be removed after it's execution
         * @param {Number} Index Index - The position of the component, which should be executed (Default: 0)
         * @return Promise/String|false
         * @async
         */
        this.once = async (Index = 0) => new Promise(async resolve => resolve(await executeQueueItem(this, Index)));
    }

};
/**
 * @constructor
 */
class Component {
    /**
     * @description Create components, even with callbacks, for your asker instance - on_response must be a function, this allows you to make direct reviews of your response, the function includes 2 parameters.; question indicates the type of the component (Default:true). 
     * @param {String} message message - The message of the component, can also be a question
     * @return Error/void
     */
    constructor(message = 'Pass a parameter at the component to write some message or question',
        { question = true,
            on_response = function (
                response = '',
                blockAsker = function (message = '') { },
                goTo = function (Index = 0) { }) { }
        } = {}) {
        if (!message) return new Error('A message is required!');
        this.message = message;
        this.question = question;
        this.on_response = on_response;
        this.skipped = false;
    }
};
module.exports={Asker,Component};
// Copyright Trebossa 2020 Version 1.2
