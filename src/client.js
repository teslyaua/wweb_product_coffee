const wppconnect = require("@wppconnect-team/wppconnect");

let client;

const createClient = async () => {
  try {
    // Attempt to create a client, preserving the session if available
    if (!client) {
      client = await wppconnect.create({
        session: 'product-coffee', 
      });
    }
    return client;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

module.exports = { createClient };