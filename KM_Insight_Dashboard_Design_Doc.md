# KM Insight Dashboard — UI/UX Design Document

**Version:** V1.0  
**Date:** 2026-06-08  
**Language:** English  
**Design System:** White background + Blue accent (#1A56DB primary, #E8F0FE secondary)  

---

## 1. Design Principles

### 1.1 Visual Identity

| Element | Specification |
|---|---|
| Primary Color | `#1A56DB` (Deep Blue) — headers, active filters, primary buttons, chart accents |
| Secondary Color | `#2563EB` (Medium Blue) — hover states, links, secondary buttons |
| Light Blue | `#E8F0FE` — card backgrounds, selected rows, chart area fills |
| Neutral Background | `#FFFFFF` — page background, cards |
| Subtle Border | `#E5E7EB` — dividers, card borders |
| Text Primary | `#111827` — main content |
| Text Secondary | `#6B7280` — labels, descriptions, metadata |
| Semantic Red | `#DC2626` — negative trends, alerts, bad case indicators |
| Semantic Green | `#16A34A` — positive trends, SLA met, helpful indicators |
| Semantic Amber | `#F59E0B` — warnings, pending, approaching thresholds |

### 1.2 Dashboard Scope

The dashboard covers **two primary operational scenarios**:

| Scenario | Focus | Primary Users |
|---|---|---|
| **Knowledge Management** | Content lifecycle, contributor productivity, governance health, taxonomy, SLA, drafts & approvals | KM Operators, Space/Zone Owners, Knowledge Owners, Reviewers |
| **Consumption & Feedback** | Portal usage, search analytics, channel consumption, user feedback, Bad Case optimization tasks | KM Operators, Channel Owners, Leadership, Knowledge Owners |

### 1.3 Chart Type Selection Rationale

| Data Type | Chart | Rationale |
|---|---|---|
| Composition / Proportion | **Donut Chart** | Show share of categories (e.g., Topic distribution, feedback types) |
| Ranking / Comparison | **Horizontal Bar Chart** | Compare values across items (e.g., Top articles, Top contributors) |
| Time Series / Trend | **Line Chart** | Track change over time (e.g., daily views, Helpful% trend) |
| Absolute Values | **KPI Card** | Single-number highlights (e.g., Total Views, SLA Compliance) |
| Status Distribution | **Stacked Bar Chart** | Show lifecycle breakdown by status (e.g., Draft/Review/Published) |
| Correlation / Quadrant | **Scatter Plot** | Show relationship (e.g., Views vs Helpful%) |
| Funnel / Flow | **Horizontal Funnel** | Show drop-off (e.g., Search → Click → Helpful) |
| Geographic | **Choropleth Map** | Regional distribution (e.g., consumption by Geo) |
| Alerts / Actions | **Alert Cards + Data Table** | Actionable items requiring attention |

---

## 2. Global Layout & Navigation

### 2.1 Shell Structure

```
┌──────────────────────────────────────────────────────────────┐
│  [UKM Logo]  KM Insight                       [🔔] [👤 User] │  ← Top Nav Bar (h: 56px, bg: #1A56DB, text: white)
├──────────┬───────────────────────────────────────────────────┤
│          │  [Global Filter Bar — Time | Product | Topic | …]  │  ← Sticky Filters (h: 48px)
│  Side    │───────────────────────────────────────────────────│
│  Nav     │                                                    │
│  (w:220) │              Dashboard Content Area                │
│          │                                                    │
│          │                                                    │
└──────────┴───────────────────────────────────────────────────┘
```

### 2.2 Sidebar Navigation

```
┌─────────────────────────┐
│  📊 Executive Overview   │  ← Default landing page
│─────────────────────────│
│  📚 Knowledge Management │  ← Scenario 1
│     ├ Content Lifecycle  │
│     ├ Contributor Center │
│     ├ Governance Health  │
│     └ Taxonomy Explorer  │
│─────────────────────────│
│  📈 Consumption & Feedback│  ← Scenario 2
│     ├ Portal Usage       │
│     ├ Search Analytics   │
│     ├ Channel Consumption│
│     └ Bad Case & Tasks   │
│─────────────────────────│
│  📄 Article Deep Dive    │  ← Drill-down page
│─────────────────────────│
│  📋 Reports & Export     │
└─────────────────────────┘
```

### 2.3 Global Filter Bar (Sticky, All Pages)

| Filter | Type | Options |
|---|---|---|
| Time Range | Dropdown | Last 7 Days / Last 30 Days (default) / Last Quarter / Custom Range |
| Product | Cascading Select | All → ISG / IDG / MBG → ... (7 levels) |
| Topic | Cascading Select | All → Technical Knowledge / SOP / How-To / ... (4 levels) |
| Component | Cascading Select | All → Hardware / Software / ... |
| Location | Cascading Select | All → NA / EMEA / AP / LA → ... |
| Service Offering | Multi-select | All / Premier Support / Standard Warranty / Premium Care |

---

## 3. Page 1: Executive Overview (Landing Page)

**Purpose:** At-a-glance health snapshot for leadership and KM operators.  
**Default Filters:** Last 30 Days, All Products, All Locations.

### 3.1 Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Row 1: KPI Cards (4 across)                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │ Total    │ │ Helpful  │ │ Activity │ │ SLA      │                │
│  │ Views    │ │ %        │ │ Rate     │ │ Compliance│               │
│  │ 1.25M    │ │ 84.5%    │ │ 42%      │ │ 96.2%    │                │
│  │ ↑5.2%    │ │ ↓0.5%    │ │ ↑2.1%    │ │ ↓1.3%    │                │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                │
├──────────────────────────────────────────────────────────────────────┤
│  Row 2: Charts (2-column)                                            │
│  ┌─────────────────────────┐ ┌─────────────────────────────────┐    │
│  │ Consumption by Topic    │ │ Daily View Trend (30 days)      │    │
│  │ (Donut Chart)           │ │ (Line Chart)                    │    │
│  │                         │ │   ╱╲    ╱╲                      │    │
│  │    ╭──────╮             │ │  ╱  ╲──╱  ╲────                 │    │
│  │   ╱ 45%    ╲  Device    │ │ ╱                                │    │
│  │  │          │  Issue     │ │────────────────────────────────│    │
│  │  │  25%     │  How-To    │ │                                 │    │
│  │   ╲ 15% 10%╱  SOP/HMM   │ │                                 │    │
│  │    ╰──────╯              │ │                                 │    │
│  └─────────────────────────┘ └─────────────────────────────────┘    │
├──────────────────────────────────────────────────────────────────────┤
│  Row 3: Top Contributors (Table) + Alert Panel                      │
│  ┌─────────────────────────────────────┐ ┌──────────────────────┐   │
│  │ Top Contributors (Table)            │ │ Active Alerts        │   │
│  │ Rank │ Name │ Articles │ Helpful%   │ │ ⚠️ 14 Broken Links  │   │
│  │  1   │ ...  │   15     │  92.1%     │ │ ⚠️ 25 Expiring Soon │   │
│  │  2   │ ...  │   12     │  89.5%     │ │ ⚠️ 3 SLA Breaches   │   │
│  │  3   │ ...  │    9     │  94.0%     │ │ ℹ️ 8 Orphaned Tags  │   │
│  └─────────────────────────────────────┘ └──────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.2 Chart Specifications

**KPI Cards (Row 1):**
- Each card: white background, subtle left border accent (`#1A56DB`), large number, trend arrow
- Green arrow (↑) for positive, Red arrow (↓) for negative
- Comparison text: "vs previous period"

**Donut Chart — Consumption by Topic (Row 2, Left):**
- 5 segments: Device Issue Solving (45%), How-To Guide (25%), Parts Replacement SOP (15%), HMM (10%), Other (5%)
- Center text: "Total Articles: 12,480"
- Blue palette: `#1A56DB`, `#3B82F6`, `#60A5FA`, `#93C5FD`, `#BFDBFE`
- Click segment → drill down to Topic-filtered view

**Line Chart — Daily View Trend (Row 2, Right):**
- X-axis: Date (last 30 days)
- Y-axis: View count
- Dual lines: Total Views (solid blue `#1A56DB`), Unique Visitors (dashed light blue `#93C5FD`)
- Hover tooltip: exact date, value, delta from previous day
- Weekend shading: slightly muted background

**Top Contributors Table (Row 3, Left):**
- Columns: Rank, Name (anonymized), Geo, Articles Contributed, Total Views, Avg Helpful%, KPI Rating
- Sortable columns
- Row hover: `#E8F0FE` highlight
- Rank 1-3: small medal icons

**Alert Panel (Row 3, Right):**
- Card with `#FEF3C7` background for warnings, `#FEE2E2` for critical
- Each alert: icon + count + description + [Action] button
- Click alert → navigate to relevant detail page

---

## 4. Scenario 1 — Knowledge Management Pages

### 4.1 Content Lifecycle Dashboard

**Purpose:** Monitor knowledge assets through their lifecycle stages, track SLA, identify governance issues.  
**Primary Users:** KM Operators, Knowledge Owners, Reviewers.

#### 4.1.1 Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Row 1: Lifecycle KPI Cards (5 across)                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Total    │ │ Draft    │ │ In Review│ │ Published│ │ Archived │  │
│  │ Articles │ │ Count    │ │ Count    │ │ Count    │ │ Count    │  │
│  │ 12,480   │ │ 342      │ │ 156      │ │ 10,892   │ │ 1,090    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├──────────────────────────────────────────────────────────────────────┤
│  Row 2: Lifecycle Flow (Sankey / Stacked Bar)                       │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Article Lifecycle Distribution by Status (Stacked Bar, Monthly)  ││
│  │                                                                    ││
│  │  Jan ████████████████░░░░░░░░░░░░  Draft: 8%                     ││
│  │  Feb ███████████████░░░░░░░░░░░░░  Review: 5%                    ││
│  │  Mar █████████████████░░░░░░░░░░░  Published: 83%                ││
│  │  Apr ██████████████████░░░░░░░░░░  Archived: 4%                  ││
│  │  May █████████████████░░░░░░░░░░░                                ││
│  │  └──┬──┘└──┬──┘└────┬────┘└─┬─┘                                 ││
│  │   Draft  Review  Published Archived                               ││
│  └──────────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────────┤
│  Row 3: Two-Column                                                    │
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐   │
│  │ Draft Aging (Bar Chart)      │ │ Approval Timeline (Gantt)    │   │
│  │                              │ │                              │   │
│  │  >90 days  ████████  45     │ │ Draft → Review   4.5 days ❌ │   │
│  │  60-90d    ██████    32     │ │ Review → Approved 1.2 days ✅ │   │
│  │  30-60d    █████████ 68     │ │ Approved → Pub    0.8 days ✅ │   │
│  │  7-30d     ████████████ 98 │ │ Total Cycle      6.5 days    │   │
│  │  <7 days   ██████████████ 99│ │ Target: < 5 days             │   │
│  │                              │ │                              │   │
│  │  Blue = Active drafting     │ │  [View Bottleneck Details]   │   │
│  │  Red  = Stale (>60d)       │ │                              │   │
│  └──────────────────────────────┘ └──────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│  Row 4: Expiring & Orphaned Articles (Data Table)                    │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Article Title          │ Status  │ Expires  │ Owner     │ Action ││
│  │ ThinkSystem SR650 SOP  │ Active  │ 2026-06-15│ Admin_Li  │[Renew]││
│  │ Premier Support Policy │ InReview│ 2026-06-10│ J.Doe     │[Escalate]│
│  │ Vantage Install Error  │ Active  │ -        │ System    │[Archive]│
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

#### 4.1.2 Chart Specifications

| Chart | Type | Data | Interaction |
|---|---|---|---|
| Lifecycle KPIs | KPI Cards | Total / Draft / In Review / Published / Archived counts | Click card → filter table below |
| Monthly Lifecycle Distribution | Stacked Horizontal Bar | 12-month trend of status proportions | Hover tooltip with exact counts |
| Draft Aging | Horizontal Bar | Count of drafts in each age bucket (`<7d`, `7-30d`, `30-60d`, `60-90d`, `>90d`) | Red highlight for >60d; click bar → see draft list |
| Approval Timeline | Horizontal Bullet Bar | Average days per approval stage vs target | Red bar when exceeding target |
| Expiring / Orphaned Table | Data Table | Articles nearing expiration or with zero recent views | Sort, filter, inline [Renew], [Archive], [Escalate] buttons |

#### 4.1.3 Business Rules

- Drafts older than 60 days auto-flag as "Stale Draft" and notify the author
- Articles with 0 views in last 6 months appear in Orphaned list
- SLA target: Draft → Published within 5 business days
- Expiring articles surface 30 days before expiration date

---

### 4.2 Contributor Center

**Purpose:** Track knowledge contributor activity, productivity, and quality.  
**Primary Users:** KM Operators, Space/Zone Owners, Team Leads.

#### 4.2.1 Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Row 1: Contributor KPIs (4 across)                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│  │ Active       │ │ New Articles │ │ Avg Review   │ │ Pending      ││
│  │ Contributors │ │ This Month   │ │ Cycle (Days) │ │ Reviews      ││
│  │     87       │ │     203      │ │     3.2      │ │     156      ││
│  │   ↑12%       │ │    ↑8%       │ │    ↓0.8      │ │    ↓5%       ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘│
├──────────────────────────────────────────────────────────────────────┤
│  Row 2: Contributor Leaderboard (Table) + Recent Activity Timeline   │
│  ┌─────────────────────────────────────────┐ ┌──────────────────┐   │
│  │ Rank│Contributor│Articles│Views│Helpful%│ │ Recent Activity  │   │
│  │  1  │ Zhang*    │   15   │24.5K│ 92.1% │ │ 10:32 Li created │   │
│  │  2  │ M.Smith   │   12   │18.2K│ 89.5% │ │ 09:15 Wang edit  │   │
│  │  3  │ L.Müller  │    9   │22.1K│ 94.0% │ │ 08:47 Chen submit│   │
│  │  4  │ R.Patel   │    8   │15.3K│ 88.2% │ │ 08:30 Smith draft│   │
│  │  5  │ A.Chen    │    7   │12.8K│ 91.3% │ │ 07:55 Müller pub │   │
│  │ ...                                             │ ...              │   │
│  └─────────────────────────────────────────┘ └──────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│  Row 3: Contributor Quality Matrix (Scatter Plot)                    │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │  Helpful%                                                        ││
│  │  100%│                    ● Müller                                ││
│  │   95%│          ● Chen       ● Zhang*                            ││
│  │   90%│     ● Patel    ● Smith                                    ││
│  │   85%│  ● Wang   ● Kim                                          ││
│  │   80%│       ● Jones   ● Lee                                    ││
│  │   75%│                       ● Brown (Low Views, Low Quality)    ││
│  │      └────────────────────────────────────────── Views           ││
│  │        Low Views,            High Views,                          ││
│  │        High Quality          High Quality ← Target Zone          ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

#### 4.2.2 Chart Specifications

| Chart | Type | Rationale |
|---|---|---|
| Contributor KPIs | KPI Cards | Absolute metrics for quick scanning |
| Leaderboard | Sortable Data Table | Ranking comparison across contributors; click row → contributor detail |
| Recent Activity | Timeline Feed | Real-time awareness of content operations |
| Quality Matrix | Scatter Plot | X-axis: Total Views, Y-axis: Avg Helpful%, Bubble size: Article count. Identifies high-impact/high-quality vs low-impact/low-quality contributors |

#### 4.2.3 Key Metrics Definitions

| Metric | Formula | Unit |
|---|---|---|
| Active Contributors | Unique users who created/edited/published in period | Count |
| Pending Reviews | Articles currently in "In Review" or "Technical Review" status | Count |
| Avg Review Cycle | Average days from Draft → Published per contributor | Days |
| Contributor Quality Score | (Helpful% × 0.6) + (Views Percentile × 0.2) + (Activity Rate × 0.2) | 0-100 |

---

### 4.3 Governance Health

**Purpose:** Monitor content quality, broken links, metadata compliance, and taxonomy hygiene.  
**Primary Users:** KM Operators, System Admins, Taxonomy Managers.

#### 4.3.1 Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Row 1: Alert Summary Cards                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│  │ 🔴 Broken    │ │ 🟡 Expiring │ │ 🟠 Orphaned  │ │ 🔵 Metadata  ││
│  │ Links        │ │ Articles    │ │ Articles     │ │ Issues       ││
│  │     14       │ │     25      │ │     32       │ │      8       ││
│  │  [View All]  │ │  [View All] │ │  [View All]  │ │  [View All]  ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘│
├──────────────────────────────────────────────────────────────────────┤
│  Row 2: Broken Link Trend + Orphaned Analysis                        │
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐   │
│  │ Broken Links Over Time       │ │ Orphaned Articles by Topic   │   │
│  │ (Line Chart)                 │ │ (Horizontal Bar Chart)       │   │
│  │  15│    ╱╲                   │ │ Device Issue    ██████ 12   │   │
│  │  10│╲  ╱  ╲    ╱╲           │ │ How-To Guide    ████   8    │   │
│  │   5│ ╲╱    ╲──╱  ╲──        │ │ SOP             ███    6    │   │
│  │   0└────────────────────     │ │ Prod Knowledge  ██     4    │   │
│  │     Jan Feb Mar Apr May Jun  │ │ HMM             █      2    │   │
│  └──────────────────────────────┘ └──────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│  Row 3: Metadata / Taxonomy Health                                   │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Unused Tags (last 180 days)                                       ││
│  │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     ││
│  │ │ Windows7│ │ Vista   │ │ 32-bit  │ │ Legacy  │ │OldDriver│     ││
│  │ │ 0 uses  │ │ 0 uses  │ │ 2 uses  │ │ 0 uses  │ │ 1 use   │     ││
│  │ │[Archive]│ │[Archive]│ │[Review] │ │[Archive]│ │[Review] │     ││
│  │ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘     ││
│  │                                                                    ││
│  │ Tag Coverage by Topic (Donut)         Tag Overlap Heatmap         ││
│  │    ╭──────╮                          (Topic × Component matrix)  ││
│  │   ╱ 88%    ╲ Covered                showing co-occurrence        ││
│  │   │         │                        frequency of tags            ││
│  │    ╲ 12%   ╱ Missing                                             ││
│  │     ╰──────╯                                                     ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

#### 4.3.2 Actionable Rules (from KM Insights Rule Definition)

| Alert Condition | Threshold | Suggested Action |
|---|---|---|
| Broken Link detected | Any | [Fix Link] — navigate to article editor |
| Article expiring within 7 days | Days to expire ≤ 7 | [Renew] or [Archive] |
| Article with 0 views in 180 days | Views = 0 for ≥ 180 days | [Archive] after owner review |
| Tag unused for 180 days | Usage count = 0 for ≥ 180 days | [Archive Tag] or [Merge Tag] |
| Article in "Draft" > 60 days | Age in Draft > 60 days | Notify author, [Escalate] if no action |
| SLA breach detected | Cycle time > target SLA | Flag in table, notify reviewer |

---

### 4.4 Taxonomy Explorer

**Purpose:** Visualize taxonomy hierarchy coverage, distribution, and gaps.  
**Primary Users:** Taxonomy Managers, KM Operators, Space Owners.

#### 4.4.1 Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Row 1: Taxonomy Tree (Left) + Article Distribution (Right)          │
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐   │
│  │ Taxonomy Tree Navigation     │ │ Articles per Taxonomy Node   │   │
│  │ (Interactive Tree View)      │ │ (Treemap)                    │   │
│  │                              │ │ ┌─────────────────────────┐  │   │
│  │  ▼ Product                   │ │ │  ISG (3,240)            │  │   │
│  │    ▼ ISG                     │ │ │  ┌─────────┬──────────┐ │  │   │
│  │      ▼ ThinkSystem           │ │ │  │ Server   │ Storage  │ │  │   │
│  │        • SR650  (45 articles)│ │ │  │ (1,200)  │ (890)    │ │  │   │
│  │        • SR850  (32 articles)│ │ │  ├─────────┼──────────┤ │  │   │
│  │        • SR860  (28 articles)│ │ │  │ Network  │ Software │ │  │   │
│  │      ▼ ThinkEdge             │ │ │  │ (650)    │ (500)    │ │  │   │
│  │        • SE350  (15 articles)│ │ │  └─────────┴──────────┘ │  │   │
│  │    ▼ IDG                     │ │  │  IDG (4,800)           │  │   │
│  │      ▼ ThinkPad              │ │  │  MBG (2,100)           │  │   │
│  │  ▼ Topic                     │ │  │  Other (2,340)         │  │   │
│  │    ▼ Technical Knowledge     │ │  └─────────────────────────┘  │   │
│  │  ▼ Component                 │ │                              │   │
│  │  ▼ Location                  │ │                              │   │
│  │  ▼ Service Offering          │ │                              │   │
│  └──────────────────────────────┘ └──────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│  Row 2: Taxonomy Gap Analysis                                        │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Nodes with Low Coverage                          Nodes with Gaps ││
│  │ ┌──────────────────────┐                        ┌──────────────┐ ││
│  │ │ ThinkEdge SE350      │  ← 15 articles        │ Linux Driver │ ││
│  │ │ (New product, low    │                        │ (0 articles, │ ││
│  │ │  coverage) [Alert]   │                        │  high search)│ ││
│  │ │                      │                        │ [Create]     │ ││
│  │ │ Legion Go S          │  ← 8 articles          │ BIOS Update  │ ││
│  │ │ (High search, low    │                        │ (3 articles, │ ││
│  │ │  coverage) [Alert]   │                        │  gap in ISG) │ ││
│  │ └──────────────────────┘                        └──────────────┘ ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

#### 4.4.2 Chart Specifications

| Chart | Type | Rationale |
|---|---|---|
| Taxonomy Tree | Interactive Tree View | Hierarchical navigation; each node shows article count; color intensity = coverage density |
| Articles per Node | Treemap | Area proportional to article count; color intensity = engagement level |
| Low Coverage Nodes | Alert List | Nodes with high search demand but low article count |
| Gap Nodes | Action List | Taxonomy nodes with zero articles but active search demand |

---

## 5. Scenario 2 — Consumption & Feedback Pages

### 5.1 Portal Usage

**Purpose:** Track UKM Portal consumption metrics — views, searches, user behavior, engagement.  
**Primary Users:** KM Operators, Leadership, Channel Owners.

#### 5.1.1 Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Row 1: Usage KPI Cards (5 across)                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Total    │ │ Unique   │ │ Avg Time │ │ Bounce   │ │ Pages/   │  │
│  │ Views    │ │ Visitors │ │ on Page  │ │ Rate     │ │ Session  │  │
│  │ 1,245,600│ │  89,200  │ │  2m 15s  │ │  38.5%   │ │   4.2    │  │
│  │  ↑5.2%   │ │  ↑3.1%   │ │  ↑12s    │ │  ↓2.1%   │ │  ↑0.3    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├──────────────────────────────────────────────────────────────────────┤
│  Row 2: Usage Trends (2-column)                                      │
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐   │
│  │ Daily Views & Visitors       │ │ Views by Product (Top 10)    │   │
│  │ (Dual-Axis Line Chart)       │ │ (Horizontal Bar Chart)       │   │
│  │    Views  Visitors           │ │ ThinkPad           ████████  │   │
│  │  50K│   ╱╲  5K               │ │ ThinkSystem       ███████   │   │
│  │  40K│╲ ╱  ╲╱╲ 4K             │ │ ThinkVision       ██████    │   │
│  │  30K│ ╲╱     ╲ 3K            │ │ Yoga             █████     │   │
│  │  20K│         2K             │ │ ideapad          ████      │   │
│  │  10K│         1K             │ │ Legion            ████      │   │
│  │    └─────────────────        │ │ ThinkCentre       ███       │   │
│  └──────────────────────────────┘ └──────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│  Row 3: Geographic Heatmap + Device Type Split                       │
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐   │
│  │ Views by Region (Choropleth) │ │ Views by Device (Donut)      │   │
│  │                              │ │                              │   │
│  │   [World Map with heatmap]   │ │    ╭──────╮                  │   │
│  │   NA: 38% (darkest blue)     │ │   ╱ 58%    ╲ Desktop        │   │
│  │   EMEA: 28%                  │ │   │         │                │   │
│  │   AP: 22%                    │ │   │  35%    │ Mobile         │   │
│  │   LA: 12%                    │ │    ╲  7%   ╱ Tablet          │   │
│  │                              │ │     ╰──────╯                │   │
│  └──────────────────────────────┘ └──────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│  Row 4: Most / Least Viewed Articles (Data Table)                    │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Most Viewed (Top 5)                    Least Viewed (Bottom 5)   ││
│  │ Article Title         │ Views  │ Help  │ Article Title  │ Views ││
│  │ ThinkPad No Power Fix │ 42,500 │ 91%   │ Legacy Driver  │    2  ││
│  │ Yoga Battery Issue    │ 38,200 │ 88%   │ Old BIOS Guide │    5  ││
│  │ ...                                                            ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

---

### 5.2 Search Analytics

**Purpose:** Analyze search behavior, identify knowledge gaps, monitor search effectiveness.  
**Primary Users:** KM Operators, Content Strategists, Taxonomy Managers.

#### 5.2.1 Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Row 1: Search KPI Cards (4 across)                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│  │ Total        │ │ Search CTR   │ │ Zero-Result  │ │ AI Resolution││
│  │ Searches     │ │ (Top 5)      │ │ Rate         │ │ Rate         ││
│  │   85,000     │ │    72.3%     │ │    4.5%      │ │    68.0%     ││
│  │   ↑12%       │ │   ↑2.1%      │ │   ↓0.8%      │ │   ↑3.5%      ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘│
├──────────────────────────────────────────────────────────────────────┤
│  Row 2: Search Funnel + Top Search Terms                             │
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐   │
│  │ Search Funnel                │ │ Top Search Terms (Bar Chart) │   │
│  │ (Horizontal Funnel)          │ │                              │   │
│  │                              │ │ screen flickering ████████   │   │
│  │ Searches: 85,000   100%     │ │ no power         ███████    │   │
│  │  └→ Results Shown: 95.5%    │ │ firmware update  ██████     │   │
│  │     └→ Clicked: 72.3%       │ │ battery drain    █████      │   │
│  │        └→ Marked Helpful:68%│ │ driver download  ████       │   │
│  │           └→ Resolved: 85%  │ │ blue screen      ████       │   │
│  │                              │ │ wifi issue       ███        │   │
│  │      Conversion: ~40%       │ │ overheating      ███        │   │
│  └──────────────────────────────┘ └──────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│  Row 3: Zero-Result Search Analysis                                  │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Zero-Result Search Terms (Actionable List)                        ││
│  │ Search Term              │ Volume │ Trend  │ Action              ││
│  │ "Legion Go S Linux driver"│  850  │  ↑35%  │ [+ Create Draft]   ││
│  │ "R34W-30 downgrade FW"   │  420  │  ↑18%  │ [+ Create Draft]   ││
│  │ "ThinkPad X1 Gen12 BIOS" │  310  │  ↑22%  │ [+ Create Draft]   ││
│  │ "Yoga 9i stylus setup"   │  280  │   →    │ [Review Existing]  ││
│  │ "Chromebook recovery"    │  195  │  ↑8%   │ [+ Create Draft]   ││
│  └──────────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────────┤
│  Row 4: Search Trend (Line) + Low CTR Alerts                         │
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐   │
│  │ Search Volume Trend          │ │ Low CTR Search Terms         │   │
│  │ (Line Chart, 30-day)         │ │ (Alert Cards)                │   │
│  │  3K│     ╱╲                  │ │ ⚠️ "warranty check" CTR 4%  │   │
│  │  2K│╲  ╱  ╲   ╱╲            │ │ ⚠️ "return policy" CTR 6%   │   │
│  │  1K│ ╲╱    ╲─╱  ╲           │ │ ⚠️ "support phone" CTR 3%   │   │
│  │    └─────────────────        │ │                              │   │
│  └──────────────────────────────┘ └──────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

#### 5.2.2 Chart Specifications

| Chart | Type | Rationale |
|---|---|---|
| Search KPIs | KPI Cards | Key search health metrics |
| Search Funnel | Horizontal Funnel | Shows drop-off from search → click → helpful → resolved |
| Top Search Terms | Horizontal Bar Chart | Ranking by volume; bar color intensity = CTR |
| Zero-Result Terms | Actionable Data Table | Terms without results; each row has a CTA button |
| Search Volume Trend | Line Chart | Daily search volume with 7-day moving average overlay |
| Low CTR Alerts | Alert Cards | Search terms with high volume but low click-through |

#### 5.2.3 Business Rules (from BluePrinting)

- "Did one of the top 4 results get clicked on for search or marked helpful" — this is the Search Success Rate
- Zero-result searches above threshold (e.g., N ≥ 200 per 30 days) trigger "Create New Article" suggestion
- Low CTR searches (CTR < 10%) with high volume trigger content improvement tasks

---

### 5.3 Channel Consumption

**Purpose:** Monitor knowledge consumption across downstream channels (KA, Super Agent, PD Guide, NBA, LENA, etc.).  
**Primary Users:** Channel Owners, KM Operators, Leadership.

#### 5.3.1 Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Row 1: Channel Overview KPI Cards (5 across)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Total     │ │ Super    │ │ PD Guide │ │ NBA      │ │ LENA     │  │
│  │ Channel   │ │ Agent    │ │ Calls    │ │ Recs     │ │ Sessions │  │
│  │ Calls     │ │ Sessions │ │          │ │          │ │          │  │
│  │ 2,340,000 │ │ 890,000  │ │ 540,000  │ │ 420,000  │ │ 290,000  │  │
│  │  ↑8.2%    │ │  ↑12%    │ │  ↑5%     │ │  ↑9%     │ │  ↑7%     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├──────────────────────────────────────────────────────────────────────┤
│  Row 2: Channel Distribution + Trend                                 │
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐   │
│  │ Consumption by Channel       │ │ Channel Trend (Line Chart)   │   │
│  │ (Donut Chart)                │ │  500K│  ╱ Super Agent       │   │
│  │                              │ │  400K│ ╱                    │   │
│  │    ╭──────╮                  │ │  300K│╱  NBA               │   │
│  │   ╱ 38%    ╲ Super Agent    │ │  200K│    PD Guide          │   │
│  │   │         │                │ │  100K│      LENA            │   │
│  │   │  23%    │ PD Guide       │ │     └─────────────────       │   │
│  │   │   18%   │ NBA            │ │      Jan Feb Mar Apr May Jun│   │
│  │    ╲ 12% 9%╱ LENA / Others  │ │                              │   │
│  │     ╰──────╯                │ │                              │   │
│  └──────────────────────────────┘ └──────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│  Row 3: Channel Consumption by Content Type (Stacked Bar)            │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │  Super Agent  ████████████████░░░░░░░░░░  PD: 45%, How-To: 30%  ││
│  │  PD Guide     ██████████████████████░░░░  PD: 60%, Hot Tips: 20% ││
│  │  NBA          ██████████████░░░░░░░░░░░░  Hot Tips: 50%, SOP:25% ││
│  │  LENA         ██████████████████████████  PD: 70%, Product: 20%  ││
│  │  Resolve App  ████████████░░░░░░░░░░░░░░  How-To: 40%, Video:30% ││
│  └──────────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────────┤
│  Row 4: Channel Quality Metrics (Comparison Table)                   │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Channel       │ Avg Helpful% │ Resolution% │ Avg Latency │ Trend ││
│  │ Super Agent   │    86.2%     │    72.5%    │   1.2s      │  ↑   ││
│  │ PD Guide      │    89.8%     │    78.3%    │   0.8s      │  ↑   ││
│  │ NBA           │    82.1%     │    68.0%    │   0.5s      │  →   ││
│  │ LENA          │    91.5%     │    81.2%    │   1.5s      │  ↑   ││
│  │ Resolve App   │    87.3%     │    74.8%    │   2.1s      │  ↓   ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

---

### 5.4 Bad Case & Optimization Tasks

**Purpose:** Track feedback-driven optimization tasks, Bad Case analysis, and improvement闭环 (closed loop).  
**Primary Users:** KM Operators, Knowledge Owners, Channel Owners.

#### 5.4.1 Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Row 1: Task KPI Cards (5 across)                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Open      │ │ Overdue  │ │ Avg       │ │ Closed   │ │ Reopen   │  │
│  │ Tasks     │ │ Tasks    │ │ Resolution│ │ This Mo. │ │ Rate     │  │
│  │    47     │ │    12    │ │   3.2 Days│ │    89    │ │   4.5%   │  │
│  │  ↓8       │ │  ↓3      │ │   ↑0.5d   │ │  ↑15     │ │  ↓0.8%   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├──────────────────────────────────────────────────────────────────────┤
│  Row 2: Task Distribution + Task Trend                               │
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐   │
│  │ Tasks by Type (Donut)        │ │ Task Flow (Sankey)           │   │
│  │                              │ │                              │   │
│  │    ╭──────╮                  │ │  Created ──→ In Progress     │   │
│  │   ╱ 35%    ╲ Content Fix    │ │   156    ╲    (89) ──→ Done  │   │
│  │   │         │                │ │            ╲                  │   │
│  │   │  25%    │ New Content    │ │             → Blocked (12)   │   │
│  │   │   18%   │ Archive        │ │             → Rejected (8)   │   │
│  │    ╲ 12%10%╱ Enrich / Other │ │                              │   │
│  │     ╰──────╯                │ │                              │   │
│  └──────────────────────────────┘ └──────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│  Row 3: Bad Case Analysis (Core Actionable Table)                    │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Bad Case Tasks — Requires Action                                  ││
│  │ ID   │ Source     │ Issue Type    │ Article          │ Pri │Owner ││
│  │ #142 │ Portal FB  │ Incorrect info│ No Power Fix     │ P1  │ Li   ││
│  │ #141 │ Zero Search│ Missing cover │ Linux Driver     │ P1  │ Wang ││
│  │ #140 │ Channel FB │ Low relevance │ Battery SOP      │ P2  │ Chen ││
│  │ #139 │ Portal FB  │ Outdated step │ BIOS Update      │ P2  │ Li   ││
│  │ #138 │ NBA FB     │ Confusing text│ Warranty Check   │ P3  │ Smith││
│  └──────────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────────┤
│  Row 4: Feedback Source Analysis + Task Status Breakdown             │
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐   │
│  │ Bad Case by Source (Bar)     │ │ Task Status Breakdown (Bar)  │   │
│  │                              │ │                              │   │
│  │ Portal Feedback  ██████ 42% │ │ Open        ██████████  47   │   │
│  │ Zero-Result      ████   28% │ │ In Progress ██████      28   │   │
│  │ Channel Feedback ███    18% │ │ In Review   ████       18   │   │
│  │ Low CTR Alert    ██     12% │ │ Blocked     ██          12   │   │
│  │                              │ │ Closed      ██████████████89│   │
│  └──────────────────────────────┘ └──────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

#### 5.4.2 Task Lifecycle

```
Feedback Received → Auto-Categorized → Task Created → Assigned → In Progress → Reviewed → Closed
                                    ↳ Knowledge Issue → UKM (Content Fix / Enrich / Create / Archive)
                                    ↳ Agent/Prompt Issue → KA Team (Prompt / Strategy Fix)
                                    ↳ Channel Issue → Channel Team (UX / Format Fix)
```

#### 5.4.3 Bad Case Attribution Rules (from UKM Project Principles)

| Root Cause | Indicator | Action Target |
|---|---|---|
| No knowledge exists | Zero-result search + no matching article | **UKM** — Create new article |
| Knowledge incomplete | High views + negative feedback ("missing steps") | **UKM** — Enrich content |
| Knowledge outdated/incorrect | Negative feedback ("incorrect/wrong") + old last-modified date | **UKM** — Correct/Fix |
| Mapping missing | Search returns results but irrelevant | **UKM** — Fix taxonomy mapping |
| Card structure poor | Card consumed but low helpful% | **UKM** — Redesign Knowledge Card |
| KA retrieval error | Right knowledge exists but not surfaced | **KA** — Fix retrieval/ranking |
| Prompt/channel issue | Right answer retrieved but poorly presented | **KA/Channel** — Fix prompt/format |
| Process/strategy issue | Correct info shown but wrong context/timing | **KA** — Fix orchestration |

---

## 6. Article Deep Dive (Drill-Down Page)

**Purpose:** Single-article analytics — UX behavior, scroll depth, feedback details, cross-linking.  
**Primary Users:** Knowledge Owners, Content Editors, KM Operators.  
**Trigger:** Click any article title from any table across the dashboard.

#### 6.0.1 Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Article Header                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ Title: Troubleshooting ThinkVision R34W-30 Screen Flickering     ││
│  │ Taxonomy: IDG > THINKVISION > VIS R SERIES | Hardware > Display  ││
│  │ Status: Published | Owner: Zhang* | Last Updated: 2026-05-15     ││
│  └──────────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────────┤
│  Row 1: Article KPIs (6 across)                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  │ Total    │ │ Helpful  │ │ Avg Time │ │ Bounce   │ │ Activity │ │ Load    │
│  │ Views    │ │ %        │ │ on Page  │ │ Rate     │ │ Rate     │ │ Time    │
│  │  1,200   │ │  88.5%   │ │  1m 45s  │ │  42%     │ │  55%     │ │  3.2s   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
├──────────────────────────────────────────────────────────────────────┤
│  Row 2: Scroll Depth Analysis + View Trend                           │
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐   │
│  │ Scroll Depth (Bar + Line)    │ │ Daily Views (Line Chart)     │   │
│  │                              │ │                              │   │
│  │ 100%│██  8%                  │ │  80│   ╱╲                    │   │
│  │  75%│████ 20%                │ │  60│╲ ╱  ╲   ╱╲             │   │
│  │  50%│████████ 65%            │ │  40│ ╲╱    ╲─╱  ╲           │   │
│  │  25%│██████████████ 100%     │ │  20│              ╲          │   │
│  │      └───────────────        │ │    └─────────────────         │   │
│  │    Drop-off at 75% → Video!  │ │                              │   │
│  └──────────────────────────────┘ └──────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│  Row 3: Cross-linking + Feedback Details                             │
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐   │
│  │ Cross-linking Flow           │ │ Feedback Summary             │   │
│  │ (Sankey / Flow)              │ │                              │   │
│  │                              │ │ Helpful:  1,062 (88.5%)      │   │
│  │  This Article                │ │ Not Helpful: 138 (11.5%)    │   │
│  │   ├→ GPU Driver (30%)       │ │                              │   │
│  │   ├→ Monitor Settings (22%) │ │ Top reasons (Not Helpful):   │   │
│  │   ├→ Cable Check (18%)      │ │ • Steps unclear (42)         │   │
│  │   ├→ Firmware (15%)         │ │ • Didn't solve issue (38)    │   │
│  │   └→ Warranty (15%)         │ │ • Missing details (35)       │   │
│  │                              │ │ • Wrong product (23)         │   │
│  └──────────────────────────────┘ └──────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│  Row 4: Attachments & Version History                                │
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐   │
│  │ Embedded Assets              │ │ Version History (Timeline)   │   │
│  │                              │ │                              │   │
│  │ 📹 Video: 450 plays (37.5%) │ │ v3.2  2026-05-15  Zhang*    │   │
│  │ 🖼️ Image 1: 890 views (74%) │ │   • Updated troubleshooting │   │
│  │ 🖼️ Image 2: 720 views (60%) │ │ v3.1  2026-04-02  Li        │   │
│  │ 📎 PDF Guide: 230 downloads │ │   • Added video attachment   │   │
│  │                              │ │ v3.0  2026-03-10  Zhang*    │   │
│  │  [View in Content Editor]   │ │   • Initial publish          │   │
│  └──────────────────────────────┘ └──────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 7. Reports & Export

**Purpose:** Scheduled and ad-hoc report generation, data export, subscription management.  
**Primary Users:** KM Operators, Leadership, Channel Owners.

### 7.1 Report Types

| Report | Frequency | Format | Recipients |
|---|---|---|---|
| Weekly Usage Summary | Weekly (Mon 8AM) | HTML Email + PDF | KM Operators, Space Owners |
| Monthly Content Health | Monthly (1st) | XLSX + PDF | Leadership, Content Team |
| Broken Link Alert | Weekly (Fri) | HTML Email | KM Operators |
| Zero-Result Search Digest | Weekly (Wed) | HTML Email | Content Strategists |
| Contributor Performance | Monthly | XLSX | Team Leads (anonymized) |
| Channel Consumption Report | Weekly | HTML Email + CSV | Channel Owners |
| SLA Compliance Report | Monthly | PDF | Leadership |
| Orphaned Content Report | Monthly | XLSX | KM Operators |
| Ad-hoc Report | On demand | XLSX / CSV / PDF | Custom recipient list |

### 7.2 Export Capabilities

- All data tables support: Export CSV, Export XLSX
- All charts support: Export PNG, Export SVG, Download underlying data as CSV
- Subscription management panel: Add/remove recipients, configure frequency, choose format
- API access for Power BI / Adobe Analytics integration

---

## 8. Responsive Behavior & Device Support

| Viewport | Behavior |
|---|---|
| Desktop (≥1280px) | Full 2-column layout, all charts visible |
| Tablet (768-1279px) | Single column, charts stack vertically, KPI cards reduce to 2 per row |
| Mobile (<768px) | KPI cards: 1 per row, charts simplified, tables become card lists |

---

## 9. Empty States & Error Handling

| State | Visual |
|---|---|
| No data available | Grey illustration + "No data available for the selected filters. Try adjusting your filters." |
| Loading | Skeleton placeholders (grey pulsing bars matching chart shapes) |
| Error | Red banner: "Unable to load data. [Retry]" |
| Zero results | Empty table with suggestions: "No matching results. Try broadening your filters." |

---

## 10. Design Tokens Summary

```css
/* Primary */
--color-primary: #1A56DB;
--color-primary-hover: #1E40AF;
--color-primary-light: #E8F0FE;

/* Neutral */
--color-bg: #FFFFFF;
--color-surface: #F9FAFB;
--color-border: #E5E7EB;
--color-text-primary: #111827;
--color-text-secondary: #6B7280;

/* Semantic */
--color-success: #16A34A;
--color-success-bg: #F0FDF4;
--color-warning: #F59E0B;
--color-warning-bg: #FEF3C7;
--color-error: #DC2626;
--color-error-bg: #FEE2E2;

/* Typography */
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 24px;
--font-size-2xl: 32px;  /* KPI values */

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;

/* Border Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
```

---

## 11. Page-to-Page Navigation Flow

```
Executive Overview (Landing)
    │
    ├── Knowledge Management ──→ Content Lifecycle
    │                               │
    │                               ├── Click Article → Article Deep Dive
    │                               │
    │                           ──→ Contributor Center
    │                               │
    │                               └── Click Contributor → Filtered View
    │
    │                           ──→ Governance Health
    │                               │
    │                               └── Click Alert → Article Deep Dive / Fix
    │
    │                           ──→ Taxonomy Explorer
    │
    └── Consumption & Feedback ──→ Portal Usage
    │                               │
    │                               └── Click Article → Article Deep Dive
    │
                                ──→ Search Analytics
                                │
                                └── Click Zero-Result → Create Draft
                                │
                                ──→ Channel Consumption
                                │
                                ──→ Bad Case & Tasks
                                    │
                                    └── Click Task → Task Detail / Article Deep Dive
```

---

## 12. Appendix: Metric-to-Chart Mapping Reference

| Metric Category | Metric | Recommended Chart | Page |
|---|---|---|---|
| **Knowledge Volume** | Total Articles, Drafts, In Review, Published, Archived | KPI Cards | Content Lifecycle |
| **Lifecycle** | Status Distribution over Time | Stacked Bar Chart | Content Lifecycle |
| **Draft Health** | Draft Aging (by age bucket) | Horizontal Bar Chart | Content Lifecycle |
| **Approval** | Average Days per Stage | Bullet Bar / Gantt | Content Lifecycle |
| **Contributor** | Top Contributors Ranking | Sortable Table | Contributor Center |
| **Contributor** | Quality vs Volume | Scatter Plot | Contributor Center |
| **Governance** | Broken Links Trend | Line Chart | Governance Health |
| **Governance** | Orphaned Articles by Topic | Horizontal Bar Chart | Governance Health |
| **Taxonomy** | Articles per Node | Treemap | Taxonomy Explorer |
| **Taxonomy** | Hierarchy Navigation | Tree View | Taxonomy Explorer |
| **Portal Usage** | Daily Views & Visitors | Dual-Line Chart | Portal Usage |
| **Portal Usage** | Views by Product (Top 10) | Horizontal Bar Chart | Portal Usage |
| **Portal Usage** | Consumption by Topic | Donut Chart | Executive Overview |
| **Portal Usage** | Views by Region | Choropleth Map | Portal Usage |
| **Portal Usage** | Views by Device | Donut Chart | Portal Usage |
| **Search** | Search Funnel | Horizontal Funnel | Search Analytics |
| **Search** | Top Search Terms | Horizontal Bar Chart | Search Analytics |
| **Search** | Zero-Result Terms | Actionable Table | Search Analytics |
| **Search** | Search Volume Trend | Line Chart | Search Analytics |
| **Channel** | Consumption by Channel | Donut Chart | Channel Consumption |
| **Channel** | Channel Trend | Multi-Line Chart | Channel Consumption |
| **Channel** | Content Type by Channel | Stacked Bar Chart | Channel Consumption |
| **Feedback** | Tasks by Type | Donut Chart | Bad Case & Tasks |
| **Feedback** | Task Flow | Sankey Diagram | Bad Case & Tasks |
| **Feedback** | Bad Case by Source | Horizontal Bar Chart | Bad Case & Tasks |
| **Feedback** | Task Status Breakdown | Horizontal Bar Chart | Bad Case & Tasks |
| **Article** | Scroll Depth | Vertical Bar Chart | Article Deep Dive |
| **Article** | Daily Views | Line Chart | Article Deep Dive |
| **Article** | Cross-linking Flow | Sankey Diagram | Article Deep Dive |

---

## 13. Open Design Decisions

| # | Question | Status |
|---|---|---|
| 1 | Should ML-predicted recommendations (orphaned prediction, taxonomy suggestions) appear as a separate widget or inline with existing charts? | To confirm |
| 2 | Sentiment analysis word cloud — positioned on Search Analytics or separate NLP Insights page? | To confirm |
| 3 | PD Tree drop-off analysis — integrated into Article Deep Dive or a dedicated PD Analytics page? | To confirm |
| 4 | YouTube analytics integration — embedded as external data widget or separate section? | To confirm |
| 5 | Agent-level usage tracking (CEC per-agent) — requires GDPR/PII review before implementation | To confirm |
