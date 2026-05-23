"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import InsideAiMathSlideLabs from "./InsideAiMathSlideLabs";
import {
  ArrowRight,
  Check,
  Download,
  Eye,
  FileText,
  Heart,
  Play,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";

type Signal = "green" | "yellow" | "red" | null;

const NAV_PT1 = [
  { href: "#pt1-deck", label: "Slides" },
  { href: "#pt1-handout", label: "Handout" },
];

const NAV_PT2 = [
  { href: "#pt2-deck", label: "Slides" },
  { href: "#pt2-labs", label: "Labs" },
  { href: "#pt2-handout", label: "Handout" },
];

const PT1_GAMMA_EMBED = "https://gamma.app/embed/bdlnsqv1f45r7to";
const PT1_GAMMA_DOCS = "https://gamma.app/docs/AI-the-Brain-and-Serviam-bdlnsqv1f45r7to";
const PT2_GAMMA_EMBED = "https://gamma.app/embed/vm7pqgz6iuexocx";
const PT2_GAMMA_DOCS =
  "https://gamma.app/docs/Inside-AI-The-Math-Science-and-Code-Behind-Intelligent-Tools-vm7pqgz6iuexocx";
const pt2DeckReady = !PT2_GAMMA_EMBED.includes("REPLACE");

const HOOK_CHOICES = [
  { word: "robot", pct: 38 },
  { word: "app", pct: 24 },
  { word: "prototype", pct: 18 },
  { word: "model", pct: 12 },
  { word: "circuit", pct: 5 },
  { word: "idea", pct: 3 },
];

const CLAIMS = [
  "AI works like a human brain.",
  "It understands words and remembers facts.",
  "It always chooses the best answer.",
];

const AUDIT_ANSWERS: Signal[] = ["yellow", "yellow", "red"];

const SCENARIOS: { text: string; answer: Signal }[] = [
  { text: "AI quizzes me before a test.", answer: "green" },
  { text: "AI helps debug code I already understand.", answer: "green" },
  { text: "AI outlines ideas for a project I still have to develop.", answer: "yellow" },
  { text: "AI summarizes an article when my teacher says it is okay.", answer: "yellow" },
  { text: "AI writes my essay and I turn it in as my own.", answer: "red" },
  { text: "AI gives private medical advice about someone I know.", answer: "red" },
];

const SERVIAM = [
  { letter: "S", word: "Start", detail: "with your own thinking." },
  { letter: "E", word: "Examine", detail: "the purpose. Am I learning or avoiding effort?" },
  { letter: "R", word: "Require", detail: "reasoning and evidence from the tool." },
  { letter: "V", word: "Verify", detail: "before using or sharing anything." },
  { letter: "I", word: "Identify", detail: "risks like privacy, bias, and accuracy." },
  { letter: "A", word: "Attribute", detail: "AI assistance honestly." },
  { letter: "M", word: "Make", detail: "your work serve learning and others." },
];

const PT1_HANDOUT = {
  title: "Serviam Use Card",
  sub: "Your one-page guide for using AI with integrity.",
  href: "/artifacts/ursuline_serviam_ai_student_handout.docx",
};

const PT2_HANDOUT = {
  title: "Inside AI Lab Notes",
  sub: "Vectors, weights, and training worksheet for class.",
  href: "/artifacts/ursuline_part2_student_handout.docx",
};

const TEACHER_PLANS = [
  {
    part: "Pt 1",
    title: "AI, the Brain, and Serviam",
    description: "Timing, objectives, and facilitation notes for Part 1.",
    href: "/artifacts/team/ursuline_pt1_teacher_lesson_plan.docx",
  },
  {
    part: "Pt 2",
    title: "Inside AI",
    description: "Timing, objectives, math and CS activities, and extension notes for Part 2.",
    href: "/artifacts/team/ursuline_part2_teacher_lesson_plan.docx",
  },
];

const PATHWAY_STEPS = [
  "Prompt",
  "Tokens",
  "Numbers",
  "Attention",
  "Probability",
  "Response",
  "Human review",
];

function markBg(m: Signal) {
  if (m === "green") return "bg-emerald-600 text-white border-emerald-700";
  if (m === "yellow") return "bg-amber-400 text-stone-900 border-amber-500";
  if (m === "red") return "bg-rose-500 text-white border-rose-600";
  return "bg-white text-stone-400 border-stone-200 hover:border-stone-400";
}

function markLabel(m: Signal) {
  if (m === "green") return "Accurate";
  if (m === "yellow") return "Vague";
  if (m === "red") return "Misleading";
  return "Tap to mark";
}

function dotBg(m: Signal) {
  if (m === "green") return "bg-emerald-500";
  if (m === "yellow") return "bg-amber-400";
  if (m === "red") return "bg-rose-500";
  return "bg-stone-200";
}

function fakeIdFor(w: string) {
  let h = 0;
  for (let i = 0; i < w.length; i++) h = (h * 31 + w.charCodeAt(i)) % 9973;
  return h;
}

function HeroJumpCard({
  href,
  title,
  titleClass,
  grades,
  format,
  description,
  buttonLabel,
  buttonClass,
}: {
  href: string;
  title: string;
  titleClass: string;
  grades: string;
  format?: string;
  description: string;
  buttonLabel: string;
  buttonClass: string;
}) {
  return (
    <a
      href={href}
      className="group flex min-h-[168px] flex-col rounded-2xl border border-stone-200 bg-white/80 p-5 backdrop-blur-sm transition hover:border-stone-300 hover:bg-white hover:shadow-sm"
    >
      <p className={`font-serif text-lg leading-snug text-stone-900 ${titleClass}`}>{title}</p>
      <p className="mt-1.5 text-xs font-medium text-stone-600">{grades}</p>
      {format ? (
        <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-stone-500">{format}</p>
      ) : null}
      <p className="mt-2 text-sm leading-relaxed text-stone-700">{description}</p>
      <span
        className={`mt-auto inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors sm:w-fit ${buttonClass}`}
      >
        {buttonLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </a>
  );
}

function LessonSection({
  id,
  kicker,
  title,
  intro,
  children,
  className = "bg-white",
}: {
  id: string;
  kicker: string;
  title: string;
  intro: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 border-t border-stone-200 sm:scroll-mt-28 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 md:py-24">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <div className="mb-4 text-xs uppercase tracking-widest text-amber-700">{kicker}</div>
            <h2 className="mb-4 font-serif text-3xl leading-tight text-stone-900 sm:text-4xl">{title}</h2>
            <p className="leading-relaxed text-stone-600">{intro}</p>
          </div>
          <div className="md:col-span-8">{children}</div>
        </div>
      </div>
    </section>
  );
}

function InteractiveCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:rounded-3xl sm:p-8 md:p-10 ${className}`}>
      {children}
    </div>
  );
}

function StudentHandoutCard({
  title,
  sub,
  href,
}: {
  title: string;
  sub: string;
  href: string;
}) {
  return (
    <a
      href={href}
      download
      className="group block rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-emerald-200 hover:bg-emerald-50/30 sm:p-8"
    >
      <FileText className="mb-4 h-5 w-5 text-emerald-800" strokeWidth={1.5} />
      <div className="mb-1 font-serif text-xl">{title}</div>
      <div className="mb-4 text-sm text-stone-500">{sub}</div>
      <div className="inline-flex items-center gap-2 text-xs text-stone-700 transition group-hover:text-emerald-800">
        <Download className="h-3 w-3" />
        Download
      </div>
    </a>
  );
}

function PartBanner({
  part,
  title,
  subtitle,
  variant = "light",
}: {
  part: 1 | 2;
  title: string;
  subtitle: string;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  return (
    <div
      className={`border-b border-stone-200 ${dark ? "bg-stone-900 text-stone-50" : "bg-white text-stone-900"}`}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 sm:px-6 sm:py-10 md:flex-row md:items-end md:justify-between md:py-12">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "text-amber-300" : "text-emerald-800"}`}>
            Pt {part}
          </p>
          <h2 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl md:text-4xl">{title}</h2>
        </div>
        <p className={`max-w-md text-pretty text-xs leading-relaxed sm:text-sm ${dark ? "text-stone-400" : "text-stone-600"}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function UrsulineAILesson() {
  const [revealedHook, setRevealedHook] = useState(false);
  const [pickedHook, setPickedHook] = useState<string | null>(null);
  const [focusWord, setFocusWord] = useState<string | null>(null);

  const [prompt, setPrompt] = useState(
    "We entered the I.D.E.A. Hub to design a robot for our serviam project.",
  );
  const [pathStep, setPathStep] = useState(0);
  const [running, setRunning] = useState(false);

  const [auditMarks, setAuditMarks] = useState<Signal[]>([null, null, null]);
  const [decisions, setDecisions] = useState<Signal[]>(Array(SCENARIOS.length).fill(null));
  const [reflection, setReflection] = useState({ power: "", limit: "", promise: "" });

  useEffect(() => {
    if (!running) return;
    if (pathStep >= 7) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setPathStep((s) => s + 1), 850);
    return () => clearTimeout(t);
  }, [running, pathStep]);

  const runPathway = () => {
    setPathStep(0);
    setRunning(true);
    setTimeout(() => setPathStep(1), 100);
  };

  const resetPathway = () => {
    setRunning(false);
    setPathStep(0);
  };

  const tokens = prompt
    .replace(/([.,!?])/g, " $1")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 12);

  const attentionWeights = tokens.map((t, i) => {
    const isContent = t.length > 3 && !/^(the|and|a|to|of|in|is|it|on|using|a)$/i.test(t);
    return Math.min(95, 30 + t.length * 4 + (isContent ? 25 : 0) + (i % 3) * 4);
  });

  const probabilityNext = [
    { word: "robot", pct: 44 },
    { word: "app", pct: 22 },
    { word: "prototype", pct: 18 },
    { word: "circuit", pct: 10 },
    { word: "essay", pct: 6 },
  ];

  const cycleMark = (i: number) => {
    const order: Signal[] = [null, "green", "yellow", "red"];
    setAuditMarks((m) =>
      m.map((v, idx) => (idx === i ? order[(order.indexOf(v) + 1) % 4] : v)),
    );
  };

  const auditScore = auditMarks.filter((m, i) => m === AUDIT_ANSWERS[i]).length;
  const auditComplete = auditMarks.every((m) => m !== null);

  const setDecision = (i: number, val: Signal) => {
    setDecisions((d) => d.map((v, idx) => (idx === i ? val : v)));
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <nav className="sticky top-0 z-50 border-b border-stone-200/70 bg-stone-50/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
          <div className="flex shrink-0 items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-700" aria-hidden />
            <span className="font-serif text-sm tracking-tight">AI · Brain · Serviam</span>
          </div>
          <div className="hidden items-center gap-0.5 lg:flex">
            <a
              href="#pt1"
              className="mr-1 rounded-full bg-emerald-800 px-2.5 py-1.5 text-[11px] font-medium text-white xl:px-3 xl:text-xs"
            >
              Pt 1
            </a>
            {NAV_PT1.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-2.5 py-1.5 text-[11px] text-stone-600 transition hover:bg-white hover:text-emerald-800 xl:px-3 xl:text-xs"
              >
                {link.label}
              </a>
            ))}
            <span className="mx-2 h-4 w-px bg-stone-300" aria-hidden />
            <a
              href="#pt2"
              className="mr-1 rounded-full bg-stone-900 px-2.5 py-1.5 text-[11px] font-medium text-white xl:px-3 xl:text-xs"
            >
              Pt 2
            </a>
            {NAV_PT2.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-2 py-1.5 text-[11px] text-stone-600 transition hover:bg-white hover:text-emerald-800 xl:px-2.5 xl:text-xs"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="-mr-4 flex max-w-[min(100%,20rem)] items-center gap-1.5 overflow-x-auto pb-0.5 sm:max-w-none lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <a href="#pt1" className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-emerald-800 px-3 text-[11px] font-medium text-white">
              Pt 1
            </a>
            <a href="#pt2" className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-stone-900 px-3 text-[11px] font-medium text-white">
              Pt 2
            </a>
            {[...NAV_PT1, ...NAV_PT2].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-stone-200 bg-white px-3 text-[11px] text-stone-600"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute right-1/4 top-40 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-20 md:pt-24">
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/60 px-3 py-1 text-xs text-stone-600">
            <Sparkles className="h-3 w-3 text-amber-600" aria-hidden />
            <span>Ursuline Academy · I.D.E.A. Hub</span>
          </div>
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <h1 className="mb-6 font-serif text-3xl leading-[0.95] tracking-tight text-stone-900 sm:text-5xl md:text-7xl lg:text-8xl">
                AI, the Brain,
                <br />
                <span className="italic text-emerald-800">and Serviam.</span>
              </h1>
              <div className="mb-10 grid gap-4 sm:grid-cols-2">
                <HeroJumpCard
                  href="#pt1"
                  title="Start Here: AI Literacy"
                  titleClass="text-emerald-800"
                  grades="Grades 7–12"
                  format="20-minute core lesson"
                  description="How AI works, why judgment matters, and how to use it with integrity."
                  buttonLabel="Start here"
                  buttonClass="bg-emerald-800 text-white group-hover:bg-emerald-900"
                />
                <HeroJumpCard
                  href="#pt2"
                  title="Go Deeper: Inside AI"
                  titleClass="text-stone-800"
                  grades="Upper School / AP STEM extension"
                  description="A math, science, and code lab for vectors, similarity, weights, and training."
                  buttonLabel="Go deeper"
                  buttonClass="bg-stone-900 text-white group-hover:bg-stone-800"
                />
              </div>
            </div>
            <Image
              src="/ursuline-ai-assets/01-ai-brain-circuit.png"
              alt=""
              width={140}
              height={140}
              className="mx-auto opacity-90 lg:mx-0"
              priority
              aria-hidden
            />
          </div>
          <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stone-200 bg-stone-200 md:grid-cols-4">
            {[
              { icon: Search, label: "Question" },
              { icon: Check, label: "Verify" },
              { icon: FileText, label: "Attribute" },
              { icon: Heart, label: "Serve" },
            ].map((h) => (
              <div key={h.label} className="flex flex-col items-start gap-2 bg-stone-50 px-4 py-6 sm:gap-3 sm:px-6 sm:py-8">
                <h.icon className="h-5 w-5 text-emerald-800" strokeWidth={1.5} aria-hidden />
                <span className="font-serif text-base sm:text-lg">{h.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="pt1" className="scroll-mt-28">
        <PartBanner
          part={1}
          title="AI Literacy"
          subtitle="AI, the Brain, and Serviam · grades 7–12"
        />
      {/* Essential question */}
      <section className="border-t border-stone-200">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 md:py-24">
          <div className="mb-6 text-xs uppercase tracking-widest text-stone-500">Essential question</div>
          <p className="mb-10 font-serif text-2xl leading-tight tracking-tight text-stone-900 sm:text-3xl md:text-5xl">
            How can we understand AI well enough to use it
            <span className="italic text-emerald-800"> wisely</span>,
            <span className="italic text-emerald-800"> truthfully</span>, and in
            <span className="italic text-emerald-800"> service of others</span>?
          </p>
          <p className="mb-4 text-sm text-stone-500">Choose one word that matters most to you.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["wisely", "truthfully", "service", "integrity", "curiosity"].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setFocusWord(w)}
                className={`rounded-full border px-4 py-2 text-sm capitalize transition ${
                  focusWord === w
                    ? "border-emerald-800 bg-emerald-800 text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:border-stone-900"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why this matters */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <div className="mb-4 text-xs uppercase tracking-widest text-amber-700">Why this matters now</div>
          <h2 className="mb-3 max-w-2xl font-serif text-3xl text-stone-900 md:text-4xl">
            AI is already shaping daily life.
          </h2>
          <p className="mb-8 max-w-xl text-stone-600">
            AI is powerful because it can generate. Human judgment determines whether that output is
            accurate, ethical, and useful.
          </p>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stone-200 bg-stone-200 md:grid-cols-4">
            {["School", "Search", "Social", "Maps", "Writing", "Coding", "Photos", "Music"].map((w) => (
              <div
                key={w}
                className="relative z-0 bg-white px-4 py-5 text-center font-serif text-base text-stone-800 transition-all duration-200 ease-out active:scale-[0.98] active:bg-emerald-100 active:text-emerald-900 md:text-lg md:hover:z-10 md:hover:scale-[1.02] md:hover:bg-emerald-50 md:hover:text-emerald-800 md:hover:shadow-[0_4px_12px_rgba(6,78,59,0.08),inset_0_0_0_1px_rgba(16,185,129,0.25)]"
              >
                {w}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pt1-deck" className="scroll-mt-28 border-t border-stone-200 bg-stone-50">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <p className="mb-4 text-xs uppercase tracking-widest text-amber-700">Pt 1 · Slides</p>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-serif text-2xl text-stone-900 md:text-3xl">AI, the Brain, and Serviam</h3>
            <a
              href={PT1_GAMMA_DOCS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800 transition hover:border-emerald-700 hover:bg-emerald-50"
            >
              Open full slides
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="aspect-video w-full">
              <iframe
                src={PT1_GAMMA_EMBED}
                title="AI, the Brain, and Serviam, Pt 1 slides"
                className="h-full w-full"
                allow="fullscreen"
                loading="lazy"
              />
            </div>
          </div>
          <p className="mt-4 text-sm text-stone-500">
            Slides not showing? Use <span className="font-medium text-emerald-800">Open full slides</span> above.
          </p>
        </div>
      </section>

      {/* Predict */}
      <LessonSection
        id="predict"
        kicker="01 · Warm-up · Think aloud"
        title="Before AI predicts, your brain predicts."
        intro="Pick the word you think comes next. Then see how likely each option is."
      >
        <InteractiveCard>
          <p className="mb-8 font-serif text-2xl leading-relaxed text-stone-900 md:text-3xl">
            The students walked into the I.D.E.A. Hub to build a{" "}
            <span className="mx-2 inline-block align-middle">
              <span
                className={`inline-block min-w-[140px] border-b-2 border-dashed px-4 py-1 text-center italic ${
                  pickedHook ? "border-emerald-700 text-emerald-800" : "border-stone-400 text-stone-400"
                }`}
              >
                {pickedHook || "________"}
              </span>
            </span>
            .
          </p>
          <div className="mb-4 text-xs uppercase tracking-widest text-stone-500">What word came to mind?</div>
          <div className="mb-8 flex flex-wrap gap-2">
            {HOOK_CHOICES.map((c) => (
              <button
                key={c.word}
                type="button"
                onClick={() => {
                  setPickedHook(c.word);
                  setRevealedHook(true);
                }}
                className={`rounded-full border px-4 py-2 text-sm transition-all ${
                  pickedHook === c.word
                    ? "border-emerald-800 bg-emerald-800 text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:border-stone-900"
                }`}
              >
                {c.word}
              </button>
            ))}
          </div>
          {revealedHook && (
            <div className="space-y-3">
              <div className="mb-3 text-xs uppercase tracking-widest text-stone-500">How likely is each word?</div>
              {HOOK_CHOICES.map((c) => (
                <div key={c.word} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-stone-700">{c.word}</div>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        pickedHook === c.word ? "bg-emerald-700" : "bg-stone-400"
                      }`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                  <div className="w-10 text-right text-xs tabular-nums text-stone-500">{c.pct}%</div>
                </div>
              ))}
              <p className="pt-2 text-sm text-stone-500">What clues did your brain use?</p>
            </div>
          )}
        </InteractiveCard>
      </LessonSection>

      {/* Define */}
      <LessonSection
        id="define"
        kicker="02 · Mini-lesson · Core concept"
        title="What is AI?"
        intro="AI uses data and math to find patterns, make predictions, generate content, and support human decisions. It can be powerful, but it does not replace human judgment. Think of it as a fast pattern detective, not a person with wisdom, feelings, or conscience."
        className="bg-stone-50"
      >
        <InteractiveCard>
          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Recognize", detail: "Patterns in data" },
              { label: "Predict", detail: "Likely outputs" },
              { label: "Generate", detail: "New content and ideas" },
              { label: "Support", detail: "Human decision-making" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-stone-200 bg-white p-5">
                <div className="font-serif text-xl text-stone-900">{item.label}</div>
                <p className="mt-1 text-sm text-stone-600">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="mb-4 text-xs uppercase tracking-widest text-stone-500">AI is bigger than chatbots</p>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stone-200 bg-stone-200 md:grid-cols-3">
            {["Classify", "Recommend", "Generate", "Search", "Code", "Act"].map((w) => (
              <div key={w} className="bg-white px-4 py-5 text-center font-serif text-lg">
                {w}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-stone-500">
            You interact with AI dozens of times a day, often without knowing it.
          </p>
        </InteractiveCard>
      </LessonSection>

      {/* Human vs machine */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-8">
              <p className="mb-4 text-xs uppercase tracking-widest text-amber-700">Human learner</p>
              <ul className="space-y-3 font-serif text-lg text-stone-800">
                <li>Memory: carries the past</li>
                <li>Emotion: feels the stakes</li>
                <li>Purpose: acts with intention</li>
                <li>Moral judgment: weighs right and wrong</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-8">
              <p className="mb-4 text-xs uppercase tracking-widest text-amber-700">AI model</p>
              <ul className="space-y-3 font-serif text-lg text-stone-800">
                <li>Tokens: processes word pieces</li>
                <li>Probability: estimates likely outputs</li>
                <li>Pattern: matches training data</li>
                <li>No judgment: no stakes, no conscience</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 text-center font-serif text-xl text-stone-700 md:text-2xl">
            The model can produce language. The learner must still question, verify, explain, and decide.
          </p>
        </div>
      </section>

      {/* Pathway */}
      <LessonSection
        id="pathway"
        kicker="03 · How it works · Overview"
        title="From prompt to response."
        intro="Every step is math. The last step is yours. Type a prompt and trace the pathway."
      >
        <InteractiveCard>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs uppercase tracking-widest text-stone-500">Your prompt</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={runPathway}
                disabled={running || !prompt.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-4 py-2 text-sm text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                {running ? "Running…" : pathStep >= 7 ? "Run again" : "Run pathway"}
              </button>
              <button
                type="button"
                onClick={resetPathway}
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-3 py-2 text-sm text-stone-600 transition hover:border-stone-900"
                aria-label="Reset pathway"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mb-8 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-900 placeholder-stone-400 focus:border-emerald-700 focus:outline-none"
            placeholder="Type any prompt…"
          />

          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
            {PATHWAY_STEPS.map((s, i) => (
              <div key={s} className="flex shrink-0 items-center gap-2">
                <div
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-all ${
                    pathStep > i
                      ? "bg-emerald-100 text-emerald-800"
                      : pathStep === i + 1
                        ? "bg-amber-100 text-amber-900"
                        : "bg-stone-200 text-stone-500"
                  }`}
                >
                  <span className="font-mono">{i + 1}</span>
                  <span>{s}</span>
                </div>
                {i < PATHWAY_STEPS.length - 1 && (
                  <ArrowRight className="h-3 w-3 shrink-0 text-stone-400" aria-hidden />
                )}
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className={`rounded-2xl border border-stone-200 bg-white p-5 transition ${pathStep >= 2 ? "opacity-100" : "opacity-40"}`}>
              <div className="mb-3 text-xs uppercase tracking-widest text-stone-500">Tokens · puzzle pieces</div>
              <div className="flex flex-wrap gap-2">
                {tokens.length > 0 ? (
                  tokens.map((t, i) => (
                    <span key={`${t}-${i}`} className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-sm text-emerald-900">
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-stone-500">Enter a prompt above.</span>
                )}
              </div>
              <p className="mt-3 text-xs text-stone-500">
                AI processes tokens as numbers and patterns. It can represent relationships, but it does not
                understand meaning the way a person does.
              </p>
            </div>

            <div className={`rounded-2xl border border-stone-200 bg-white p-5 transition ${pathStep >= 3 ? "opacity-100" : "opacity-40"}`}>
              <div className="mb-3 text-xs uppercase tracking-widest text-stone-500">Numbers · vectors</div>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {tokens.slice(0, 6).map((t, i) => (
                  <span key={`${t}-${i}`} className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-amber-900">
                    {t.slice(0, 8)} · {fakeIdFor(t)}
                  </span>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border border-stone-200 bg-white p-5 transition ${pathStep >= 4 ? "opacity-100" : "opacity-40"}`}>
              <div className="mb-3 text-xs uppercase tracking-widest text-stone-500">Attention · highlighter</div>
              <div className="space-y-2">
                {tokens.slice(0, 5).map((t, i) => (
                  <div key={`${t}-att-${i}`} className="flex items-center gap-3">
                    <div className="w-20 truncate text-sm text-stone-700">{t}</div>
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-stone-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-1000"
                        style={{ width: pathStep >= 4 ? `${attentionWeights[i]}%` : "0%" }}
                      />
                    </div>
                    <div className="w-10 text-right text-xs tabular-nums text-stone-500">
                      {pathStep >= 4 ? attentionWeights[i] : 0}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border border-stone-200 bg-white p-5 transition ${pathStep >= 5 ? "opacity-100" : "opacity-40"}`}>
              <p className="mb-3 font-serif text-base text-stone-800">
                The students entered the I.D.E.A. Hub to design a _____.
              </p>
              <div className="mb-2 text-xs uppercase tracking-widest text-stone-500">Probability · next token</div>
              <div className="space-y-2">
                {probabilityNext.map((p, i) => (
                  <div key={p.word} className="flex items-center gap-3">
                    <div className="w-16 text-sm text-stone-700">{p.word}</div>
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-stone-200">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? "bg-emerald-600" : "bg-stone-400"}`}
                        style={{ width: pathStep >= 5 ? `${p.pct}%` : "0%" }}
                      />
                    </div>
                    <div className="w-10 text-right text-xs tabular-nums text-stone-500">
                      {pathStep >= 5 ? p.pct : 0}%
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-stone-500">Most likely, but not guaranteed to be true. Example only, not real model output.</p>
            </div>
          </div>

          <div className={`mt-4 grid gap-4 md:grid-cols-2 ${pathStep >= 6 ? "opacity-100" : "opacity-40"}`}>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="mb-2 text-xs uppercase tracking-widest text-stone-500">Response</div>
              <p className="text-sm leading-relaxed text-stone-700">
                Text is built token by token from probability. It can sound fluent without being correct.
              </p>
            </div>
            <div className={`rounded-2xl border p-5 ${pathStep >= 7 ? "border-emerald-300 bg-emerald-50" : "border-stone-200 bg-white"}`}>
              <div className="flex items-start gap-3">
                <Eye className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                <div>
                  <div className="mb-1 text-xs uppercase tracking-widest text-emerald-800">Human review</div>
                  <p className="text-sm leading-relaxed text-stone-700">
                    Check the claim, the source, and the reasoning. If the answer changes, that is a warning sign. If it stays the same, you still need evidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </InteractiveCard>
      </LessonSection>

      {/* Audit */}
      <LessonSection
        id="audit"
        kicker="04 · Audit an AI answer"
        title="Fluency does not always mean truth."
        intro="A confident answer still needs evidence. Tap each claim to mark it as accurate, vague, or misleading."
        className="bg-stone-50"
      >
        <InteractiveCard>
          <div className="mb-6 text-xs uppercase tracking-widest text-stone-400">Practice AI answer</div>
          <p className="mb-8 font-serif text-xl leading-relaxed text-stone-800 md:text-2xl">
            &ldquo;AI works like a human brain. It understands words, remembers facts, and always chooses
            the best answer.&rdquo;
          </p>
          <p className="mb-4 text-sm text-stone-600">
            <span className="mr-3 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 align-middle" /> Accurate
            <span className="mx-3 inline-block h-2.5 w-2.5 rounded-full bg-amber-400 align-middle" /> Vague
            <span className="mx-3 inline-block h-2.5 w-2.5 rounded-full bg-rose-500 align-middle" /> Misleading
          </p>
          <div className="space-y-3">
            {CLAIMS.map((c, i) => (
              <button
                key={c}
                type="button"
                onClick={() => cycleMark(i)}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all ${markBg(auditMarks[i])}`}
              >
                <div className={`h-3 w-3 shrink-0 rounded-full ${auditMarks[i] ? "bg-white/80" : "bg-stone-300"}`} />
                <div className="flex-1 text-base">{c}</div>
                <div className="text-xs uppercase tracking-widest opacity-80">{markLabel(auditMarks[i])}</div>
              </button>
            ))}
          </div>
          {auditComplete && (
            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              <div>
                <div className="mb-1 font-serif text-lg text-emerald-900">
                  You marked {auditScore} of 3 correctly.
                </div>
                <p className="text-sm leading-relaxed text-emerald-800/90">
                  The brain analogy and wording like &ldquo;understands&rdquo; and &ldquo;remembers&rdquo; oversimplify
                  how AI works. &ldquo;Always chooses the best answer&rdquo; is misleading. Models estimate
                  probability, not truth.
                </p>
              </div>
            </div>
          )}
        </InteractiveCard>
      </LessonSection>

      {/* Serviam / Decide */}
      <section id="serviam" className="scroll-mt-28 border-t border-stone-200 bg-emerald-900 text-stone-50">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="mb-4 text-xs uppercase tracking-widest text-amber-300">05 · SERVIAM protocol</div>
              <h2 className="mb-4 font-serif text-4xl leading-tight">The SERVIAM AI protocol.</h2>
              <p className="mb-4 text-emerald-100/80 leading-relaxed">
                Serviam is not just a motto for service projects. It is also a way to make choices when powerful tools are in our hands.
              </p>
              <p className="text-emerald-100/80">
                Seven steps for every AI interaction. Serviam means &ldquo;I will serve.&rdquo;
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-px overflow-hidden rounded-2xl border border-emerald-700/40 bg-emerald-800/40">
                {SERVIAM.map((s) => (
                  <div
                    key={s.letter}
                    className="grid grid-cols-12 items-baseline gap-3 bg-emerald-900 px-5 py-5 transition hover:bg-emerald-800/40 md:gap-4 md:px-6 md:py-6"
                  >
                    <div className="col-span-2 font-serif text-4xl leading-none text-amber-300 md:col-span-1 md:text-5xl">
                      {s.letter}
                    </div>
                    <div className="col-span-3 font-serif text-lg text-stone-50 md:col-span-2 md:text-xl">
                      {s.word}
                    </div>
                    <div className="col-span-7 text-sm leading-relaxed text-emerald-100/85 md:col-span-9">
                      {s.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practice */}
      <LessonSection
        id="practice"
        kicker="06 · Green, yellow, red"
        title="Red, yellow, green AI choices."
        intro="The color is about how you use the tool, not the tool itself. Mark each scenario."
      >
        <InteractiveCard className="space-y-3 !p-6 md:!p-8">
          <div className="mb-2 grid grid-cols-3 gap-2 text-center text-xs uppercase tracking-widest text-stone-500">
            <span>Green · supports learning</span>
            <span>Yellow · needs boundaries</span>
            <span>Red · undermines integrity</span>
          </div>
          {SCENARIOS.map((sc, i) => (
            <div
              key={sc.text}
              className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 md:flex-row md:items-center"
            >
              <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotBg(decisions[i])}`} />
              <div className="flex-1 text-stone-800">{sc.text}</div>
              <div className="flex shrink-0 gap-2">
                {(["green", "yellow", "red"] as const).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setDecision(i, color)}
                    aria-label={`Mark as ${color}`}
                    className={`h-11 min-h-[44px] w-11 min-w-[44px] rounded-full border-2 transition-all ${
                      decisions[i] === color
                        ? color === "green"
                          ? "scale-110 border-emerald-600 bg-emerald-500"
                          : color === "yellow"
                            ? "scale-110 border-amber-500 bg-amber-400"
                            : "scale-110 border-rose-600 bg-rose-500"
                        : color === "green"
                          ? "border-emerald-300 hover:bg-emerald-50"
                          : color === "yellow"
                            ? "border-amber-300 hover:bg-amber-50"
                            : "border-rose-300 hover:bg-rose-50"
                    }`}
                  />
                ))}
              </div>
              {decisions[i] && decisions[i] === sc.answer && (
                <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
              )}
            </div>
          ))}
        </InteractiveCard>
      </LessonSection>

      {/* Reflect */}
      <LessonSection
        id="reflect"
        kicker="07 · Reflection"
        title="One power. One limit. One promise."
        intro="Keep this. Revisit it in six months."
        className="bg-stone-50"
      >
        <InteractiveCard>
          <div className="space-y-8">
            {(
              [
                {
                  key: "power" as const,
                  label: "Power: AI can…",
                  hint: "What is one specific capability you saw today?",
                },
                {
                  key: "limit" as const,
                  label: "Limit: AI cannot promise…",
                  hint: "What is one real limitation to remember?",
                },
                {
                  key: "promise" as const,
                  label: "Promise: I will…",
                  hint: "What is one commitment for using AI with integrity?",
                },
              ] as const
            ).map((f) => (
              <div key={f.key}>
                <label htmlFor={`reflection-${f.key}`} className="mb-1 block text-xs uppercase tracking-widest text-stone-500">
                  {f.label}
                </label>
                <p className="mb-2 text-sm text-stone-500">{f.hint}</p>
                <input
                  id={`reflection-${f.key}`}
                  value={reflection[f.key]}
                  onChange={(e) => setReflection({ ...reflection, [f.key]: e.target.value })}
                  className="w-full border-b border-stone-300 bg-transparent py-3 font-serif text-xl text-stone-900 outline-none transition-colors focus:border-emerald-700 md:text-2xl"
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
        </InteractiveCard>
      </LessonSection>

      {/* Closing */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-24">
          <p className="font-serif text-2xl leading-tight tracking-tight text-stone-900 md:text-4xl">
            AI is not magic. It is math trained on patterns. Human wisdom decides whether, when, and how
            to use it.
          </p>
        </div>
      </section>

      {/* Pt 1 handout */}
      <section id="pt1-handout" className="scroll-mt-24 border-t border-stone-200 bg-white sm:scroll-mt-28">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16 md:py-20">
          <div className="mb-4 text-xs uppercase tracking-widest text-emerald-800">Pt 1 · Handout</div>
          <h2 className="mb-8 font-serif text-2xl text-stone-900 sm:mb-10 sm:text-3xl">Serviam Use Card</h2>
          <div className="max-w-xl">
            <StudentHandoutCard {...PT1_HANDOUT} />
          </div>
        </div>
      </section>
      </div>

      <section id="pt2" className="scroll-mt-28 border-t border-stone-300">
        <PartBanner
          part={2}
          title="Inside AI"
          subtitle="Extension · math, science, and code behind intelligent tools · Upper School · AP STEM"
          variant="dark"
        />

        <section className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-16 md:py-20">
            <p className="mb-4 text-xs uppercase tracking-widest text-stone-500">Pt 2 · Essential question</p>
            <p className="font-serif text-xl leading-tight text-stone-900 sm:text-2xl md:text-4xl">
              How does language become math, and math become a response?
            </p>
          </div>
        </section>

        <section id="pt2-deck" className="scroll-mt-24 border-t border-stone-200 bg-stone-50 sm:scroll-mt-28">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 md:py-16">
            <p className="mb-4 text-xs uppercase tracking-widest text-amber-700">Pt 2 · Slides</p>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <h3 className="font-serif text-2xl text-stone-900 md:text-3xl">Inside AI</h3>
              {pt2DeckReady && (
                <a
                  href={PT2_GAMMA_DOCS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-100"
                >
                  Open full slides
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              )}
            </div>
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              {pt2DeckReady ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={PT2_GAMMA_EMBED}
                    title="Inside AI, Pt 2 slides"
                    className="h-full w-full"
                    allow="fullscreen"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-stone-50 px-6 py-12 text-center">
                  <p className="font-serif text-xl text-stone-800">Your class slides will appear here.</p>
                  <p className="max-w-md text-sm leading-relaxed text-stone-600">
                    Start with the interactive labs below. They cover vectors, weights, and training. You will see
                    the same ideas in the slides.
                  </p>
                  <a
                    href="#pt2-labs"
                    className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
                  >
                    Go to labs
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              )}
            </div>
            {pt2DeckReady && (
              <p className="mt-4 text-sm text-stone-500">
                Slides not showing? Use <span className="font-medium text-stone-800">Open full slides</span> above.
              </p>
            )}
          </div>
        </section>

        <section id="pt2-labs" className="scroll-mt-24 border-t border-stone-200 bg-stone-50 sm:scroll-mt-28">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 md:py-16">
            <p className="mb-4 text-xs uppercase tracking-widest text-amber-700">Pt 2 · Interactive labs</p>
            <h3 className="mb-3 font-serif text-2xl text-stone-900 md:text-3xl">Try the math behind the model</h3>
            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-stone-600">
              These labs match the Inside AI lesson. Change the inputs and watch how similarity and training work.
            </p>
            <InsideAiMathSlideLabs />
          </div>
        </section>

        <section id="pt2-handout" className="scroll-mt-24 border-t border-stone-200 bg-white sm:scroll-mt-28">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16 md:py-20">
            <p className="mb-4 text-xs uppercase tracking-widest text-emerald-800">Pt 2 · Handout</p>
            <h2 className="mb-8 font-serif text-2xl text-stone-900 sm:mb-10 sm:text-3xl">Inside AI Lab Notes</h2>
            <div className="max-w-xl">
              <StudentHandoutCard {...PT2_HANDOUT} />
            </div>
          </div>
        </section>
      </section>

      <section id="faculty" className="scroll-mt-24 border-t border-stone-300 bg-stone-100 sm:scroll-mt-28">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16 md:py-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600">Faculty only</p>
          <h2 className="mb-2 font-serif text-2xl text-stone-900 sm:text-3xl">Teacher lesson plans</h2>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-stone-600">
            For teachers delivering this lesson. Not part of the student experience.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {TEACHER_PLANS.map((plan) => (
              <a
                key={plan.href}
                href={plan.href}
                download
                className="group flex flex-col rounded-2xl border border-stone-300 bg-white p-5 transition hover:border-stone-400 hover:shadow-sm sm:p-6"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <FileText className="h-5 w-5 shrink-0 text-stone-600" strokeWidth={1.5} aria-hidden />
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-stone-500">
                    {plan.part}
                  </span>
                </div>
                <div className="mb-1 font-serif text-lg text-stone-900">{plan.title}</div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-stone-600">{plan.description}</p>
                <span className="inline-flex min-h-[44px] items-center gap-2 text-xs font-medium text-stone-700 transition group-hover:text-stone-900">
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  Download lesson plan
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-stone-50">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 px-4 py-8 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:py-10">
          <span>Ursuline Academy · Dedham</span>
          <span className="font-serif italic">Serviam.</span>
        </div>
      </footer>
    </div>
  );
}
