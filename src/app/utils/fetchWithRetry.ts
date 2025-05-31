export async function fetchWithRetry(
  url: string,
  retries = 5,
  delay = 2000
): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Status: ${res.status}`)
      return await res.json()
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise((r) => setTimeout(r, delay))
    }
  }
}
