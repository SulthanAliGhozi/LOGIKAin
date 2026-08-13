import { createClient } from '../../../../../lib/supabase/server'

function pdfText(value: string) { return value.replace(/[^\x20-\x7E]/g, '?').replace(/([\\()])/g, '\\$1') }

function makePdf(lines: string[]) {
  const encoder = new TextEncoder(); const stream = ['BT', '/F1 16 Tf', '50 760 Td', ...lines.flatMap((line, index) => [`(${pdfText(line)}) Tj`, index === 0 ? '0 -30 Td' : '0 -22 Td']), 'ET'].join('\n')
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${encoder.encode(stream).length} >>\nstream\n${stream}\nendstream`]
  const header = '%PDF-1.4\n%LOGIKAin\n'; const chunks: Uint8Array[] = [encoder.encode(header)]; const offsets = [0]; let offset = chunks[0].length
  for (let index = 0; index < objects.length; index++) { const object = encoder.encode(`${index + 1} 0 obj\n${objects[index]}\nendobj\n`); offsets.push(offset); chunks.push(object); offset += object.length }
  const xrefOffset = offset; chunks.push(encoder.encode(['xref', `0 ${objects.length + 1}`, '0000000000 65535 f ', ...offsets.slice(1).map((item) => `${String(item).padStart(10, '0')} 00000 n `), 'trailer', `<< /Size ${objects.length + 1} /Root 1 0 R >>`, 'startxref', String(xrefOffset), '%%EOF'].join('\n')))
  const output = new Uint8Array(chunks.reduce((total, chunk) => total + chunk.length, 0)); let cursor = 0; for (const chunk of chunks) { output.set(chunk, cursor); cursor += chunk.length }; return output
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return new Response('Unauthorized', { status: 401 })
  const { data: invoice } = await supabase.from('invoices').select('invoice_number,status,total_minor,currency,due_at,client_id,clients(name,email),business_projects(name)').eq('id', id).single(); if (!invoice) return new Response('Not found', { status: 404 })
  const { data: snapshot } = await supabase.from('invoice_snapshots').select('version,snapshot').eq('invoice_id', id).order('version', { ascending: false }).limit(1).maybeSingle(); const document = (snapshot?.snapshot as unknown as typeof invoice | null) || invoice; const client = invoice.clients as unknown as { name?: string; email?: string } | null; const project = invoice.business_projects as unknown as { name?: string } | null
  const lines = ['LOGIKAin — INVOICE', `Number: ${document.invoice_number}`, `Status: ${document.status}`, `Bill to: ${client?.name || 'Client'}`, `Email: ${client?.email || ''}`, `Project: ${project?.name || 'General services'}`, `Due: ${document.due_at || 'On request'}`, `Total: ${document.currency} ${Number(document.total_minor).toLocaleString('id-ID')}`, `Snapshot: v${snapshot?.version || 'draft'}`]
  return new Response(makePdf(lines), { headers: { 'content-type': 'application/pdf', 'content-disposition': `attachment; filename="${invoice.invoice_number}.pdf"`, 'cache-control': 'private, no-store' } })
}
