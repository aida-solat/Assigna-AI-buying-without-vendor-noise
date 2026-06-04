"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface ProblemNarrativeInputProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  onContinue: () => void;
}

export function ProblemNarrativeInput({
  description,
  onDescriptionChange,
  keywords,
  onKeywordsChange,
  onContinue,
}: ProblemNarrativeInputProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-2">
          What problem are you trying to solve?
        </label>
        <textarea
          className="w-full h-40 p-4 border border-border rounded-xl bg-card text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
          placeholder="Example: We receive hundreds of supplier invoices and delivery notes every week. Our team manually checks them against purchase orders and enters data into SAP. Errors are increasing and month-end processing is slow."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {description.length < 20
            ? `${20 - description.length} more characters needed`
            : ""}
        </p>
      </div>

      <KeywordInput keywords={keywords} onChange={onKeywordsChange} />

      <Button size="lg" disabled={description.length < 20} onClick={onContinue}>
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </>
  );
}

function KeywordInput({
  keywords,
  onChange,
}: {
  keywords: string[];
  onChange: (kw: string[]) => void;
}) {
  const handleAdd = (input: string) => {
    const kw = input.trim();
    if (kw && !keywords.includes(kw)) {
      onChange([...keywords, kw]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Keywords (optional)
      </label>
      <div className="flex gap-2">
        <input
          className="flex-1 h-10 px-3 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="e.g. invoice, OCR, SAP"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAdd((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            const input = e.currentTarget
              .previousElementSibling as HTMLInputElement;
            handleAdd(input.value);
            input.value = "";
          }}
        >
          Add
        </Button>
      </div>
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {keywords.map((kw) => (
            <Badge key={kw} variant="default">
              {kw}
              <button
                className="ml-1.5 hover:text-risk"
                onClick={() => onChange(keywords.filter((k) => k !== kw))}
              >
                x
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
