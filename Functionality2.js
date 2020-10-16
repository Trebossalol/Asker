const { Asker, Component } = require('./Index');

const asker = new Asker();

asker.add(new Component(`Do you want to 'register' or 'login' ?\n`, { on_response: (response, blockAsker, goTo)  => {

    if(!response || !['login','register'].includes(response)) blockAsker('Invalid input. Try again!');

    else switch(response) {
        case 'register':
            goTo(1);
            break;
        case 'login':
            goTo(2);
            break;
    };

}}));

asker.add(new Component('Please enter an e-mail\n', { on_response: (response, blockAsker) => {
    if(!response || !response.includes('@')) blockAsker('Invalid input. Try again!');
}}));

asker.add(new Component('Please enter a username\n', { on_response: (username, blockAsker) => {
    if (!username) blockAsker('Invalid input. Try again!');
}}));

asker.add(new Component('Please enter a password\n', { on_response: (password, blockAsker) => {
    if (!password || password.length < 5) blockAsker('Invalid input. Password must be 5+ characters!');
}}));

async function start() {
    
    const type = await asker.once();
    const email = await asker.once();
    const username = await asker.once();
    const password = await asker.once();

    console.log(`\n ${type} | ${email} | ${username} | ${password}`);

};

start()