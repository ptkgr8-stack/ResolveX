<div align="center">

# 🏫 ResolveX

### Intelligent & Predictive Campus Issue Reporting & Prioritization Platform

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=Reactive+%E2%86%92+Predictive;Complaint+Management+%E2%86%92+Campus+Intelligence;Manual+Prioritization+%E2%86%92+AI-Assisted+Prioritization;Problem+Resolution+%E2%86%92+Predictive+Prevention" alt="Typing SVG" />

<br/>

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](#)
[![Python](https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](#)

<br/>

![Status](https://img.shields.io/badge/status-active--development-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![PRs](https://img.shields.io/badge/PRs-welcome-orange?style=flat-square)
![Made with](https://img.shields.io/badge/made%20with-%E2%9D%A4%EF%B8%8F%20%2B%20AI-red?style=flat-square)

</div>

---

## 🧠 What is ResolveX?

> ResolveX transforms the traditional, manual campus complaint system into an **intelligent, predictive, and data-driven platform**.

Instead of treating every campus complaint the same, ResolveX **understands** the issue, **analyzes** its severity, assigns an **AI-driven priority score**, **routes** it automatically to the right department, **tracks** its resolution — and **learns** from historical data to **predict** and **prevent** future problems.

<div align="center">

```
UNDERSTAND → PRIORITIZE → ROUTE → RESOLVE → LEARN → PREDICT → PREVENT
```

</div>

---

## 😩 The Problem

Traditional campus complaint systems are purely **reactive**:

| Pain Point | Impact |
|---|---|
| 🔴 Critical issues buried under routine ones | Safety risks go unnoticed |
| 🐌 Manual classification & routing | Slow response times |
| 📋 Duplicate complaints | Wasted staff effort |
| 🕳️ No centralized visibility | Poor decision-making |
| 🔁 Recurring problems go unnoticed | Same issues repeat endlessly |
| 📉 Historical data underutilized | Zero predictive power |
| 🧯 Maintenance is reactive, not preventive | Higher long-term cost |

**ResolveX fixes this with AI-driven prioritization, automated routing, analytics, and predictive intelligence.**

---

## ⚙️ How It Works

```mermaid
flowchart TD
    A[📝 User Reports Issue] --> B[Text + Image + Location + Details]
    B --> C[🤖 AI Analysis]
    C --> D[Issue Classification]
    D --> E[Severity Detection]
    E --> F[Priority Calculation]
    F --> G[Duplicate / Similar Issue Detection]
    G --> H[🏢 Department Assignment]
    H --> I[📊 Resolution Tracking]
    I --> J[Historical Data Collection]
    J --> K[Pattern Detection]
    K --> L[🔮 Predictive Analysis]
    L --> M[🛠️ Preventive Maintenance Recommendation]
```

---

## ✨ Key Features

<table>
<tr>
<td width="50%" valign="top">

### 👤 For Students
- 🔐 Simple account creation & login
- 📍 Report issues with text, image & location
- 🤖 Instant AI analysis of the issue
- 📈 See real-time priority & severity
- 🔔 Live status tracking & notifications
- 🕓 View full report history

</td>
<td width="50%" valign="top">

### 🛡️ For Admins
- 📊 Centralized Campus Operations Dashboard
- 🚨 Intelligent Priority Queue
- 🗺️ Live Campus Issue Map
- 🧩 Duplicate/similar issue merging
- 📉 Analytics & department workload
- 🔮 Predictive alerts & AI insights

</td>
</tr>
</table>

---

## 🤖 AI Analysis — Example

**Input:**
> "Water leakage near electrical equipment in Engineering Block."

**AI Output:**

| Field | Value |
|---|---|
| 🏷️ Category | Electrical + Water Infrastructure |
| 🔥 Severity | **CRITICAL** |
| 🎯 Priority | **92 / 100** |
| ✅ Confidence | 96% |
| 🏢 Department | Electrical Maintenance |
| 💬 Reason | *"Water is present near electrical infrastructure, creating a potential safety hazard."* |

---

## 🧮 Intelligent Priority Engine

ResolveX never prioritizes by submission order. Priority is computed from multiple real-world signals:

```mermaid
flowchart LR
    A[Severity] --> F((Priority Score))
    B[Urgency] --> F
    C[Potential Impact] --> F
    D[Affected Users] --> F
    E[Historical Recurrence] --> F
    F --> G{Priority Level}
    G --> H[🔴 CRITICAL]
    G --> I[🟠 HIGH]
    G --> J[🟡 MEDIUM]
    G --> K[🟢 LOW]
```

<div align="center">

| Issue Example | Priority Level |
|---|:---:|
| Broken classroom chair | 🟢 LOW |
| Wi-Fi issue affecting 1 student | 🟢 LOW / 🟡 MEDIUM |
| Internet outage — entire building | 🟠 HIGH |
| Water leakage near electrical equipment | 🔴 CRITICAL |

</div>

---

## 🗂️ Smart Department Routing

| Issue Type | Auto-Routed To |
|---|---|
| ⚡ Electrical | Electrical Maintenance |
| 🚰 Water / Plumbing | Plumbing |
| 📶 Internet / Wi-Fi | IT Department |
| 🗑️ Garbage | Sanitation |
| 🏗️ Building / Road Damage | Civil Maintenance |
| ❄️ AC / Fan / HVAC | HVAC Department |
| 🚨 Security | Security Department |

---

## 🧩 Duplicate Issue Detection

```mermaid
flowchart LR
    A[New Issue] --> B[Compare with Existing Issues]
    B --> C{Similar Issue Found?}
    C -->|Yes| D[🔗 Link / Flag / Merge]
    C -->|No| E[🆕 Create New Issue]
```

---

## 🔮 Predictive Intelligence

The real differentiator — ResolveX doesn't just ask *"what's broken?"*, it asks ***"what's about to break?"***

```mermaid
flowchart TD
    A[Hostel Block B] --> B[17 plumbing complaints]
    B --> C[🔁 Recurring Pattern Detected]
    C --> D[📈 Risk Increasing]
    D --> E[🚨 Predictive Alert Generated]
    E --> F[🔧 Preventive Inspection Recommended]
```

**Example AI Insights shown on the Admin Dashboard:**

> 💡 "Electrical issues increased this week."
> 💡 "3 high-priority issues require immediate attention."
> 💡 "Hostel Block B shows a recurring plumbing pattern."
> 💡 "Preventive inspection may be required in frequently affected areas."

---

## 📊 Issue Lifecycle

```mermaid
flowchart LR
    A[Reported] --> B[AI Analyzed] --> C[Assigned] --> D[In Progress] --> E[Resolved] --> F[Closed]
```

---

## 🖥️ Tech Stack

<div align="center">

| Layer | Technologies |
|---|---|
| **Frontend** | ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Tailwind](https://img.shields.io/badge/-TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) |
| **Backend** | ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) |
| **AI / ML** | Machine Learning • NLP • Computer Vision • Predictive Analytics • Pattern Detection |
| **Tooling** | ![Git](https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github&logoColor=white) ![VS Code](https://img.shields.io/badge/-VS%20Code-007ACC?style=flat-square&logo=visual-studio-code&logoColor=white) |

</div>

---

## 📁 Project Structure

```
ResolveX/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── services/
│       ├── hooks/
│       ├── utils/
│       └── types/
│
├── backend/
│   └── app/
│       ├── api/
│       ├── models/
│       ├── schemas/
│       ├── services/
│       ├── core/
│       └── main.py
│
├── ml/
│   ├── models/
│   ├── preprocessing/
│   ├── training/
│   └── inference/
│
├── README.md
└── .gitignore
```

---

## 🗺️ Development Roadmap

- [x] **Phase 1 — Frontend** — UI built with mock data (landing, dashboards, report flow, admin panel, priority queue, campus map)
- [ ] **Phase 2 — Backend** — Auth, issue APIs, priority engine, analytics APIs
- [ ] **Phase 3 — Database** — PostgreSQL schema & relationships
- [ ] **Phase 4 — AI / ML** — Classification, severity & priority prediction, duplicate & image analysis, pattern detection
- [ ] **Phase 5 — Integration** — Connect Frontend ↔ Backend ↔ DB ↔ AI/ML
- [ ] **Phase 6 — Deployment** — Ship it 🚀

<div align="center">

![Progress](https://progress-bar.xyz/16/?title=Overall%20Progress&width=400&color=6366F1)

</div>

---

## 🎨 Design Philosophy

ResolveX is built to feel like a **modern AI SaaS platform** — not a generic college complaint portal.

✅ Clean • Modern • Data-driven • Premium • Minimal • Strong visual hierarchy
🚫 No excessive gradients, cartoonish UI, or Bootstrap-default dashboards

**Color System**

| Priority | Color | Status | Color |
|---|---|---|---|
| Critical | 🔴 Red | Reported | 🟣 Purple |
| High | 🟠 Orange | AI Analyzed | 🔵 Blue |
| Medium | 🟡 Yellow | In Progress | 🟡 Yellow |
| Low | 🟢 Green | Resolved | 🟢 Green |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-username>/ResolveX.git
cd ResolveX

# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup (coming soon)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](../../issues) or open a PR.

---

<div align="center">

### 💡 The Vision

**Reactive → Predictive** &nbsp;|&nbsp; **Manual → Intelligent** &nbsp;|&nbsp; **Complaint-driven → Data-driven**

*ResolveX doesn't just collect campus complaints — it understands, prioritizes, learns, and predicts.*

<br/>

⭐ **If you like this project, consider giving it a star!** ⭐

<img src="https://capsule-render.vercel.app/api?type=waving&color=6366F1&height=120&section=footer"/>

</div>
