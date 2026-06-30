import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, GraduationCap, Award, Users, Code, Brain, Eye, Cpu } from "lucide-react";
import { Layout } from "@/components/Layout";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

const projects = [
  {
    title: "Sign Language Detection",
    icon: <Brain size={18} />,
    description: "A real-time computer vision system that detects and translates sign language gestures into text using deep learning and OpenCV.",
  },
  {
    title: "CPU Scheduler",
    icon: <Cpu size={18} />,
    description: "An interactive simulator visualizing process scheduling algorithms (FCFS, SJF, Round Robin, Priority) with Gantt charts and performance metrics.",
  },
  {
    title: "Face Mask Detection",
    icon: <Eye size={18} />,
    description: "A CNN-based model that detects whether individuals are wearing face masks in real-time video streams, built with TensorFlow and deployed for public safety monitoring.",
  },
];

export function AboutMePage() {
  return (
    <Layout showBadge={false} title="About Me">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="max-w-2xl mx-auto"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] mb-5 sm:mb-6 transition-default"
        >
          <ArrowLeft size={15} />
          Back to search
        </Link>

        {/* Profile Hero */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-line)] p-6 sm:p-8 shadow-soft mb-5 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            <div className="relative shrink-0">
              <img
                src="/mayur-portrait.png"
                alt="Mayur Dimri"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover ring-2 ring-[var(--color-line)] border border-[var(--color-line)]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect fill='%2327272a' width='128' height='128'/%3E%3Ctext x='64' y='72' font-size='48' text-anchor='middle' fill='%23a1a1aa' font-family='system-ui'%3EMD%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="absolute -bottom-1 -right-1 bg-[var(--color-ink)] text-[var(--color-paper)] rounded-full p-1.5 border-2 border-[var(--color-surface)]">
                <Code size={14} />
              </div>
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-ink)] tracking-tight">
                Mayur Dimri
              </h2>
              <p className="text-[var(--color-ink-muted)] mt-1 text-sm sm:text-base">
                Software Developer & Team Leader
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                <a
                  href="tel:8265895965"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] transition-default"
                >
                  <Phone size={14} />
                  8265895965
                </a>
                <a
                  href="mailto:shinchan777888@gmail.com"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] transition-default"
                >
                  <Mail size={14} />
                  shinchan777888@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Education */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-line)] p-6 sm:p-8 shadow-soft mb-5 sm:mb-6"
        >
          <motion.div variants={item} className="flex items-center gap-2 mb-4">
            <GraduationCap size={20} className="text-[var(--color-ink-muted)]" />
            <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--color-ink)]">Education</h3>
          </motion.div>

          <motion.div variants={item} className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-line)]">
              <div className="min-w-0">
                <p className="font-semibold text-[var(--color-ink)] text-sm sm:text-base">Graphic Era Hill University</p>
                <p className="text-xs sm:text-sm text-[var(--color-ink-muted)]">Bachelor of Computer Applications (BCA)</p>
              </div>
              <Award size={16} className="text-[var(--color-ink-subtle)] shrink-0 hidden sm:block" />
            </div>
          </motion.div>
        </motion.div>

        {/* Projects */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-line)] p-6 sm:p-8 shadow-soft mb-5 sm:mb-6"
        >
          <motion.div variants={item} className="flex items-center gap-2 mb-4">
            <Code size={20} className="text-[var(--color-ink-muted)]" />
            <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--color-ink)]">Projects</h3>
          </motion.div>

          <div className="space-y-3">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                variants={item}
                custom={i}
                className="group p-4 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-line)] transition-default hover:border-[var(--color-line-hover)]"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-[var(--color-surface)] text-[var(--color-ink-muted)] group-hover:text-[var(--color-ink)] transition-default shrink-0">
                    {project.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-[var(--color-ink)] text-sm sm:text-base">{project.title}</h4>
                    <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] mt-1 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={item} className="mt-4 flex items-center gap-2 text-sm text-[var(--color-ink-muted)] bg-[var(--color-surface-raised)] rounded-xl p-3 border border-[var(--color-line)]">
            <Users size={16} className="shrink-0" />
            <span>Served as <strong className="text-[var(--color-ink)]">team leader</strong> in all projects, guiding development, architecture decisions, and delivery.</span>
          </motion.div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-line)] p-6 sm:p-8 shadow-soft"
        >
          <motion.h3 variants={item} className="font-display text-lg sm:text-xl font-bold text-[var(--color-ink)] mb-4">
            Get in Touch
          </motion.h3>
          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:8265895965"
              className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-line)] transition-default hover:border-[var(--color-line-hover)] group"
            >
              <div className="p-2 rounded-lg bg-[var(--color-surface)] text-[var(--color-ink-muted)] group-hover:text-[var(--color-ink)] transition-default shrink-0">
                <Phone size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[var(--color-ink-subtle)] uppercase tracking-wider">Phone</p>
                <p className="font-semibold text-[var(--color-ink)] text-sm truncate">8265895965</p>
              </div>
            </a>
            <a
              href="mailto:shinchan777888@gmail.com"
              className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-line)] transition-default hover:border-[var(--color-line-hover)] group"
            >
              <div className="p-2 rounded-lg bg-[var(--color-surface)] text-[var(--color-ink-muted)] group-hover:text-[var(--color-ink)] transition-default shrink-0">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[var(--color-ink-subtle)] uppercase tracking-wider">Email</p>
                <p className="font-semibold text-[var(--color-ink)] text-sm truncate">shinchan777888@gmail.com</p>
              </div>
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
