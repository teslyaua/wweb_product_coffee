const wppconnect = require("@wppconnect-team/wppconnect");

let  msgId = ""
const  chatID = "120363367329563787@g.us"

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
        // Send a new Poll
      } else if (msg.body === '!sendpoll') {
        msgId = await client.sendPollMessage(chatID, 'New Product Coffee 🎉?', ['Yes', 'Not this time']);
        // Send mentioned
      } else if (msg.body === '!getVotes') {
        const votesData = await client.getVotes(msgId.id);
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
        await client.sendText(chatID, `Poll Results:\n\n${messageContent}`);
      } else if (msg.body === '!getYesVotes') {
        const votesData = await client.getVotes(msgId.id);
        console.log("Raw votes data:", JSON.stringify(votesData, null, 2)); // Log raw data for debugging
        // Format votes
        const yesVotes = votesData.votes
            .filter((vote) =>
                Array.isArray(vote.selectedOptions) &&
                vote.selectedOptions.some((option) => option?.name === 'Yes')
            )
            .map((vote) => vote.sender?.user || "Unknown Sender");

        console.log("Users who voted 'Yes':", yesVotes);

        // Shuffle the list of users
        for (let i = yesVotes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Random index
            [yesVotes[i], yesVotes[j]] = [yesVotes[j], yesVotes[i]]; // Swap
        }

        console.log("Shuffled users:", yesVotes);

        // Create pairs
        const pairs = [];
        while (yesVotes.length > 1) {
            const user1 = yesVotes.shift(); // Remove the first user
            const user2 = yesVotes.shift(); // Remove the next user
            pairs.push([user1, user2]);
        }

        // Prepare a single message
        let finalMessage = "";
        const mentionedUsers = [];

        // Add messages for pairs
        pairs.forEach(([user1, user2]) => {
            finalMessage += `Hey, @${user1} your pair is @${user2}\n`;
            mentionedUsers.push(user1, user2);
        });

        // Add message for unpaired user if any
        if (yesVotes.length === 1) {
            finalMessage += `Hey, @${yesVotes[0]} you don't have a pair this time\n`;
            mentionedUsers.push(yesVotes[0]);
        }

        // Send the final consolidated message with mentions
        await client.sendMentioned(chatID, finalMessage.trim(), mentionedUsers);
          } 
    } catch (error) {
      console.log(error);
    }
  });
}