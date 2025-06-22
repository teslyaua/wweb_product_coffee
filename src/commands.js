const { sendPoll, getPollResults, getYesVotesAndPair } = require("./votes");
const { saveMessageToFile, getLatestMessage } = require("./utils/files-utils"); 


// Data for Product Coffee
const chatID = "120363367329563787@g.us";
const question = "New Product Coffee 🎉? Deadline today EOD.";
const helloResponse = `Hi there! ☕️ I’m here to help you brew some perfect coffee connections! No worries, I’m not taking anyone’s job… yet. 😏`;
const answers = ["Yes", "Not this time"];
let msgId = "";
let messages = [];

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

      case "!chats details":
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

      case "!get messages":
        messages = await client.getMessages(chatID, { count: 10 });
        
        // Log the IDs of the messages
        messages.forEach((message, index) => {
          console.log(`Message ${index + 1}: ID = ${message.id}`);
          console.log(`Message  ${index + 1}: body = ${message.body}`);
        });
        break;

      case "!get latest pairs":
        const checkPhone = "+37253649648@c.us"; // WhatsApp ID format
        // const chatID = "120363047279824019@g.us";

        console.log("Generating pairs...");
        // Get the latest message from the file
        const latestMessage = getLatestMessage();
        if (latestMessage) {
          console.log("Latest stored message:", latestMessage);
        } else {
          console.log("No messages found or error occurred.");
        }

        await getYesVotesAndPair(client, chatID, latestMessage);
        break;

      default:
        console.log(`Unknown command: ${msg.body}`);
    }
  } catch (error) {
    console.error("Error handling message:", error);
  }
}

module.exports = { handleMessage };