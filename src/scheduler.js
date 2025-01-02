const schedule = require("node-schedule");
const { sendPoll, getYesVotesAndPair } = require("../votes");
const { createClient } = require("./client");

const chatID = "120363367329563787@g.us";

async function scheduleTasks() {
    const client = await createClient();

     // Schedule the poll at 9 AM every day
    schedule.scheduleJob("19 23 * * *", async () => {
        console.log("Sending poll...");
        const msgId = await sendPoll(client, chatID);

    // Schedule the pairing 11 hours later
    schedule.scheduleJob(new Date(Date.now() + 2 * 60 * 1000), async () => {
      console.log("Generating pairs...");
      await getYesVotesAndPair(client, chatID, msgId);
    });
  });

  console.log("Scheduler is running.");
}

scheduleTasks().catch((error) => console.error("Error in scheduler:", error));