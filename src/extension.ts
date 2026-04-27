import * as vscode from 'vscode';
import { ReferenceArchitectureTool } from './tools/reference-architecture.tool';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('ai-architecture-studio.helloWorld', () => {

		vscode.window.showInformationMessage('Hello World from AI Architecture Studio!');
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(
		vscode.lm.registerTool('get_reference_architecture_context', new ReferenceArchitectureTool())
	);
}

export function deactivate() {}
