export type AiTask = 'lead_qualification' | 'seo_metadata' | 'project_summary' | 'support_draft'

export type AiProvider = {
  complete(input: { task: AiTask; context: string }): Promise<{ text: string; provider: string; model?: string }>
}

export function getAiProvider(): AiProvider {
  const provider = process.env.AI_PROVIDER || 'disabled'
  if (provider === 'disabled') {
    return { async complete() { throw new Error('AI provider is not configured.') } }
  }
  if (provider === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) throw new Error('OPENAI_API_KEY is not configured.')
    return {
      async complete(input) {
        const response = await fetch('https://api.openai.com/v1/responses', {
          method: 'POST',
          headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
            input: `You are a LOGIKAin internal assistant. Task: ${input.task}. Use only this context and clearly mark uncertainty.\n\n${input.context}`,
          }),
        })
        if (!response.ok) throw new Error(`AI provider error: ${response.status}`)
        const json = await response.json() as { output_text?: string }
        return { text: json.output_text || '', provider: 'openai', model: process.env.OPENAI_MODEL || 'gpt-4.1-mini' }
      },
    }
  }
  throw new Error(`Unsupported AI provider: ${provider}`)
}
