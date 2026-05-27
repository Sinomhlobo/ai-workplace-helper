# WorkAI — AI Workplace Productivity Assistant

A modern, responsive SaaS-style web application that boosts workplace productivity through AI-powered tools. Generate professional emails, summarize meeting notes, plan your day, and chat with an AI assistant — all in a clean, focused interface inspired by the best productivity apps.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tech Stack](https://img.shields.io/badge/TanStack_Start-1.0-FF4154?logo=tanstack)
![Tech Stack](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Tech Stack](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)

## ✨ Features

### 📧 Smart Email Generator
- Generate professional emails from a simple brief
- Choose from **Formal, Friendly, Persuasive, or Apologetic** tones
- Fully editable output before copying or sending

### 📝 Meeting Notes Summarizer
- Paste raw notes or transcripts and get structured summaries
- Automatically extracts:
  - **Key summary** of the meeting
  - **Action items** with owners
  - **Deadlines** and due dates
  - **Decisions** made
- Toggle between rendered Markdown preview and raw edit mode

### 🗓️ AI Task Planner
- Input your task list and get an intelligently prioritized daily schedule
- AI organizes workload by urgency, dependencies, and time blocks
- Edit the generated plan directly

### 💬 AI Chatbot Assistant
- Interactive workplace chatbot for general productivity tasks
- Context-aware conversations with Markdown rendering
- Copy any AI response with one click
- Enter to send, Shift+Enter for new lines

### 🎨 Design & UX
- **Modern dashboard UI** with sidebar navigation
- **Responsive** mobile and desktop layout
- **Dark/Light mode** toggle with system preference detection
- **Loading animations** and streaming text for real-time feedback
- **Copy-to-clipboard** buttons on all AI outputs
- **Responsible AI disclaimer** footer
- Clean, minimal aesthetic inspired by Notion, Slack, and Linear

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7 + SSR) |
| Styling | Tailwind CSS v4 + shadcn/ui components |
| AI | Vercel AI SDK + Lovable AI Gateway (Gemini 3 Flash) |
| State | React hooks + TanStack Query |
| Icons | Lucide React |
| Markdown | react-markdown + @tailwindcss/typography |

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 20+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd aipoweredassistance

# Install dependencies
bun install

# Start the development server
bun dev
```

The app will be available at `http://localhost:3000`.

### Building for Production

```bash
# Production build
bun run build

# Preview production build locally
bun preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── AppSidebar.tsx          # Responsive sidebar with mobile drawer
│   ├── CopyButton.tsx          # One-click copy with toast feedback
│   ├── Layout.tsx              # Page shell with header + content area
│   └── ui/                     # shadcn/ui components (Button, Card, Dialog, etc.)
├── hooks/
│   ├── use-theme.tsx           # Dark/light mode with localStorage persistence
│   └── use-mobile.tsx          # Mobile breakpoint detection
├── lib/
│   ├── ai-client.ts            # Client helper for streaming AI completions
│   ├── ai-gateway.server.ts    # Server-side AI gateway configuration
│   ├── feature-prompts.ts      # Specialized system prompts for each tool
│   └── utils.ts                # cn() utility and helpers
├── routes/
│   ├── __root.tsx              # Root layout (head, providers, outlet)
│   ├── index.tsx               # Dashboard / landing page
│   ├── email.tsx               # Smart Email Generator
│   ├── notes.tsx               # Meeting Notes Summarizer
│   ├── planner.tsx             # AI Task Planner
│   ├── chat.tsx                # AI Chatbot Assistant
│   └── api/
│       └── chat.ts             # Server route: streaming AI completions
├── router.tsx                  # TanStack Router configuration
├── server.ts                   # SSR entry with error handling
├── start.ts                    # Start instance with middleware
└── styles.css                  # Tailwind CSS + custom design tokens
```

## 🔧 Configuration

The app uses **Lovable AI Gateway** for AI completions. No API keys are required in client code — the gateway is configured server-side.

Environment variables (server-only):
- `SUPABASE_URL` / `VITE_SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY`

## 🛣️ Routes

| Route | Feature |
|-------|---------|
| `/` | Dashboard with feature cards |
| `/email` | Smart Email Generator |
| `/notes` | Meeting Notes Summarizer |
| `/planner` | AI Task Planner |
| `/chat` | AI Chatbot Assistant |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component system
- [TanStack](https://tanstack.com/) for Start, Router, and Query
- [Vercel AI SDK](https://sdk.vercel.ai/) for streaming AI integration
