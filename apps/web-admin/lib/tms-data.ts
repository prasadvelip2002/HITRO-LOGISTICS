export type Platform = "web" | "mobile" | "both"

export interface TmsModule {
  id: string
  name: string
  summary: string
  platform: Platform
  actors: string[]
}

export const MODULES: TmsModule[] = [
  {
    id: "customer-master",
    name: "Customer Master",
    summary: "Onboard and manage customer companies, billing details, and rate contracts.",
    platform: "web",
    actors: ["Internal User", "Accounts"],
  },
  {
    id: "fleet-vendor-master",
    name: "Fleet Vendor Master",
    summary: "Register third-party fleet vendors, KYC documents, and settlement terms.",
    platform: "web",
    actors: ["Internal User", "Accounts"],
  },
  {
    id: "vehicle-master",
    name: "Vehicle Master",
    summary: "Maintain owned and vendor vehicles, capacity, docs, and availability.",
    platform: "web",
    actors: ["Internal User"],
  },
  {
    id: "indent",
    name: "Indent Management",
    summary: "Capture load requests from customers and convert them into trips.",
    platform: "web",
    actors: ["Internal User", "Customer"],
  },
  {
    id: "trip-confirmation",
    name: "Trip Confirmation Sheet",
    summary: "Generate the TCS with route, freight, and terms before dispatch.",
    platform: "web",
    actors: ["Internal User", "Manager"],
  },
  {
    id: "trip-assignment",
    name: "Trip Assignment",
    summary: "Allocate vehicle and driver, then push the trip to the driver app.",
    platform: "both",
    actors: ["Internal User", "Driver"],
  },
  {
    id: "advance-payment",
    name: "Advance Payment",
    summary: "Driver requests advance; accounts and manager approve and disburse.",
    platform: "both",
    actors: ["Driver", "Accounts", "Manager"],
  },
  {
    id: "pod",
    name: "Proof of Delivery (POD)",
    summary: "Driver uploads signed POD photos; office verifies against the trip.",
    platform: "both",
    actors: ["Driver", "Internal User"],
  },
  {
    id: "additional-charges",
    name: "Additional Charges",
    summary: "Detention, unloading, and misc charges raised and approved with proof.",
    platform: "both",
    actors: ["Driver", "Manager", "Accounts"],
  },
  {
    id: "manager-approval",
    name: "Manager Approval",
    summary: "Central approval queue for advances, charges, and rate exceptions.",
    platform: "web",
    actors: ["Manager", "Tenant Admin"],
  },
  {
    id: "final-payment",
    name: "Final Payment",
    summary: "Reconcile advance, charges, and freight to settle the trip.",
    platform: "web",
    actors: ["Accounts", "Manager"],
  },
  {
    id: "unloading-charge",
    name: "Unloading Charge Workflow",
    summary: "Structured request, approval, and payout of unloading charges.",
    platform: "both",
    actors: ["Driver", "Manager", "Accounts"],
  },
  {
    id: "notifications",
    name: "Notifications",
    summary: "In-app, email, and push alerts across every workflow state change.",
    platform: "both",
    actors: ["All Roles"],
  },
  {
    id: "whatsapp",
    name: "WhatsApp Integration",
    summary: "Trip updates, POD links, and approvals delivered over WhatsApp.",
    platform: "both",
    actors: ["Customer", "Driver"],
  },
  {
    id: "scheduler",
    name: "Daily Scheduler",
    summary: "Automated jobs for reminders, escalations, and settlement runs.",
    platform: "web",
    actors: ["System", "Tenant Admin"],
  },
]

export interface RoleDef {
  role: string
  scope: string
  capabilities: string[]
}

export const ROLES: RoleDef[] = [
  {
    role: "Tenant Admin",
    scope: "Full tenant",
    capabilities: ["Manage users & roles", "Configure masters", "View all reports", "Override approvals"],
  },
  {
    role: "Manager",
    scope: "Branch / region",
    capabilities: ["Approve advances", "Approve charges", "Confirm trips", "Escalation handling"],
  },
  {
    role: "Accounts",
    scope: "Finance",
    capabilities: ["Disburse advances", "Final settlement", "Vendor payouts", "Ledger & reports"],
  },
  {
    role: "Internal User",
    scope: "Operations",
    capabilities: ["Create indents", "Assign trips", "Verify POD", "Manage masters"],
  },
  {
    role: "Driver",
    scope: "Mobile only",
    capabilities: ["Accept trips", "Upload POD", "Request advance", "Raise charges"],
  },
]

export interface FlowDiagram {
  id: string
  title: string
  description: string
  chart: string
}

