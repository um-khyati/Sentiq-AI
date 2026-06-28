"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Button, Input, Modal, Loader, useToast } from "@/components/ui";
import { Mail, Search } from "lucide-react";

/**
 * /components-demo
 *
 * Showcase page for the Week 3 UI component library. Every component in
 * /components/ui is rendered and exercised here so reviewers can see all
 * variants, props, and interactive states in one place.
 */
export default function ComponentsDemoPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoadingDemo, setLoadingDemo] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const { toast } = useToast();

  const runLoaderDemo = () => {
    setLoadingDemo(true);
    setTimeout(() => setLoadingDemo(false), 1800);
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-slate-50 transition-colors duration-300 dark:bg-surface-dark">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
              Component Library
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Live showcase of every reusable component in{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs dark:bg-slate-800">
                /components/ui
              </code>
              .
            </p>
          </AnimatedSection>

          {/* Button */}
          <Section title="Button" code='import { Button } from "@/components/ui";'>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
            </div>
          </Section>

          {/* Input */}
          <Section title="Input" code='import { Input } from "@/components/ui";'>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Email"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                helperText="We'll never share your email."
              />
              <Input label="Password" type="password" placeholder="••••••••" />
              <Input label="Search reviews" icon={Search} placeholder="Search…" />
              <Input
                label="With error"
                placeholder="Required field"
                error="This field is required."
              />
            </div>
          </Section>

          {/* Modal */}
          <Section title="Modal" code='import { Modal } from "@/components/ui";'>
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              title="Example Modal"
              footer={
                <>
                  <Button variant="secondary" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setModalOpen(false)}>Confirm</Button>
                </>
              }
            >
              This is the shared Modal component. It traps focus visually, closes
              on backdrop click or Escape, and renders into a portal.
            </Modal>
          </Section>

          {/* Toast */}
          <Section title="Toast" code='import { useToast } from "@/components/ui";'>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => toast("Saved successfully!", { variant: "success" })}
              >
                Success toast
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast("Something went wrong.", { variant: "error" })}
              >
                Error toast
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast("Heads up — review queue is full.", { variant: "warning" })}
              >
                Warning toast
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast("New insight available.", { variant: "info" })}
              >
                Info toast
              </Button>
            </div>
          </Section>

          {/* Loader */}
          <Section title="Loader" code='import { Loader } from "@/components/ui";'>
            <div className="flex flex-wrap items-center gap-10">
              <Loader size="sm" />
              <Loader size="md" label="Loading…" />
              <Loader size="lg" variant="dots" label="Analyzing reviews" />
              <Button variant="secondary" onClick={runLoaderDemo}>
                {isLoadingDemo ? <Loader size="sm" /> : "Trigger full-screen loader"}
              </Button>
            </div>
            {isLoadingDemo && <Loader fullScreen label="Loading demo…" />}
          </Section>
        </div>
      </main>

      <Footer />
    </>
  );
}

function Section({ title, code, children }) {
  return (
    <AnimatedSection className="mt-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-surface-darkCard dark:shadow-none sm:p-8">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          <code className="text-xs text-slate-400 dark:text-slate-500">{code}</code>
        </div>
        {children}
      </div>
    </AnimatedSection>
  );
}
