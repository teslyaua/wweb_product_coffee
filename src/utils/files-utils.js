const fs = require("fs");
const path = require("path");

function saveMessageToFile(msg, filePath = "messages.json") {
  try {
    const messageData = {
      id: msg.id,
      content: msg.body || "", // Message content (optional fallback)
      timestamp: new Date().toISOString(), // Save the timestamp when the function is called
    };

    // Check if the file exists, create an empty array if it doesn't
    let existingData = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      existingData = JSON.parse(fileContent);
    }

    // Append the new message
    existingData.push(messageData);

    // Write the updated data to the file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf8");

    console.log(`Saved message ${msg.id} to ${path.resolve(filePath)}`);
  } catch (error) {
    console.error("Error saving message to file:", error);
  }
}

function getLatestMessage(filePath = "messages.json") {
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.log(`File ${path.resolve(filePath)} does not exist.`);
      return null;
    }

    // Read and parse the file content
    const fileContent = fs.readFileSync(filePath, "utf8");
    const messages = JSON.parse(fileContent);

    if (!messages || messages.length === 0) {
      console.log("No messages found in the file.");
      return null;
    }

    // Find the latest message by timestamp
    const latestMessage = messages.reduce((latest, current) => {
      return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
    });
    return latestMessage;
  } catch (error) {
    console.error("Error getting latest message from file:", error);
    return null;
  }
}

module.exports = { getLatestMessage, saveMessageToFile };