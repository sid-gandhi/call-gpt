const { PineconeStore } = require("@langchain/pinecone");
const { CohereEmbeddings } = require("@langchain/cohere");

// Returns vector-store handle to be used a retrievers on langchains
async function getVectorStoreSearchResults(client, query, namespace) {
  try {
    const embeddings = new CohereEmbeddings({ model: "embed-english-v3.0" });
    const index = client.Index(process.env.PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text",
      namespace,
    });

    const searchResults = await vectorStore.similaritySearch(query, 2);

    const context = searchResults
      .map((result) => result.pageContent)
      .join("\n");

    const sources = [
      ...new Set(searchResults.map((result) => result.metadata.source)),
    ];

    const sourceAndContext = searchResults.map((result) => {
      return {
        source: result.metadata.source,
        context: result.pageContent,
      };
    });

    return { context, sources, sourceAndContext };
  } catch (error) {
    console.log("error ", error);
    throw new Error("Something went wrong while getting vector store !");
  }
}

module.exports = { getVectorStoreSearchResults };
