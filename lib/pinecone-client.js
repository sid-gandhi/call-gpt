const { Pinecone } = require("@pinecone-database/pinecone");

let pineconeClientInstance = null;

// Initialize index and ready to be accessed.
function initPineconeClient() {
  try {
    const pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    return pineconeClient;
  } catch (error) {
    console.error("error", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}

async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient();
  }

  console.log("Pinecone Client Initialized");

  return pineconeClientInstance;
}

module.exports = { initPineconeClient, getPineconeClient };
