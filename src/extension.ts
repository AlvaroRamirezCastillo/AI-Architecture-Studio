import * as vscode from 'vscode';
import { ReferenceArchitectureTool } from './features/architecture-generation/tools/reference-architecture.tool';
import { openStructurizrPreview } from './features/architecture-generation/commands/open-structurizr-preview';
import { OpenStructurizrPreviewTool } from './features/architecture-generation/tools/open-structurizr-preview.tool';

export async function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand(
		'ai-architecture-studio.openStructurizrPreview',
		async () => {
			await openStructurizrPreview({ context });
		}
	));
	context.subscriptions.push(
		vscode.lm.registerTool('get_reference_architecture_context', new ReferenceArchitectureTool())
	);
	context.subscriptions.push(
		vscode.lm.registerTool(
			'open_structurizr_preview',
			new OpenStructurizrPreviewTool({ context })
		)
	);
}

export function deactivate() { }
