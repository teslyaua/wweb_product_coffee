const wppconnect = require("@wppconnect-team/wppconnect");

let  msgId = ""
let msgId2 = ""

wppconnect
  .create()
  .then((client) => start(client))
  .catch((error) => console.log(error));

function start(client) {
  console.log('Starting bot...');
  client.onMessage(async (msg) => {
    try {
      if (msg.body == '!ping') {
        // Send a new message to the same chat
        client.sendText(msg.from, 'pong');
      } else if (msg.body == '!ping reply') {
        // Send a new message as a reply to the current one
        client.reply(msg.from, 'pong', msg.id.toString());
      } else if (msg.body == '!chats') {
        const chats = await client.getAllChats();
        client.sendText(msg.from, `The bot has ${chats.length} chats open.`);
      } else if (msg.body == '!info') {
        let info = await client.getHostDevice();
        let message = `_*Connection info*_\n\n`;
        message += `*User name:* ${info.pushname}\n`;
        message += `*Battery:* ${info.battery}\n`;
        message += `*Plugged:* ${info.plugged}\n`;
        message += `*Device Manufacturer:* ${info.phone.device_manufacturer}\n`;
        message += `*WhatsApp version:* ${info.phone.wa_version}\n`;
        client.sendText(msg.from, message);
      } else if (msg.body === '!sendpoll') {
        msgId = await client.sendPollMessage('120363367329563787@g.us', 'New Product Coffee 🎉?', ['Yes', 'Not this time']);
        console.log(`msgId ======= ${msgId.id}`)

        
      } else if (msg.body === '!getVotes') {
        // const votesData = await client.getVotes(msgId.id);
        // msgId ======= true_120363367329563787@g.us_3EB05DAEC6B57D752EB486_37253649648@c.us
        const votesData = await client.getVotes("true_120363367329563787@g.us_3EB05DAEC6B57D752EB486_37253649648@c.us");

        console.log("Raw votes data:", JSON.stringify(votesData, null, 2)); // Log raw data for debugging
        const formattedVotes = votesData.votes.map((vote) => {
          const sender = vote.sender?.user || "Unknown Sender";

          const selectedOptions = Array.isArray(vote.selectedOptions)
            ? vote.selectedOptions
                .filter((option) => option !== null) // Exclude null values
                .map((option) => option.name || "Unknown Option") // Extract 'name' if it exists
            : [];

          const timestamp = new Date(vote.timestamp).toLocaleString();

          return { sender, selectedOptions, timestamp };
        });

        console.log("Formatted Votes:", JSON.stringify(formattedVotes, null, 2));

        // Sending the results as a message
        const messageContent = formattedVotes
          .map(
            (vote) =>
              `Sender: ${vote.sender}\nOptions: ${vote.selectedOptions.join(", ")}\nTime: ${vote.timestamp}`
          )
          .join("\n\n");
          
        // Send to recipient
        await client.sendText('120363367329563787@g.us', `Poll Results:\n\n${messageContent}`);
      } 
    } catch (error) {
      console.log(error);
    }
  });
}