"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const DYNAMIC_QUESTIONS: Record<
  string,
  { label: string; placeholder: string }[]
> = {
  "AI Document Processing": [
    { label: "How many documents per week?", placeholder: "e.g. 200" },
    { label: "Which document types?", placeholder: "e.g. invoices, delivery notes, contracts" },
    { label: "Which languages?", placeholder: "e.g. German, English" },
    { label: "Where should extracted data go?", placeholder: "e.g. SAP S/4HANA" },
    { label: "What accuracy is acceptable?", placeholder: "e.g. 95%+" },
  ],
  "Enterprise Knowledge Search": [
    { label: "How many internal documents?", placeholder: "e.g. 50,000" },
    { label: "Where are they stored?", placeholder: "e.g. SharePoint, Confluence" },
    { label: "Who should access them?", placeholder: "e.g. all employees, specific departments" },
    { label: "Do answers need source citations?", placeholder: "e.g. yes, mandatory" },
  ],
  "Customer Support Automation": [
    { label: "Monthly ticket volume?", placeholder: "e.g. 3000" },
    { label: "Helpdesk tool?", placeholder: "e.g. Zendesk, Freshdesk" },
    { label: "Top repeated questions?", placeholder: "e.g. password reset, billing" },
    { label: "Current CSAT?", placeholder: "e.g. 72%" },
  ],
  "Finance Back-Office Automation": [
    { label: "Monthly transactions?", placeholder: "e.g. 2000" },
    { label: "Current close time (days)?", placeholder: "e.g. 8" },
    { label: "Which processes to automate?", placeholder: "e.g. AP, reconciliation, close" },
  ],
  "Workflow Orchestration": [
    { label: "How many systems to connect?", placeholder: "e.g. 4" },
    { label: "Process steps?", placeholder: "e.g. 8" },
    { label: "Process frequency per week?", placeholder: "e.g. 50" },
  ],
};

interface DynamicDiagnosticQuestionsProps {
  detectedCategories: string[];
  answers: Record<string, string>;
  onAnswersChange: (answers: Record<string, string>) => void;
  onBack: () => void;
  onSubmit: () => void;
  processing: boolean;
}

export function DynamicDiagnosticQuestions({
  detectedCategories,
  answers,
  onAnswersChange,
  onBack,
  onSubmit,
  processing,
}: DynamicDiagnosticQuestionsProps) {
  return (
    <>
      {detectedCategories.map((cat) => {
        const questions = DYNAMIC_QUESTIONS[cat];
        if (!questions) return null;
        return (
          <div key={cat} className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">
              For: {cat}
            </h3>
            {questions.map((q) => (
              <div key={q.label}>
                <label className="block text-sm font-medium mb-1.5">
                  {q.label}
                </label>
                <input
                  className="w-full h-10 px-3 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder={q.placeholder}
                  value={answers[q.label] || ""}
                  onChange={(e) =>
                    onAnswersChange({
                      ...answers,
                      [q.label]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </div>
        );
      })}

      {detectedCategories.every((cat) => !DYNAMIC_QUESTIONS[cat]) && (
        <p className="text-sm text-muted-foreground">
          No category-specific questions detected. You can proceed directly.
        </p>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button size="lg" onClick={onSubmit} disabled={processing}>
          Check category fit
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
