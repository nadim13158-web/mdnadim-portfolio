import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
import { projects } from "../data/portfolioData";
import { useContactModal } from "../context/ContactModalContext";

export default function Projects() {
  const contact = useContactModal();
  return (
    <section id="projects" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Selected work"
            title="A few things I've"
            accent="designed."
            description="Posters, brand marks, social kits and interface concepts — each one a step in my design journey."
          />
          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            data-cursor=""
            className="glass mb-14 inline-flex shrink-0 items-center gap-2 self-start rounded-full px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 md:mb-16 md:self-auto"
          >
            More on GitHub
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </div>

        {projects.length === 0 ? (
          /* Kono real project na thakle ei honest message ta dekhabe */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass grid place-items-center rounded-3xl px-6 py-20 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-2xl">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 3a9 9 0 100 18c1.1 0 1.8-.8 1.8-1.7 0-.5-.2-.9-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 004-4c0-4.4-4-8-9-8z" />
                <circle cx="7.5" cy="11.5" r="1" fill="white" stroke="none" />
                <circle cx="10.5" cy="7.5" r="1" fill="white" stroke="none" />
                <circle cx="15" cy="7.5" r="1" fill="white" stroke="none" />
              </svg>
            </span>
            <h3 className="mt-6 font-display text-xl font-semibold text-white sm:text-2xl">
              My project gallery is being built
            </h3>
            <p className="mt-3 max-w-md leading-relaxed text-white/50">
              I&apos;m not going to fill this page with work that isn&apos;t mine. As soon as I have
              real designs I&apos;m happy to show, they&apos;ll appear right here.
            </p>
            <button
              type="button"
              data-cursor="Message"
              onClick={contact.open}
              className="btn-primary btn-shine mt-8 inline-flex rounded-full px-6 py-3 font-display text-sm font-semibold"
            >
              Request a sample design
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
            {projects.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
