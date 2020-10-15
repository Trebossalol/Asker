# Asker

## Example
```javascript
// Import Classes
const { Asker, Component } = require('./Index');

// Create Components for your App
const first_component = new Component('Whats your Name ?\n');
const second_component = new Component('Whats your Age ?\n', { on_response: (response, blockAsker) => {
    if(parseInt(response) <= 11) blockAsker('You must be 12+!')
}});

// Create an Instance
const asker = new Asker();

// Add Components to Asker, there are 3 ways to add them

// Add them manualy
asker.queue.push(first_component);

// Use the build-in shortcut function
asker.add(second_component);

// Recommended way; Use the shortcut function and enter directly the Component
asker.add(new Component('Whats your favourite game ?\n'));

// Example function of getting all inputs
async function GET_DATA() {
    const name = await asker.once()
    const age = await asker.once()
    const favGame = await asker.once()

    console.log(`\nName: ${name}\nAge: ${age}\nFavourite game: ${favGame}`)
}; 

GET_DATA();

```
