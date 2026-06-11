export interface Project {
  id: string;
  eyebrow: string;
  name: string;
  description: string;
  stack: string[];
  link: string | null;
  linkLabel: string;
}

export const projects: Project[] = [
  {
    id: 'mynet',
    eyebrow: 'CPU Inference Engine',
    name: 'mynet',
    description:
      'A from-scratch CPU inference engine in C, inspired by llama.cpp. Implements the GGUF format, a ggml-style tensor graph, and Q4_0/Q8_0 quantization — built to understand what happens below the framework.',
    stack: ['C', 'GGUF', 'Quantization', 'Transformer Ops'],
    link: 'https://github.com/AbdullahSayed038/mynet',
    linkLabel: 'github.com/AbdullahSayed038/mynet',
  },
  {
    id: 'aboudi-os',
    eyebrow: 'AI Companion',
    name: 'Aboudi OS',
    description:
      'A local-first personal life OS — goals, habits, journal, daily check-ins — with a self-rewriting AI persona powered by Qwen running entirely on-device. The AI rewrites its own system prompt weekly based on your mood, streaks, and journal entries.',
    stack: ['React', 'FastAPI', 'PostgreSQL', 'Ollama', 'Qwen'],
    link: 'https://github.com/AbdullahSayed038/aboudi-os',
    linkLabel: 'github.com/AbdullahSayed038/aboudi-os',
  },
  {
    id: 'aisee',
    eyebrow: 'Chrome Extension · Accessibility',
    name: 'AISEE',
    description:
      'An Arabic-first AI voice agent for blind Arabic-speaking users, built as a Chrome extension. Pitched around UAE sovereign AI infrastructure — Falcon-Arabic (TII), Core42 hosting, TDRA compliance — with speech-to-text via faster-whisper.',
    stack: ['TypeScript', 'Vite', 'FastAPI', 'faster-whisper', 'Falcon-Arabic'],
    link: 'https://github.com/AbdullahSayed038/aisee',
    linkLabel: 'github.com/AbdullahSayed038/aisee',
  },
  {
    id: 'dr-quine',
    eyebrow: 'Systems · x86-64 Assembly',
    name: 'dr-quine',
    description:
      "Six self-reproducing programs (quines) written in C and x86-64 NASM assembly, illustrating Kleene's recursion theorem — including a decrementing generational chain. Code that rewrites itself, by hand, in assembly.",
    stack: ['C', 'x86-64 NASM', 'Systems'],
    link: 'https://github.com/AbdullahSayed038/dr-quine',
    linkLabel: 'github.com/AbdullahSayed038/dr-quine',
  },
  {
    id: 'ft-transcendence',
    eyebrow: 'Full-Stack · Real-Time',
    name: 'ft_transcendence',
    description:
      'Full-stack multiplayer Pong built at 42 — real-time WebSocket gameplay, OAuth, a tournament system, and live chat, all containerized with Docker. Sole backend developer.',
    stack: ['TypeScript', 'NestJS', 'WebSockets', 'OAuth', 'Docker'],
    link: 'https://github.com/AbdullahSayed038/ft_transcendence',
    linkLabel: 'github.com/AbdullahSayed038/ft_transcendence',
  },
];
