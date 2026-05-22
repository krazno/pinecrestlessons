import { Download, FileText } from "lucide-react";

type Resource = {
  title: string;
  description: string;
  href: string;
  format: string;
};

type ResourceGroup = {
  label: string;
  title: string;
  items: Resource[];
};

const TEAM_RESOURCES: ResourceGroup[] = [
  {
    label: "Overview",
    title: "Package overview",
    items: [
      {
        title: "Two-part lesson overview",
        description: "How Part 1 and Part 2 fit together for faculty and reviewers.",
        href: "/artifacts/team/ursuline_lesson_package_overview.md",
        format: "Markdown",
      },
    ],
  },
  {
    label: "Pt 1 · AI Literacy",
    title: "Teacher materials",
    items: [
      {
        title: "Part 1 lesson plan",
        description: "Timing, objectives, activities, and discussion prompts for AI, the Brain, and Serviam.",
        href: "/artifacts/team/ursuline_pt1_teacher_lesson_plan.docx",
        format: "Word",
      },
      {
        title: "Part 1 review outline",
        description: "Rationale, pedagogy, standards alignment, and delivery notes for leaders.",
        href: "/artifacts/team/ursuline_pt1_teacher_review_outline.md",
        format: "Markdown",
      },
    ],
  },
  {
    label: "Pt 2 · Inside AI",
    title: "Teacher materials",
    items: [
      {
        title: "Part 2 lesson plan",
        description: "Timing, objectives, math and CS activities, and extension notes for Inside AI.",
        href: "/artifacts/team/ursuline_part2_teacher_lesson_plan.docx",
        format: "Word",
      },
      {
        title: "Part 2 review outline",
        description: "Why Part 2 exists, Ursuline fit, student experience, and standards for leaders.",
        href: "/artifacts/team/ursuline_pt2_teacher_review_outline.md",
        format: "Markdown",
      },
      {
        title: "Part 2 alignment checklist",
        description: "Deck polish notes, age-appropriate guardrails, and final framing.",
        href: "/artifacts/team/ursuline_part2_alignment_checklist.md",
        format: "Markdown",
      },
      {
        title: "Part 2 research source map",
        description: "Citation bank for speaker notes, lesson plan, and reviewer materials.",
        href: "/artifacts/team/ursuline_part2_research_source_map.md",
        format: "Markdown",
      },
      {
        title: "Part 2 slide deck outline",
        description: "12-slide student deck structure with on-slide text and interaction notes.",
        href: "/artifacts/team/ursuline_part2_gamma_deck_12_slides.md",
        format: "Markdown",
      },
    ],
  },
];

function ResourceCard({ item }: { item: Resource }) {
  return (
    <a
      href={item.href}
      download
      className="group flex flex-col rounded-2xl border border-stone-300 bg-white p-6 transition hover:border-stone-400 hover:shadow-sm"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <FileText className="h-5 w-5 shrink-0 text-stone-600" strokeWidth={1.5} aria-hidden />
        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-stone-500">
          {item.format}
        </span>
      </div>
      <div className="mb-1 font-serif text-lg text-stone-900">{item.title}</div>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-stone-600">{item.description}</p>
      <span className="inline-flex items-center gap-2 text-xs font-medium text-stone-700 transition group-hover:text-stone-900">
        <Download className="h-3.5 w-3.5" aria-hidden />
        Download
      </span>
    </a>
  );
}

export default function TeamLeadershipSection() {
  return (
    <section id="team-leadership" className="scroll-mt-28 border-t-4 border-stone-300 bg-stone-200/60">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600">
          Team & leadership
        </p>
        <h2 className="mb-4 font-serif text-3xl text-stone-900 md:text-4xl">Faculty and review materials</h2>
        <p className="mb-12 max-w-2xl text-sm leading-relaxed text-stone-600">
          Lesson plans, review outlines, alignment notes, and source maps for teachers, administrators, and
          reviewers. These files support delivery and evaluation. They are not part of the student lesson above.
        </p>

        <div className="space-y-14">
          {TEAM_RESOURCES.map((group) => (
            <div key={group.label}>
              <p className="mb-2 text-xs uppercase tracking-widest text-stone-500">{group.label}</p>
              <h3 className="mb-6 font-serif text-2xl text-stone-900">{group.title}</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <ResourceCard key={item.href} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
