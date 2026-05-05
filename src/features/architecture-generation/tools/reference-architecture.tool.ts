import * as vscode from 'vscode';
import { ReferenceArchitectureParams } from './reference-architecture-params';
import { AzureAiSearchClient } from './azure-ai-search.client';

export class ReferenceArchitectureTool implements vscode.LanguageModelTool<ReferenceArchitectureParams> {
	async prepareInvocation(
		options: vscode.LanguageModelToolInvocationPrepareOptions<ReferenceArchitectureParams>,
		_token: vscode.CancellationToken
	) {
		return {
			invocationMessage: 'Buscando arquitecturas de referencia...',
			confirmationMessages: {
				title: 'Buscar contexto en Azure AI Search',
				message: new vscode.MarkdownString(
					`Se consultará Azure AI Search con la consulta: \`${options.input.query}\``
				)
			}
		};
	}

	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<ReferenceArchitectureParams>,
		_token: vscode.CancellationToken
	) {
		const { query, top = 5 } = options.input;
		const azureAiSearchClient = new AzureAiSearchClient();

		if (!query?.trim()) {
			throw new Error('The query parameter is required. Retry with a meaningful architecture question.');
		}

		const results = await azureAiSearchClient.search(query, top);
		const items: string[] = [];

		for await (const result of results.results) {
			items.push(
				[
					`Title: ${result.document.title}`,
					`Source: ${result.document.source}`,
					`URL: ${result.document.url}`,
					`Score: ${result.score}`,
					`Content: ${result.document.content?.slice(0, 500)}`
				].join('\n')
			);
		}

		if (items.length === 0) {
			throw new Error('No relevant architecture context was found. Retry with a broader query or different terminology.');
		}

		return new vscode.LanguageModelToolResult([
			new vscode.LanguageModelTextPart(items.join('\n\n---\n\n'))
		]);
	}
}