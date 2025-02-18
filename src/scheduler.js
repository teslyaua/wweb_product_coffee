const wppconnect = require("@wppconnect-team/wppconnect");
const schedule = require("node-schedule");
const { handleMessage } = require("./commands");
const { sendPoll, getYesVotesAndPair } = require("./votes");

// Data for Product Coffee
const chatID = "120363047279824019@g.us";
const coffeeReminderMessage = `
What is a Product Coffee reminder 💡

“Hey, Product People 👋 It's coffee time in this chat! Let's make our community closer together and organize biweekly TLL Product Coffee. The idea is to match us in random pairs for future coffee/tea. Catch up! 

We are sure you know the concept, but documentation is always a good idea 😅 Hence: 
How Does it Work?
1. Confirm: Confirm your attendance for the next time in the poll below.
2. Matchmaking: We'll use an algorithm to randomly pair you with another community member.
3. Coffee/Tea Chat: Once you receive your match, reach out and schedule a convenient time for your online/offline chat ☕️

This is an excellent opportunity to connect, learn, and share experiences with your peers ⭐️💪
`;
const question = "New Product Coffee timetime ☕️ 🎉? Deadline: today EOD.";
const answers = ["Yes", "Not this time"];
let msg = "";

wppconnect
  .create({ session: 'prd_coffee' })
  .then((client) => start(client))
  .catch((error) => console.error("Error initializing WPPConnect:", error));

function start(client) {
  try {
    console.log("Bot started...");
    client.onMessage((msg) => handleMessage(client, msg));

    // Schedule tasks
    console.log("Scheduling tasks...");
    
    // Send poll on Monday at 09:00 every 2 weeks
    schedule.scheduleJob('poll-job', '00 09 * * 1', async () => {
      console.log("Sending poll...");
      msg = await sendPoll(client, chatID, question, answers);
      await client.sendText(chatID, coffeeReminderMessage);
    });

    // Send pairs on Tuesday at 09:00 every 2 weeks`
    schedule.scheduleJob('follow-up-job', '00 09 * * 2', async () => {
      console.log("Generating pairs...");
      await getYesVotesAndPair(client, chatID, msg);
    });

  } catch (error) {
    console.error("Error starting the bot with scheduler:", error);
  }
}
