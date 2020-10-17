const Readline = require('readline');
const colors = require('colors');


function executeQueueItem (this_, Index) {

    const component = this_.queue[Index];

    if (component.skipped === true && !this_.strict) {
        this_.remove(Index);
        return false;
    };

    if (this_.blocked == true) return false;

    if (!component) return new Error('Component is not available.');

    let Rl = Readline.createInterface(process.stdin, process.stdout);

    function closeRL () { 
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
    }

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
        
        if(question === true) {
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

module.exports = executeQueueItem