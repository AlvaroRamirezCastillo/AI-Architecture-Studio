import * as vscode from 'vscode';
import { openStructurizrPreview } from '../commands/open-structurizr-preview';

interface OpenStructurizrPreviewInput {
  filePath?: string;
}

export class OpenStructurizrPreviewTool implements vscode.LanguageModelTool<OpenStructurizrPreviewInput> {
  private context: vscode.ExtensionContext;

  constructor({ context }: { context: vscode.ExtensionContext }) {
    this.context = context;
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<OpenStructurizrPreviewInput>,
    _token: vscode.CancellationToken
  ) {
    const target = options.input.filePath ?? vscode.window.activeTextEditor?.document.uri.fsPath ?? 'archivo activo';

    return {
      invocationMessage: 'Abriendo Structurizr Preview',
      confirmationMessages: {
        title: 'Open Structurizr Preview',
        message: new vscode.MarkdownString(
          `¿Abrir la vista previa local de Structurizr para:\n\n\`${target}\`?`
        )
      }
    };
  }

  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<OpenStructurizrPreviewInput>,
    _token: vscode.CancellationToken
  ): Promise<vscode.LanguageModelToolResult> {
    const explicitPath = options.input.filePath;
    const activeUri = vscode.window.activeTextEditor?.document.uri;

    let targetFile: string | undefined;

    if (explicitPath) {
      targetFile = explicitPath;
    } else if (activeUri && activeUri.scheme === 'file') {
      targetFile = activeUri.fsPath;
    }

    if (!targetFile) {
      throw new Error(
        'No encontré un archivo .dsl para abrir la preview. Pide al usuario que abra un archivo DSL o proporciona una ruta absoluta.'
      );
    }

    await openStructurizrPreview({ context: this.context });

    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(
        `La vista previa de Structurizr fue abierta para: ${targetFile}`
      )
    ]);
  }
}