export const FLOWS: FlowDiagram[] = [
  {
    id: "trip-lifecycle",
    title: "End-to-End Trip Lifecycle",
    description: "From customer indent to final settlement and trip closure.",
    chart: `flowchart TD
  A([Customer raises Indent]) --> B[Internal User reviews load]
  B --> C{Vehicle available?}
  C -- No --> D[Assign Fleet Vendor vehicle]
  C -- Yes --> E[Assign owned vehicle]
  D --> F[Generate Trip Confirmation Sheet]
  E --> F
  F --> G{Manager approves TCS?}
  G -- No --> B
  G -- Yes --> H[Assign Driver + push to Mobile App]
  H --> I[Driver accepts trip]
  I --> J[Advance Payment workflow]
  J --> K[Trip in transit]
  K --> L[Driver uploads POD]
  L --> M{POD verified?}
  M -- No --> L
  M -- Yes --> N[Additional / Unloading charges]
  N --> O[Final Payment reconciliation]
  O --> P([Trip closed])`,
  },
  {
    id: "advance-payment",
    title: "Advance Payment Workflow",
    description: "Driver-initiated advance request through disbursement.",
    chart: `flowchart TD
  A([Driver requests advance]) --> B[Enter amount + reason]
  B --> C[Accounts review]
  C --> D{Within limit?}
  D -- Yes --> E[Accounts approves]
  D -- No --> F[Manager approval required]
  F --> G{Manager approves?}
  G -- No --> H([Rejected - notify driver])
  G -- Yes --> E
  E --> I[Disburse via bank / UPI]
  I --> J[Ledger updated against trip]
  J --> K([Driver notified + WhatsApp])`,
  },
  {
    id: "unloading-charge",
    title: "Unloading Charge Workflow",
    description: "Structured capture, approval, and payout of unloading charges.",
    chart: `flowchart TD
  A([Driver raises unloading charge]) --> B[Upload receipt / photo proof]
  B --> C[Internal User validates against trip]
  C --> D{Amount over threshold?}
  D -- No --> E[Auto-approve]
  D -- Yes --> F[Manager approval]
  F --> G{Approved?}
  G -- No --> H([Rejected with remark])
  G -- Yes --> I[Add to trip cost sheet]
  E --> I
  I --> J[Included in Final Payment]
  J --> K([Settled + notify])`,
  },
  {
    id: "manager-approval",
    title: "Manager Approval Queue",
    description: "Unified approval routing for advances, charges, and exceptions.",
    chart: `flowchart TD
  A([Request enters queue]) --> B{Request type}
  B -- Advance --> C[Check advance policy]
  B -- Charge --> D[Check charge threshold]
  B -- Rate exception --> E[Check contract rate]
  C --> F{Manager decision}
  D --> F
  E --> F
  F -- Approve --> G[Route to Accounts]
  F -- Reject --> H([Notify requester])
  F -- Escalate --> I[Tenant Admin review]
  I --> F
  G --> J([Action executed])`,
  },
  {
    id: "scheduler",
    title: "Daily Scheduler & Automation",
    description: "Cron-driven reminders, escalations, and settlement runs.",
    chart: `flowchart TD
  A([Daily cron trigger]) --> B[Scan open trips]
  B --> C{Pending POD over 24h?}
  C -- Yes --> D[Send driver reminder]
  B --> E{Approval idle over SLA?}
  E -- Yes --> F[Escalate to Manager]
  B --> G{Trip ready to settle?}
  G -- Yes --> H[Queue Final Payment]
  D --> I[Dispatch notifications + WhatsApp]
  F --> I
  H --> I
  I --> J([Log run + metrics])`,
  },
  {
    id: "whatsapp",
    title: "WhatsApp Automation Flow",
    description: "Event triggers, template dispatch, two-way replies, and status tracking.",
    chart: `flowchart TD
  A([System event fires]) --> B{Recipient opted in?}
  B -- No --> C([Fallback to SMS / push])
  B -- Yes --> D[Select approved template]
  D --> E[Inject trip / payment data]
  E --> F[Send via WhatsApp Business API]
  F --> G{Delivery status}
  G -- Failed --> H[Retry + fallback channel]
  G -- Delivered --> I[Mark delivered / read]
  I --> J{Recipient replies?}
  J -- No --> K([Log + close])
  J -- Yes --> L[Route reply to inbox]
  L --> M{Reply type}
  M -- POD photo --> N[Attach to trip]
  M -- Confirm / query --> O[Notify Internal User]
  N --> K
  O --> K`,
  },
  {
    id: "rbac",
    title: "Role-Based Access Flow",
    description: "How each role interacts across web and mobile surfaces.",
    chart: `flowchart LR
  U([User signs in]) --> R{Role}
  R -- Tenant Admin --> TA[Full web console]
  R -- Manager --> MG[Approvals + confirmations]
  R -- Accounts --> AC[Payments + settlement]
  R -- Internal User --> IU[Operations + masters]
  R -- Driver --> DR[Mobile app only]
  TA --> W[[Web Admin Portal]]
  MG --> W
  AC --> W
  IU --> W
  DR --> M[[Mobile Driver App]]`,
  },
]
