import * as vscode from 'vscode';
import { startStructurizrLocal } from './start-structurizr-local';
import { waitForServer } from './wait-for-server';

function getWebviewHtml(url: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Structurizr Preview</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
    }

    iframe {
      width: 100%;
      height: 100%;
      border: 0;
      display: none;
    }

    #loader {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1e1e1e;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }

    #loader span {
      font-size: 18px;
      font-weight: 500;

      background: linear-gradient(
        90deg,
        #555 0%,
        #fff 50%,
        #555 100%
      );

      background-size: 200% auto;
      color: transparent;
      background-clip: text;
      -webkit-background-clip: text;

      animation: shimmer 1.8s linear infinite;
    }

    @keyframes shimmer {
      0% {
        background-position: 200% center;
      }
      100% {
        background-position: -200% center;
      }
    }
  </style>
</head>
<body>
  <div id="loader">
    <span>Cargando Structurizr...</span>
  </div>
  <iframe id="structurizr" src="${url}"></iframe>

  <script>
    const vscode = acquireVsCodeApi();
    const iframe = document.getElementById('structurizr');
    const loader = document.getElementById('loader');

    window.addEventListener('message', event => {
      const message = event.data;

      if (message.type === 'server-ready') {
        loader.style.display = 'none';
        iframe.style.display = 'block';
      }
    });
  </script>
</body>
</html>`;
}

export async function openStructurizrPreview(
  { context }: { context: vscode.ExtensionContext, }
) {
  const localUrl = await startStructurizrLocal({ context, port: 4201 });
  const externalUri = await vscode.env.asExternalUri(vscode.Uri.parse(localUrl));
  const panel = vscode.window.createWebviewPanel(
    'structurizrPreview',
    'Structurizr Preview',
    vscode.ViewColumn.Beside,
    {
      enableScripts: true
    }
  );

  panel.webview.html = getWebviewHtml(externalUri.toString());

  waitForServer(localUrl)
    .then(() => {
      panel.webview.postMessage({ type: 'server-ready' });
    })
    .catch(err => {
      panel.webview.postMessage({ type: 'error', error: String(err) });
    });
}