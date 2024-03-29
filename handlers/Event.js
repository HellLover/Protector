const { readdirSync } = require("fs"); // You don't need to install this again.

module.exports = client => {
  const events = readdirSync("./events/");
  for (let event of events) {
    let file = require(`../events/${event}`);
    client.on(event.split(".")[0], (...args) => file(client, ...args));
    // This will remove the .js and only with the name of the event.
  }
}
