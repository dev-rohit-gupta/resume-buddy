function safeParseAIJson<T>(raw: string) : T {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in AI output");

  return JSON.parse(match[0]);
}
export { safeParseAIJson };