"use client"

import { useEffect, useId, useRef, useState } from "react"

let mermaidInit = false

export function Mermaid({ chart }: { chart: string }) {
  const rawId = useId()
  const id = "m" + rawId.replace(/[^a-zA-Z0-9]/g, "")
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default
        if (!mermaidInit) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "base",
            securityLevel: "loose",
            fontFamily: "var(--font-sans), ui-sans-serif, system-ui",
            themeVariables: {
              primaryColor: "#ffffff",
              primaryTextColor: "#26324a",
              primaryBorderColor: "#c9d2e3",
              lineColor: "#8a97b0",
              secondaryColor: "#eef1f7",
              tertiaryColor: "#f5f7fb",
              fontSize: "14px",
            },
            flowchart: { curve: "basis", htmlLabels: true, padding: 12 },
          })
          mermaidInit = true
        }
        const { svg } = await mermaid.render(id, chart)
        if (!cancelled) setSvg(svg)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to render diagram")
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [chart, id])

  if (error) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="mermaid-container flex w-full justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
