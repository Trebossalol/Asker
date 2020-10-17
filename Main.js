const executeQueueItem = require('./Queue/executeQueueItem');

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

            if(Index !== undefined) {
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

}

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
       on_response = function(
            response = '', 
            blockAsker=function(message = ''){}, 
            goTo=function(Index = 0){}){} 
    } = {}) {
            

        if (!message) return new Error('A message is required!');
        this.message = message;
        this.question = question;
        this.on_response = on_response;
        this.skipped = false;
    }
}

module.exports = { Asker, Component };