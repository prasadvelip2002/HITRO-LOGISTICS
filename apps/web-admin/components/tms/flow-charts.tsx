"use client"

import { useState } from "react"
import { FLOWS, ROLES } from "@/lib/tms-data"
import { Mermaid } from "./mermaid"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function FlowCharts() {
  const [active, setActive] = useState(FLOWS[0].id)
  const activeFlow = FLOWS.find((f) => f.id === active) ?? FLOWS[0]

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <header className="mb-8">
        <Badge className="mb-3 bg-accent text-accent-foreground">Process Blueprints</Badge>
        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Flow charts for every workflow</h2>
        <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Business logic diagrams covering the full trip lifecycle and each approval-based module across web and mobile.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <nav className="flex flex-row flex-wrap gap-2 lg:flex-col" aria-label="Flow chart list">
          {FLOWS.map((flow) => {
            const isActive = flow.id === active
            return (
              <button
                key={flow.id}
                type="button"
                onClick={() => setActive(flow.id)}
                aria-pressed={isActive}
                className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary"
                }`}
              >
                <span className="font-semibold">{flow.title}</span>
              </button>
            )
          })}
        </nav>

        <Card className="min-h-[420px] p-5 md:p-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold">{activeFlow.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{activeFlow.description}</p>
          </div>
          <Mermaid key={activeFlow.id} chart={activeFlow.chart} />
        </Card>
      </div>

      <div className="mt-12">
        <h3 className="mb-4 text-xl font-semibold">Role-based access matrix</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role) => (
            <Card key={role.role} className="p-5">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{role.role}</span>
                <Badge variant="secondary">{role.scope}</Badge>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {role.capabilities.map((cap) => (
                  <li key={cap} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {cap}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
