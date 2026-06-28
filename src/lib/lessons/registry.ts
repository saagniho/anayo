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
        aha: {
          explorer:
            "You never wrote a number — but Anayo turned every word into one all by itself! Same word always gets the same number, and that's exactly how AI 'reads': it's not reading English, it's doing math with numbers. 🔢",
          curious:
            "What you just did is tokenisation and vocabulary building. Each unique token maps to an integer ID, which gets looked up in a learned embedding matrix to produce a dense vector. The model never sees raw text — it sees sequences of integers from a fixed vocabulary. That's the input layer of every language model.",
        },
        live: true,
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
        aha: {
          explorer:
            "You just thought like me! I pick one word at a time, always asking 'what word fits best here?' I do this thousands of times to write a story, answer a question, or even write code. There's no plan — just one word, then another. 🔮",
          curious:
            "That's autoregressive generation. At each step the model computes P(next token | all previous tokens) over a vocabulary of ~50k tokens and samples from it. The full sequence emerges token by token — no global plan, only next-token prediction iterated to completion.",
        },
        live: true,
      },
      {
        id: "l2-2",
        slug: "the-big-brain",
        title: "The Big Brain",
        concept: "An LLM is 'large' because it learned from oceans of text.",
        hook: "What makes a language model so big?",
        ability: { id: "imagine", label: "IMAGINE", icon: "✨" },
        aha: {
          explorer:
            "I didn't start out smart — I just read more than any human ever could! Books, websites, code, conversations, Wikipedia — all of it went into my brain. That's what makes me 'large.' Not size. Reading. ✨",
          curious:
            "Training corpus scale is the primary differentiator between LLMs. GPT-3 trained on ~300B tokens; GPT-4 on an estimated 1T+. Scale drives emergent capabilities — behaviours that appear suddenly past certain data and parameter thresholds, not by design but by sheer statistical breadth.",
        },
        live: true,
      },
      {
        id: "l2-3",
        slug: "paying-attention",
        title: "Paying Attention",
        concept: "Transformers weigh which words matter to each other (attention).",
        hook: "Which words is the AI really looking at?",
        ability: { id: "focus", label: "FOCUS", icon: "🎯" },
        aha: {
          explorer:
            "Did you see how 'it' lit up 'car' and not 'robot'? I figured that out just by paying attention to the whole sentence at once — no dictionary, no grammar book. That's what makes transformers so powerful. 🎯",
          curious:
            "Attention is the breakthrough at the heart of every modern LLM. By computing pairwise relevance scores across all token positions simultaneously, the transformer resolves coreference, long-range dependencies, and syntactic roles in a single differentiable operation — something RNNs couldn't do efficiently.",
        },
        live: true,
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
        aha: {
          explorer:
            "Did you see how each ingredient made the answer better? You didn't change Anayo at all — you just told it more. That's the superpower of a good prompt: same AI, completely different results. 💬",
          curious:
            "Prompt engineering is constraint specification: every token you add narrows the conditional distribution P(output | prompt). Task, recipient, style, and context are the four axes that move an LLM from high-entropy generic output to precise, high-value generation.",
        },
        live: true,
      },
      {
        id: "l3-2",
        slug: "show-dont-tell",
        title: "Show, Don't Just Tell",
        concept: "Examples and context (few-shot) make answers much better.",
        hook: "Teach by example and watch quality jump.",
        ability: { id: "context", label: "CONTEXT", icon: "🗂️" },
        aha: {
          explorer:
            "You didn't change me or retrain me — you just showed me examples! That's the secret move of expert AI users. A few good examples beat a long description every single time. 🗂️",
          curious:
            "Few-shot prompting is in-context learning: the model infers the task's pattern and output distribution from the demonstrations without any gradient updates. It's one of the most powerful and underused techniques in prompt engineering.",
        },
        live: true,
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
        aha: {
          explorer:
            "Did you see the difference? A plain chatbot can only talk. But Anayo-as-agent searched the web, thought it through, and actually WROTE a report. That's what an agent does — it takes real actions in the world. 🦾",
          curious:
            "An agent wraps an LLM in a loop: observe → think → act → observe. The model handles reasoning; tools handle side-effects (I/O, APIs, computation). The goal is the stopping condition. This architecture — sometimes called ReAct — is the backbone of every agentic framework: LangChain, CrewAI, and Claude Code itself.",
        },
        live: true,
      },
      {
        id: "l4-2",
        slug: "step-by-step",
        title: "Step by Step",
        concept: "Agentic workflows break a goal into steps, loops and checks.",
        hook: "How does AI tackle a big, messy job?",
        ability: { id: "plan", label: "PLAN", icon: "🧩" },
        aha: {
          explorer:
            "You just ran Anayo's brain like a to-do list! Big goals feel impossible until you break them into small steps. Each step checks the last one worked, and one by one they add up to something amazing. That's how every AI agent tackles a big job. 🧩",
          curious:
            "What you saw is the plan-then-execute loop at the core of agentic workflows. The agent first generates a plan (decomposition), then iterates over each subtask — checking outputs before proceeding. This grounded, sequential execution is why agents can handle multi-step work that single-shot prompting can't.",
        },
        live: true,
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
        aha: {
          explorer:
            "Anayo didn't just type code randomly — it made a plan first, then wrote each line carefully, then tested it! That's exactly how coding agents work. Plan → write → run → check. Same as you'd build a LEGO set: read the instructions first! 💻",
          curious:
            "Claude Code runs a tight loop: it reads the codebase, plans a diff, applies the edit, runs tests or the REPL, reads the output, and iterates. It's the same ReAct pattern — observe, reason, act — but grounded in compiler and runtime feedback rather than search results.",
        },
        live: true,
      },
      {
        id: "l5-2",
        slug: "build-something-real",
        title: "Build Something Real",
        concept: "Put it all together — you and Anayo ship a tiny project.",
        hook: "Your graduation: build a real thing.",
        ability: { id: "graduate", label: "GRAD", icon: "🎓" },
        aha: {
          explorer:
            "You just designed a real AI app! And you understood every piece of it — the brain that sees patterns, the words it reads, the attention it pays, the prompts it needs, and the tools that let it act. You didn't just learn about AI. You understand it. 🎓",
          curious:
            "Every production AI product is this: a model (reasoning), tools (I/O and APIs), a harness (orchestration loop), a system prompt (context and constraints), and a feedback signal. You've now seen all five layers. That's the complete stack.",
        },
        live: true,
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
