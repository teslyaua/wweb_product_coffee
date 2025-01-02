async function sendPoll(client, chatID, question, answers) {
  return await client.sendPollMessage(chatID, question, answers);
}

async function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function getPollResults(client, chatID, msgId) {
  const votesData = await client.getVotes(msgId.id);
  const formattedVotes = votesData.votes.map((vote) => {
    const sender = vote.sender?.user || "Unknown Sender";
    const selectedOptions = Array.isArray(vote.selectedOptions)
      ? vote.selectedOptions.filter((opt) => opt).map((opt) => opt.name || "Unknown Option")
      : [];
    const timestamp = new Date(vote.timestamp).toLocaleString();
    return { sender, selectedOptions, timestamp };
  });

  const messageContent = formattedVotes
    .map(
      (vote) => `Sender: ${vote.sender}\nOptions: ${vote.selectedOptions.join(", ")}\nTime: ${vote.timestamp}`
    )
    .join("\n\n");

  await client.sendText(chatID, `Poll Results:\n\n${messageContent}`);
}

async function getYesVotesAndPair(client, chatID, msgId) {
  const votesData = await client.getVotes(msgId.id);
  const yesVotes = votesData.votes
    .filter(
      (vote) =>
        Array.isArray(vote.selectedOptions) &&
        vote.selectedOptions.some((option) => option?.name === "Yes")
    )
    .map((vote) => vote.sender?.user || "Unknown Sender");

  shuffleArray(yesVotes);

  const pairs = [];
  while (yesVotes.length > 1) {
    const user1 = yesVotes.shift();
    const user2 = yesVotes.shift();
    pairs.push([user1, user2]);
  }

  let finalMessage = "Hey dear Product People, here are some random coffee pairs ☕️😉:";
  const mentionedUsers = [];
  pairs.forEach(([user1, user2]) => {
    finalMessage += `Hey, @${user1} your pair is @${user2}\n`;
    mentionedUsers.push(user1, user2);
  });

  if (yesVotes.length === 1) {
    finalMessage += `Hey, @${yesVotes[0]} unfortunately, there is no pair for you this time\n.`;
    mentionedUsers.push(yesVotes[0]);
  }

  await client.sendMentioned(chatID, finalMessage.trim(), mentionedUsers);
}

module.exports = { sendPoll, getPollResults, getYesVotesAndPair };