'use client'

import { useState } from 'react'

const questions = [
  { label: 'Apa yang paling menghambat bisnis Anda?', options: ['Proses masih manual', 'Data tersebar di banyak tempat', 'Website belum menghasilkan', 'Tim kewalahan pekerjaan berulang'] },
  { label: 'Apa target terdekat Anda?', options: ['Bekerja lebih efisien', 'Melayani pelanggan lebih baik', 'Membangun produk digital', 'Mengambil keputusan lebih cepat'] },
]

export function BusinessDiagnostic() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const selected = answers[step]
  const done = step === questions.length
  function choose(answer: string) { const next = [...answers]; next[step] = answer; setAnswers(next); setStep(step + 1) }
  if (done) return <div className="border border-ink/15 bg-white/35 p-6 text-ink md:p-8"><p className="mono text-[10px] text-orange">REKOMENDASI AWAL</p><h3 className="mt-4 text-3xl font-extrabold tracking-[-1.5px]">Mulai dari fondasi yang paling berdampak.</h3><p className="mt-4 max-w-xl text-sm leading-7 text-muted">Dari jawaban Anda, kemungkinan besar bisnis membutuhkan pemetaan proses dan satu sistem prioritas sebelum menambah lebih banyak tools.</p><a href="#kontak" className="mt-7 inline-block bg-ink px-5 py-4 text-xs font-bold text-paper">Bahas hasilnya bersama kami <span className="ml-2 text-orange">↗</span></a><button onClick={() => { setAnswers([]); setStep(0) }} className="ml-4 text-xs text-muted underline underline-offset-4">Ulangi</button></div>
  const question = questions[step]
  return <div className="border border-ink/15 bg-white/35 p-6 text-ink md:p-8"><div className="flex items-center justify-between"><p className="mono text-[10px] text-orange">DIAGNOSTIC / 0{step + 1}</p><span className="text-xs text-muted">{step + 1} dari {questions.length}</span></div><h3 className="mt-5 max-w-lg text-2xl font-extrabold tracking-[-1px] md:text-3xl">{question.label}</h3><div className="mt-6 grid gap-2 md:grid-cols-2">{question.options.map((option) => <button key={option} onClick={() => choose(option)} className={`border px-4 py-4 text-left text-sm font-medium transition hover:border-orange hover:bg-orange hover:text-paper ${selected === option ? 'border-orange bg-orange text-paper' : 'border-ink/15 text-ink'}`}>{option}<span className={`float-right ${selected === option ? 'text-paper' : 'text-orange'}`}>↗</span></button>)}</div></div>
}
