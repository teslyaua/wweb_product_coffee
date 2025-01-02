const { sendPoll, getPollResults, getYesVotesAndPair } = require("./votes");

// Data for Product Coffee
const chatID = "120363367329563787@g.us";
const question = "New Product Coffee 🎉? Deadline today EOD.";
const answers = ["Yes", "Not this time"];
let msgId = "";

// Command handler
async function handleMessage(client, msg) {
  try {
    switch (msg.body.toLowerCase()) {
      case "!ping":
        await client.sendText(msg.from, "pong");
        break;

      case "!ping reply":
        await client.reply(msg.from, "pong", msg.id.toString());
        break;

      case "!chats":
        const chats = await client.getAllChats();
        await client.sendText(msg.from, `The assistant has ${chats.length} chats open.`);
        break;

      case "!sendpoll":
        msgId = await sendPoll(client, chatID, question, answers);
        break;

      case "!getvotes":
        await getPollResults(client, chatID, msgId);
        break;

      case "!getyesvotes":
        await getYesVotesAndPair(client, chatID, msgId);
        break;

      default:
        console.log(`Unknown command: ${msg.body}`);
    }
  } catch (error) {
    console.error("Error handling message:", error);
  }
}

module.exports = { handleMessage };