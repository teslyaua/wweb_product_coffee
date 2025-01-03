const wppconnect = require("@wppconnect-team/wppconnect");
const { handleMessage } = require("./commands");

wppconnect
  .create({session: 'prd_coffee'})
  .then((client) => start(client))
  .catch((error) => console.log(error));

function start(client) {
  try {
    console.log("Bot started...");
    client.onMessage((msg) => handleMessage(client, msg));
  } catch (error) {
    console.error("Error starting the bot:", error);
  }
}