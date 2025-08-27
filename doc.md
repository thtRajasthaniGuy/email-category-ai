# 📂 Expanded Document Plan

## 1️⃣ Tech Stack & Architecture (Detailed Doc)

### Frontend

-   **Why React + Vite + Tailwind** → speed, maintainability,
    scalability.
-   **State management** (Zustand vs Redux).
-   **Deployment options** (Vercel vs Netlify).

### Backend / Infra

-   **Why Supabase** (serverless, built-in auth, real-time DB).
-   **Alternatives considered** (Firebase, Hasura).
-   **Data structure** for emails, categories, summaries.
-   **Security** (row-level security, OAuth, token-based).

### AI Layer

-   **Why Gemini Flash** for real-time tasks.
-   **Why Gemini Pro** for deeper summarization/insights.
-   **Future hybrid model strategy** (multi-LLM fallback).

### Scalability Considerations

-   From **MVP → enterprise load**.
-   **Multi-tenant architecture** for businesses.
-   **Logging, monitoring, error tracking** (Sentry/LogRocket).

------------------------------------------------------------------------

## 2️⃣ Feature Roadmap (Detailed Doc)

### MVP Features

-   AI categorization (priority inbox, orders, payments, newsletters,
    etc.).
-   AI summarization (thread + long emails).
-   Gmail/Outlook login with OAuth.
-   User dashboard with filters & search.
-   Custom categories by user.

### Phase 2 Features

-   AI auto-replies (drafting suggested responses).
-   Team collaboration (assign emails, shared inbox).
-   Business-specific categories (e.g., "Orders", "Refunds").
-   Shopify/WooCommerce integration.

### Phase 3 Features

-   Predictive analytics (revenue impact of emails).
-   AI suggestions (flagging urgent vendor/customer issues).
-   Fraud/spam detection (AI + rules).
-   Multi-language summarization.

### Differentiators vs Competitors

-   **InboxPilot** → focus on e-commerce, but lacks deep AI replies.
-   **Shortwave** → strong on consumer productivity, not B2B focus.
-   **Ours** → business-first, customizable, cheaper, scalable.

------------------------------------------------------------------------

## 3️⃣ AI Model Strategy (Detailed Doc)

-   **Gemini Flash vs Gemini Flash Lite** → cost vs accuracy trade-off.
-   **Why multi-model approach matters** (categorization ≠ summarization
    ≠ replies).
-   **Few-shot prompting for categorization** → reduce
    misclassification.
-   **User feedback loop** (thumbs up/down → improves prompts).
-   **Fine-tuning plan** (if/when dataset grows).
-   **Fallback to cheaper model** for high-volume, low-priority emails
    (like newsletters).
-   **Scaling AI usage** → batching summaries, caching results.

------------------------------------------------------------------------

## 4️⃣ Pricing & Plans (Detailed Doc)

### Free Plan

-   Hook users, limited features.

### Pro Plan

-   Unlock business categories, integrations.

### Enterprise Plan

-   Custom AI tuning, SLAs.

### Monetization Strategy

-   Subscription + upsells (AI credits for extra summaries).

### Competitive Analysis

-   Shortwave, InboxPilot, Superhuman pricing.

### Unit Economics

-   AI call cost vs user subscription fee.

------------------------------------------------------------------------

## 5️⃣ Go-To-Market (Detailed Doc)

### Target Segments

-   E-commerce sellers drowning in order emails.
-   SMBs with high-volume customer support inboxes.
-   Agencies managing multiple client inboxes.

### Launch Strategy

-   Beta launch via Product Hunt + LinkedIn.
-   Shopify/WooCommerce app store listing.
-   Free trial + case studies.

### Marketing

-   **Landing page** → minimalistic, clear ROI messaging.
-   **Demo video** → AI categorization & summarization in action.
-   **Content marketing** → "How e-commerce founders save 10hrs/week
    with AI".

### Retention

-   Daily email summary digest.
-   Slack/Teams integration.
-   Leaderboards for time saved.
