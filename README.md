# Asker

> ### Create Components for your Asker and get the input from the console easily!

## Example
```javascript
async function GET_DATA() {
    const name = await asker.once()
    const age = await asker.once()
    const favGame = await asker.once()

    console.log(`\nName: ${name}\nAge: ${age}\nFavourite game: ${favGame}`)
}; GET_DATA();
```
