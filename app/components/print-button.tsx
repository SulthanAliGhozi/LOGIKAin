'use client'

export function PrintButton() { return <button className="ml-4 rounded bg-[#171717] px-3 py-2 text-white print:hidden" onClick={() => window.print()}>Print / Save PDF</button> }
