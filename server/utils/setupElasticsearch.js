import elasticsearchClient from './elasticsearchClient.js';

const setupElasticsearch = async () => {
  try {
    const indexName = 'books';
    const exists = await elasticsearchClient.indices.exists({ index: indexName });

    if (!exists) {
      await elasticsearchClient.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              title: { type: 'text' },
              author: { type: 'text' },
              description: { type: 'text' },
              coverPhoto: { type: 'text' },
            },
          },
        },
      });
      console.log(`Index "${indexName}" created.`);
    } else {
      console.log(`Index "${indexName}" already exists.`);
    }
  } catch (error) {
    console.error('Error setting up Elasticsearch index:', error);
  }
};

export default setupElasticsearch;
