import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import ContactForm from "./ContactForm";
import CopyEmailButton from "./CopyEmailButton";
import { personal } from "../data/portfolioData";

export default function Contact() {
  return (
    <section id="contact" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Contact"
              title="Have a project in mind?"
              accent="Let's talk."
              description="Write to me right here — your message lands straight in my inbox, no email app needed. I usually reply within 24 hours."
            />

            <div className="-mt-4 space-y-3">
              <CopyEmailButton variant="card" />

              <div className="glass flex items-center gap-4 rounded-2xl p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M12 21s-7-5.3-7-11a7 7 0 1114 0c0 5.7-7 11-7 11z" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>
                <span>
                  <span className="block text-xs text-white/40">Location</span>
                  <span className="block font-medium text-white">{personal.location}</span>
                </span>
              </div>

              <div className="glass flex items-center gap-4 rounded-2xl p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span>
                  <span className="block text-xs text-white/40">Status</span>
                  <span className="block font-medium text-emerald-300">{personal.availability}</span>
                </span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-[28px] p-6 sm:p-8 lg:col-span-7"
          >
            <ContactForm variant="section" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
