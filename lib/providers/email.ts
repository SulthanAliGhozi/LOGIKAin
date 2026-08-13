export type EmailMessage = { to: string; subject: string; text: string; html?: string }
export type EmailProvider = { send(message: EmailMessage): Promise<{ provider: string; id?: string }> }

export function getEmailProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER || 'disabled'
  if (provider === 'disabled') return { async send() { throw new Error('Email provider is not configured.') } }
  if (provider === 'resend') {
    const apiKey = process.env.RESEND_API_KEY; if (!apiKey) throw new Error('RESEND_API_KEY is not configured.')
    return { async send(message) { const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' }, body: JSON.stringify({ from: process.env.EMAIL_FROM || 'LOGIKAin <hello@logikain.id>', ...message }) }); if (!response.ok) throw new Error(`Email provider error: ${response.status}`); return { provider: 'resend', ...(await response.json() as { id?: string }) } } }
  }
  throw new Error(`Unsupported email provider: ${provider}`)
}
