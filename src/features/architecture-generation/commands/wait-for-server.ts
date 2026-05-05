async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitForServer(url: string): Promise<void> {
  const timeoutMs = 15000;
  const intervalMs = 500;

  const start = Date.now();
  let lastError: unknown;

  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET' });

      if (res.ok) {
        
        return; // ✅ servidor listo
      }

      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }

    await delay(intervalMs);
  }

  throw new Error(
    `Structurizr no respondió en ${timeoutMs}ms (${url}). Último error: ${String(lastError)}`
  );
}
