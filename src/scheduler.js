const wppconnect = require("@wppconnect-team/wppconnect");
const schedule = require("node-schedule");
const { handleMessage } = require("./commands");
const { sendPoll, getYesVotesAndPair } = require("./votes");

// Data for Product Coffee
const chatID = "120363367329563787@g.us";
const question = "New Product Coffee 🎉? Deadline today EOD.";
const answers = ["Yes", "Not this time"];
let msgId = "";

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
    
    // Example: Poll every Wednesday at 23:09 every 2 weeks
    // schedule.scheduleJob('poll-job', '9 23 * * 3/2', async () => {
    schedule.scheduleJob('poll-job', '41 17 * * *', async () => {
      console.log("Sending poll...");
      msgId = await sendPoll(client, chatID, question, answers);
    });

    // schedule.scheduleJob('follow-up-job', '9 10 * * 4/2', async () => {
    schedule.scheduleJob('follow-up-job', '42 17 * * *', async () => {
      console.log("Generating pairs...");
      await getYesVotesAndPair(client, chatID, msgId);
    });

  } catch (error) {
    console.error("Error starting the bot with scheduler:", error);
  }
}
