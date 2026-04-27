import { AzureOpenAI } from 'openai';
import { AzureKeyCredential } from '@azure/core-auth';
import { SearchClient } from '@azure/search-documents';
import { environment } from './env';
import { ConfluenceChunk } from './confluence-chunk';

export class AzureAiSearchClient {
  private openai: AzureOpenAI;
  private searchClient: SearchClient<ConfluenceChunk>;

  constructor() {
    this.openai = new AzureOpenAI({
      endpoint: environment.AZURE_OPENAI_ENDPOINT!,
      apiKey: environment.AZURE_OPENAI_KEY!,
      apiVersion: '2024-02-01',
    });

    this.searchClient = new SearchClient<ConfluenceChunk>(
      environment.AZURE_SEARCH_ENDPOINT!,
      environment.AZURE_SEARCH_INDEX!,
      new AzureKeyCredential(environment.AZURE_SEARCH_KEY!)
    );
  }

  private async createEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: environment.AZURE_OPENAI_EMBEDDING_DEPLOYMENT!,
      input: text,
    });

    const embedding = response.data[0]?.embedding;
    if (!embedding) {
      throw new Error('No embedding was returned. Retry with a non-empty architecture query.');
    }

    return embedding;
  }

  async search(query: string, top: number) {
    const queryVector = await this.createEmbedding(query);

    return await this.searchClient.search(query, {
      top,
      vectorSearchOptions: {
        queries: [
          {
            kind: 'vector',
            vector: queryVector,
            fields: ['contentVector'],
            kNearestNeighborsCount: top,
          },
        ],
      },
      select: ['id', 'title', 'content', 'url', 'source', 'chunkId'],
    });
  }
}
