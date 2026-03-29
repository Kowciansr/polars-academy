import { useState } from "react";
import { RotateCw, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardsProps {
  cards: Flashcard[];
  title?: string;
}

export function Flashcards({ cards, title = "Flashcards" }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!cards.length) return null;

  const card = cards[currentIndex];

  const goNext = () => {
    setIsFlipped(false);
    setCurrentIndex((i) => (i + 1) % cards.length);
  };

  const goPrev = () => {
    setIsFlipped(false);
    setCurrentIndex((i) => (i - 1 + cards.length) % cards.length);
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-2">
        <Layers className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <span className="ml-auto text-sm text-muted-foreground">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Card */}
      <div
        className="group cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative min-h-[200px] transition-transform duration-500 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-8 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Question
            </p>
            <p className="text-lg font-medium text-foreground leading-relaxed">
              {card.front}
            </p>
            <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
              <RotateCw className="h-3 w-3" /> Click to reveal answer
            </p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-success/5 p-8 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Answer
            </p>
            <p className="text-lg font-medium text-foreground leading-relaxed">
              {card.back}
            </p>
            <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
              <RotateCw className="h-3 w-3" /> Click to see question
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" size="sm" onClick={goPrev} disabled={cards.length <= 1}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={goNext} disabled={cards.length <= 1}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
