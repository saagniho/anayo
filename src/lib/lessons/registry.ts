import type { World } from "./types";

/**
 * The Anayo curriculum — 5 worlds, every concept Saurabh listed is covered:
 * Generative AI, LLMs, Transformers, Prompting, Agents, Agentic workflows,
 * the Harness, and Claude Code. This static manifest will later be generated
 * by scanning content/worlds/** so non-devs can add lessons as data.
 */
export const WORLDS: World[] = [
  {
    id: "w1",
    slug: "meet-ai",
    title: "Meet AI",
    tagline: "What is it, really?",
    emoji: "🌱",
    color: "#34d399",
    order: 1,
    lessons: [
      {
        id: "l1-1",
        slug: "what-is-ai",
        title: "What is AI?",
        concept: "AI learns patterns from examples — it isn't magic or hand-written rules.",
        hook: "How does a computer learn — without anyone writing the rules?",
        ability: { id: "see", label: "SEE", icon: "👁️" },
        aha: {
          explorer:
            "You never wrote a single rule! You showed Anayo a few examples, and it found the pattern all by itself. That's what AI is — learning from examples, not following rules someone typed in. 🤯",
          curious:
            "That's the heart of machine learning: you gave labelled examples, Anayo found a decision boundary that best fits them, then generalised to blobs it had never seen. No hand-coded rules — the pattern was learned from data. Scale that to billions of examples and you get modern AI.",
        },
        live: true,
      },
      {
        id: "l1-2",
        slug: "words-into-numbers",
        title: "Words into Numbers",
        concept: "Computers turn words into tokens and numbers (embeddings).",
        hook: "How does a computer 'read' a word?",
        ability: { id: "read", label: "READ", icon: "📖" },
        live: false,
      },
    ],
  },
  {
    id: "w2",
    slug: "how-ai-talks",
    title: "How AI Talks",
    tagline: "Guessing, imagining & attention",
    emoji: "💬",
    color: "#8b5cff",
    order: 2,
    lessons: [
      {
        id: "l2-1",
        slug: "predict-the-next-word",
        title: "Predict the Next Word",
        concept: "Generative AI = repeatedly predicting the most likely next word.",
        hook: "Can you think like an AI?",
        ability: { id: "guess", label: "GUESS", icon: "🔮" },
        live: false,
      },
      {
        id: "l2-2",
        slug: "the-big-brain",
        title: "The Big Brain",
        concept: "An LLM is 'large' because it learned from oceans of text.",
        hook: "What makes a language model so big?",
        ability: { id: "imagine", label: "IMAGINE", icon: "✨" },
        live: false,
      },
      {
        id: "l2-3",
        slug: "paying-attention",
        title: "Paying Attention",
        concept: "Transformers weigh which words matter to each other (attention).",
        hook: "Which words is the AI really looking at?",
        ability: { id: "focus", label: "FOCUS", icon: "🎯" },
        live: false,
      },
    ],
  },
  {
    id: "w3",
    slug: "talking-to-ai",
    title: "Talking to AI",
    tagline: "The art of asking",
    emoji: "🎯",
    color: "#27e0f0",
    order: 3,
    lessons: [
      {
        id: "l3-1",
        slug: "the-art-of-asking",
        title: "The Art of Asking",
        concept: "Clear instructions and context steer the model (prompting).",
        hook: "Why do vague questions get vague answers?",
        ability: { id: "ask", label: "ASK", icon: "💬" },
        live: false,
      },
      {
        id: "l3-2",
        slug: "show-dont-tell",
        title: "Show, Don't Just Tell",
        concept: "Examples and context (few-shot) make answers much better.",
        hook: "Teach by example and watch quality jump.",
        ability: { id: "context", label: "CONTEXT", icon: "🗂️" },
        live: false,
      },
    ],
  },
  {
    id: "w4",
    slug: "ai-that-does-things",
    title: "AI That Does Things",
    tagline: "Agents, plans & the cockpit",
    emoji: "🦾",
    color: "#ff7a59",
    order: 4,
    lessons: [
      {
        id: "l4-1",
        slug: "from-talking-to-doing",
        title: "From Talking to Doing",
        concept: "An agent = a model + tools + a goal.",
        hook: "What if the AI could actually do things?",
        ability: { id: "act", label: "ACT", icon: "🦾" },
        live: false,
      },
      {
        id: "l4-2",
        slug: "step-by-step",
        title: "Step by Step",
        concept: "Agentic workflows break a goal into steps, loops and checks.",
        hook: "How does AI tackle a big, messy job?",
        ability: { id: "plan", label: "PLAN", icon: "🧩" },
        live: false,
      },
      {
        id: "l4-3",
        slug: "the-cockpit",
        title: "The Cockpit",
        concept: "The harness is the scaffolding around the model: tools, memory, context, the loop.",
        hook: "Peek inside Anayo's control room.",
        ability: { id: "control", label: "CONTROL", icon: "🎛️" },
        live: false,
      },
    ],
  },
  {
    id: "w5",
    slug: "ai-that-codes",
    title: "AI That Codes",
    tagline: "Meet Claude Code",
    emoji: "💻",
    color: "#ffb84d",
    order: 5,
    lessons: [
      {
        id: "l5-1",
        slug: "coding-with-ai",
        title: "Coding with AI",
        concept: "Claude Code is an agent + harness + tools that edits and runs real code.",
        hook: "Watch an AI plan, write and fix Python.",
        ability: { id: "code", label: "CODE", icon: "💻" },
        live: false,
      },
      {
        id: "l5-2",
        slug: "build-something-real",
        title: "Build Something Real",
        concept: "Put it all together — you and Anayo ship a tiny project.",
        hook: "Your graduation: build a real thing.",
        ability: { id: "graduate", label: "GRAD", icon: "🎓" },
        live: false,
      },
    ],
  },
];

export function getWorld(slug: string): World | undefined {
  return WORLDS.find((w) => w.slug === slug);
}

export function getLesson(worldSlug: string, lessonSlug: string) {
  const world = getWorld(worldSlug);
  const lesson = world?.lessons.find((l) => l.slug === lessonSlug);
  return world && lesson ? { world, lesson } : undefined;
}

export function allLessons() {
  return WORLDS.flatMap((w) => w.lessons.map((l) => ({ world: w, lesson: l })));
}
