import React from "react";

export function KpiCard({ n, l, dLabel, dType }: { n: string | React.ReactNode, l: string, dLabel: string, dType: 'up' | 'warn' | 'neutral' }) {
  const dColors = {
    up: "bg-depot-soft text-depot",
    warn: "bg-signal-soft text-[#B8501E]",
    neutral: "bg-[#EEF0F4] text-muted-text"
  };

  return (
    <div className="bg-panel border border-line rounded-[10px] p-[16px]">
      <div className="font-disp text-[26px] font-bold">{n}</div>
      <div className="text-[11.5px] text-muted-text mt-[2px]">{l}</div>
      <div className={`font-mono text-[10.5px] mt-[8px] inline-block px-[7px] py-[2px] rounded-[4px] ${dColors[dType]}`}>
        {dLabel}
      </div>
    </div>
  );
}

export function Panel({ children, title, hint, className = "" }: { children: React.ReactNode, title?: string, hint?: string, className?: string }) {
  return (
    <div className={`bg-panel border border-line rounded-[10px] mb-[18px] overflow-hidden ${className}`}>
      {(title || hint) && (
        <div className="px-[18px] py-[14px] border-b border-line flex items-center justify-between">
          {title && <h3 className="font-disp text-[14.5px] font-semibold m-0">{title}</h3>}
          {hint && <span className="text-[11.5px] text-muted-text">{hint}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Badge({ children, color = "grey" }: { children: React.ReactNode, color?: 'blue' | 'orange' | 'green' | 'red' | 'grey' }) {
  const colors = {
    blue: "bg-route-soft text-route",
    orange: "bg-signal-soft text-[#B8501E]",
    green: "bg-depot-soft text-depot",
    red: "bg-alert-soft text-alert",
    grey: "bg-[#EEF0F4] text-muted-text"
  };
  return (
    <span className={`font-body text-[11px] font-semibold px-[9px] py-[3px] rounded-[20px] inline-block ${colors[color]}`}>
      {children}
    </span>
  );
}

export function ProtoButton({ children, variant = "primary", onClick, style }: { children: React.ReactNode, variant?: 'primary' | 'ghost' | 'dark', onClick?: () => void, style?: React.CSSProperties }) {
  const variants = {
    primary: "bg-signal text-[#1B1200]",
    ghost: "bg-transparent border border-line text-ink",
    dark: "bg-ink text-white"
  };
  return (
    <button 
      onClick={onClick} 
      style={style}
      className={`font-body font-semibold text-[12.5px] border-none rounded-[7px] px-[14px] py-[8px] cursor-pointer flex items-center justify-center gap-2 ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export function RouteTrack({ stages, currentIdx }: { stages: string[], currentIdx: number }) {
  return (
    <div>
      <div className="flex items-center my-[6px] mx-0 h-[16px]">
        {stages.map((stage, i) => (
          <React.Fragment key={i}>
            <div 
              className={`rounded-full shrink-0 ${
                i === currentIdx 
                  ? 'bg-signal w-[16px] h-[16px] ring-[3px] ring-signal-soft z-10' 
                  : i < currentIdx 
                    ? 'bg-route w-[9px] h-[9px] border-[2px] border-panel z-10' 
                    : 'bg-line w-[9px] h-[9px] border-[2px] border-panel z-10'
              }`} 
            />
            {i < stages.length - 1 && (
              <div 
                className="flex-1 h-[2px] relative -mx-[2px]" 
                style={{
                  background: i < currentIdx 
                    ? 'repeating-linear-gradient(90deg, var(--color-route) 0 6px, transparent 6px 11px)'
                    : 'repeating-linear-gradient(90deg, var(--color-line) 0 6px, transparent 6px 11px)'
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex font-mono text-[9px] text-muted-text mt-[4px]">
        {stages.map((stage, i) => (
          <span 
            key={i} 
            className={`flex-1 text-center whitespace-nowrap ${i === 0 ? 'text-left flex-none w-[20px]' : ''} ${i === stages.length - 1 ? 'text-right flex-none w-[20px]' : ''}`}
            style={i === currentIdx ? { color: '#B8501E', fontWeight: 700 } : {}}
          >
            {stage}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProtoTable({ headers, children }: { headers: React.ReactNode[], children: React.ReactNode }) {
  return (
    <table className="w-full border-collapse text-[12.8px]">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="text-left font-body font-semibold text-[11px] tracking-[0.3px] uppercase text-muted-text px-[18px] py-[10px] border-b border-line bg-[#FAFBFD]">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {children}
      </tbody>
    </table>
  );
}

export function Td({ children, className = "", title }: { children: React.ReactNode, className?: string, title?: string }) {
  return <td className={`px-[18px] py-[11px] ${className}`} title={title}>{children}</td>;
}
