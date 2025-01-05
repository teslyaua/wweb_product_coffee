const { sendPoll, getPollResults, getYesVotesAndPair } = require("./votes");

// Data for Product Coffee
const chatID = "120363367329563787@g.us";
const question = "New Product Coffee 🎉? Deadline today EOD.";
const helloResponse = `Hi there! ☕️ I’m here to help you brew some perfect coffee connections! No worries, I’m not taking anyone’s job… yet. 😏`;
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

      case "hello pdm assistant!":
        await client.reply(msg.from, helloResponse, msg.id.toString());
        break;

      case "!chat details":
        const chats = await client.listChats();
        await client.sendText(msg.from, `The assistant has ${chats.length} chats open.`);
        // Extract the IDs
        const chatIds = chats.map(chat => chat.id._serialized); // Assuming `_serialized` is the ID format used

        console.log("Chat IDs:", chatIds);
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