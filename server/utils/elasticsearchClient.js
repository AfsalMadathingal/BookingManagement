import { Client } from '@elastic/elasticsearch';

const elasticsearchClient = new Client({
  node: 'http://localhost:9200',
});

export  default elasticsearchClient;
