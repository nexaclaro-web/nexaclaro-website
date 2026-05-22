type Props = {
  variant: 0 | 1 | 2
  compact?: boolean
}

export function ExchangeDashboardPreview({ variant, compact }: Props) {
  const brand = 'Exchange Office'
  const accent = '#34d399'
  const side = compact ? 'w-[24%]' : 'w-[26%]'

  const Sidebar = () => (
    <aside className={`${side} shrink-0 border-r border-white/[0.08] bg-[#0a0f0d] p-1.5`}>
      <p className={`font-bold text-emerald-400 truncate ${compact ? 'text-[7px]' : 'text-[8px]'}`}>
        {brand}
      </p>
      {['Transactions', 'Documents', 'Archive', 'Reports'].map((l, i) => {
        const activeIndex = variant === 0 ? 0 : variant === 1 ? 1 : 3
        return (
          <div
            key={l}
            className={`mt-0.5 rounded px-1 ${compact ? 'text-[6px] py-0.5' : 'text-[7px] py-0.5'} ${
              i === activeIndex ? 'bg-emerald-500/20 text-emerald-300' : 'text-white/35'
            }`}
          >
            {l}
          </div>
        )
      })}
    </aside>
  )

  if (variant === 1) {
    const docs = [
      ['MT1', 'Today', 'OK'],
      ['KT1', 'Today', 'OK'],
      ['1DB', 'Mar 12', 'OK'],
      ['IMR1', 'Mar 11', 'Arch'],
    ]
    return (
      <div className="h-full flex bg-[#0a0a0a] text-white">
        <Sidebar />
        <main className={`flex-1 flex flex-col ${compact ? 'p-1' : 'p-1.5'}`}>
          <p className={`font-semibold ${compact ? 'text-[8px]' : 'text-[9px]'}`}>Documents</p>
          <div className="flex-1 mt-1 rounded border border-white/[0.08] overflow-hidden">
            {docs.map(([a, b, c]) => (
              <div
                key={a}
                className={`flex items-center justify-between px-1.5 py-1 border-t border-white/[0.05] first:border-0 ${compact ? 'text-[6px]' : 'text-[7px]'}`}
              >
                <span className="font-mono text-emerald-400/90">{a}</span>
                <span className="text-white/40">{b}</span>
                <span className="text-white/70">{c}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (variant === 2) {
    return (
      <div className="h-full flex bg-[#0a0a0a] text-white">
        <Sidebar />
        <main className={`flex-1 flex flex-col ${compact ? 'p-1' : 'p-1.5'}`}>
          <p className={`font-semibold ${compact ? 'text-[8px]' : 'text-[9px]'}`}>Daily summary</p>
          <div
            className={`rounded-lg border border-emerald-500/25 mt-1 ${compact ? 'p-1.5' : 'p-2'}`}
            style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.15), transparent)' }}
          >
            <p className={`text-white/40 ${compact ? 'text-[6px]' : 'text-[7px]'}`}>Total volume</p>
            <p className={`font-bold text-emerald-400 ${compact ? 'text-[11px]' : 'text-sm'}`}>€ 12,480</p>
          </div>
          <div className={`mt-1 space-y-0.5 flex-1 ${compact ? 'text-[6px]' : 'text-[7px]'}`}>
            {[
              ['Transactions', '38'],
              ['Printed', '12'],
              ['Users online', '6'],
            ].map(([a, b]) => (
              <div key={a} className="flex justify-between py-0.5 border-b border-white/[0.05]">
                <span className="text-white/50">{a}</span>
                <span className="text-white/85">{b}</span>
              </div>
            ))}
          </div>
          <div
            className={`rounded flex items-center justify-center font-medium text-black ${compact ? 'h-4 text-[6px]' : 'h-5 text-[7px]'}`}
            style={{ background: accent }}
          >
            Print report
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="h-full flex bg-[#0a0a0a] text-white">
      <Sidebar />
      <main className={`flex-1 flex flex-col ${compact ? 'p-1' : 'p-1.5'}`}>
        <p className={`font-semibold ${compact ? 'text-[8px]' : 'text-[9px]'}`}>New transaction</p>
        <div className="mt-1 grid grid-cols-2 gap-1">
          {['EUR', 'USD', 'MKD', 'Rate'].map((f) => (
            <div
              key={f}
              className={`rounded border border-white/10 bg-white/[0.03] flex items-center px-1 text-white/40 ${compact ? 'h-4 text-[6px]' : 'h-5 text-[7px]'}`}
            >
              {f}
            </div>
          ))}
        </div>
        <div
          className={`mt-1 flex-1 rounded border border-emerald-500/20 flex flex-col items-center justify-center ${compact ? 'text-[7px]' : 'text-[8px]'}`}
          style={{ background: 'rgba(52,211,153,0.06)' }}
        >
          <span className="text-white/40">Amount</span>
          <span className={`font-bold text-emerald-400 ${compact ? 'text-[12px]' : 'text-base'}`}>
            1,240.00
          </span>
        </div>
        <div
          className={`mt-1 rounded flex items-center justify-center font-semibold text-black ${compact ? 'h-4 text-[6px]' : 'h-5 text-[7px]'}`}
          style={{ background: accent }}
        >
          Save transaction
        </div>
      </main>
    </div>
  )
}
