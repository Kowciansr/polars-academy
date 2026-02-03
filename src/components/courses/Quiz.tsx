import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Trophy,
} from "lucide-react";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  title?: string;
  onComplete?: (score: number, total: number) => void;
}

export function Quiz({ questions, title = "Quiz", onComplete }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const correctCount = answers.filter(
    (answer, idx) => answer === questions[idx]?.correctAnswer
  ).length;
  const scorePercent = Math.round((correctCount / questions.length) * 100);

  const handleSelectAnswer = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setHasAnswered(true);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedAnswer;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
    } else {
      setShowResults(true);
      onComplete?.(correctCount + (isCorrect ? 1 : 0), questions.length);
    }
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
  };

  if (showResults) {
    const finalCorrect = answers.filter(
      (answer, idx) => answer === questions[idx]?.correctAnswer
    ).length;
    const finalPercent = Math.round((finalCorrect / questions.length) * 100);
    const passed = finalPercent >= 70;

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <div
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4",
              passed ? "bg-accent/20" : "bg-destructive/20"
            )}
          >
            {passed ? (
              <Trophy className="h-12 w-12 text-accent" />
            ) : (
              <RotateCcw className="h-12 w-12 text-destructive" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {passed ? "Congratulations!" : "Keep Practicing!"}
          </h2>
          <p className="text-muted-foreground">
            {passed
              ? "You've successfully completed this quiz."
              : "You need 70% to pass. Review the material and try again."}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Your Score
            </span>
            <Badge variant={passed ? "default" : "destructive"}>
              {passed ? "Passed" : "Not Passed"}
            </Badge>
          </div>
          <div className="text-4xl font-bold text-foreground mb-2">
            {finalPercent}%
          </div>
          <Progress value={finalPercent} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            {finalCorrect} of {questions.length} questions correct
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-foreground">Question Summary</h3>
          {questions.map((q, idx) => {
            const userAnswer = answers[idx];
            const wasCorrect = userAnswer === q.correctAnswer;
            return (
              <div
                key={q.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border",
                  wasCorrect
                    ? "bg-accent/5 border-accent/20"
                    : "bg-destructive/5 border-destructive/20"
                )}
              >
                {wasCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive shrink-0" />
                )}
                <span className="text-sm text-foreground line-clamp-1 flex-1">
                  {q.question}
                </span>
              </div>
            );
          })}
        </div>

        <Button onClick={handleRetake} variant="outline" className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          Retake Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <span className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <p className="text-lg font-medium text-foreground mb-6">
          {currentQuestion?.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion?.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrectOption = idx === currentQuestion.correctAnswer;
            const showCorrect = hasAnswered && isCorrectOption;
            const showIncorrect = hasAnswered && isSelected && !isCorrectOption;

            return (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                disabled={hasAnswered}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-all",
                  !hasAnswered && isSelected && "border-primary bg-primary/5",
                  !hasAnswered && !isSelected && "border-border hover:border-muted-foreground/50 hover:bg-muted/30",
                  showCorrect && "border-accent bg-accent/10",
                  showIncorrect && "border-destructive bg-destructive/10",
                  hasAnswered && !showCorrect && !showIncorrect && "opacity-50"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 border",
                    !hasAnswered && isSelected && "border-primary bg-primary text-primary-foreground",
                    !hasAnswered && !isSelected && "border-muted-foreground/30 text-muted-foreground",
                    showCorrect && "border-accent bg-accent text-accent-foreground",
                    showIncorrect && "border-destructive bg-destructive text-destructive-foreground"
                  )}
                >
                  {showCorrect ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : showIncorrect ? (
                    <XCircle className="h-5 w-5" />
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </div>
                <span
                  className={cn(
                    "flex-1",
                    (showCorrect || (!hasAnswered && isSelected)) && "font-medium text-foreground",
                    showIncorrect && "text-destructive"
                  )}
                >
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {hasAnswered && currentQuestion?.explanation && (
        <div
          className={cn(
            "p-4 rounded-lg mb-6 border",
            isCorrect
              ? "bg-accent/5 border-accent/20"
              : "bg-destructive/5 border-destructive/20"
          )}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={cn(
                  "font-medium mb-1",
                  isCorrect ? "text-accent" : "text-destructive"
                )}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {!hasAnswered ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNextQuestion}>
            {currentIndex < questions.length - 1 ? (
              <>
                Next Question
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            ) : (
              "View Results"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
