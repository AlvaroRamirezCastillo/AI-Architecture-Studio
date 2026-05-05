import * as vscode from 'vscode';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

let structurizrProcess: ChildProcess | undefined;

export async function startStructurizrLocal(
  { context, port }: {
    context: vscode.ExtensionContext,
    port: number
  }
): Promise<string> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    throw new Error('No hay editor activo.');
  }

  const filePath = editor.document.uri.fsPath;
  const workspaceDir = path.dirname(filePath);
  const warPath = path.join(context.extensionPath, 'resources', 'structurizr', 'structurizr.war');

  if (structurizrProcess) {
    return `http://localhost:${port}`;
  }

  structurizrProcess = spawn(
    'java',
    [
      `-Dserver.port=${port}`,
      '-jar',
      warPath,
      'local',
      workspaceDir
    ],
    {
      cwd: workspaceDir,
      stdio: ['ignore', 'pipe', 'pipe']
    }
  );

  structurizrProcess.stdout?.on('data', data => {
    console.log('[Structurizr]', data.toString());
  });

  structurizrProcess.stderr?.on('data', data => {
    console.error('[Structurizr][ERR]', data.toString());
  });

  structurizrProcess.on('exit', code => {
    console.log(`Structurizr salió con código ${code}`);
    structurizrProcess = undefined;
  });

  return `http://localhost:${port}`;
}