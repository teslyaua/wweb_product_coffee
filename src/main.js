const wppconnect = require("@wppconnect-team/wppconnect");
const { handleMessage } = require("./commands");

async function start(client) {
  console.log('Current directory:', __dirname);
  try {
    console.log("Bot started...");
    client.onMessage((msg) => handleMessage(client, msg));
  } catch (error) {
    console.error("Error starting the bot:", error);
  }
}

wppconnect
  .create()
  .then((client) => start(client))
  .catch((error) => console.log(error));