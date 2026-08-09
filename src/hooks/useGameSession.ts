import { useCallback, useMemo, useRef, useState } from 'react';
import type { GameConfig, Question, SessionState } from '../types/game';
import { QuestionStream } from '../game/questionGenerator';
import { scoreCorrectAnswer, scoreWrongAnswer, type ScoreBreakdown } from '../game/scoring';

export interface GameSession {
  state: SessionState;
  question: Question;
  /** id επιλογής που διάλεξε ο παίκτης (ή iso2 χώρας στον χάρτη), null όσο δεν έχει απαντήσει */
  selectedAnswerId: string | null;
  lastBreakdown: ScoreBreakdown | null;
  totalQuestions: number | null;
  answer: (answerId: string) => boolean;
  nextQuestion: () => void;
  restart: () => void;
}

function initialState(config: GameConfig): SessionState {
  return {
    config,
    questionIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    answers: [],
    finished: false,
  };
}

/**
 * Κοινή μηχανή συνεδρίας για όλες τις λειτουργίες παιχνιδιού
 * (κουίζ πολλαπλής επιλογής και χάρτης).
 */
export function useGameSession(config: GameConfig, restrictToIso2?: Set<string>): GameSession {
  const streamRef = useRef<QuestionStream | null>(null);
  if (streamRef.current === null) {
    streamRef.current = new QuestionStream(config, restrictToIso2);
  }

  const [state, setState] = useState<SessionState>(() => initialState(config));
  const [question, setQuestion] = useState<Question>(() => streamRef.current!.next());
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [lastBreakdown, setLastBreakdown] = useState<ScoreBreakdown | null>(null);
  const questionStartRef = useRef<number>(performance.now());

  const totalQuestions = useMemo(
    () => (config.length === 'endless' ? null : config.length),
    [config.length],
  );

  const answer = useCallback(
    (answerId: string): boolean => {
      if (selectedAnswerId !== null) return false;
      const timeMs = performance.now() - questionStartRef.current;
      const correct = answerId === question.correctAnswerId;
      const breakdown = correct
        ? scoreCorrectAnswer(state.streak, timeMs)
        : scoreWrongAnswer();
      setSelectedAnswerId(answerId);
      setLastBreakdown(breakdown);
      setState((prev) => {
        const streak = correct ? prev.streak + 1 : 0;
        return {
          ...prev,
          score: prev.score + breakdown.total,
          streak,
          bestStreak: Math.max(prev.bestStreak, streak),
          answers: [
            ...prev.answers,
            {
              questionId: question.id,
              countryId: question.countryId,
              correct,
              pointsAwarded: breakdown.total,
              timeMs,
            },
          ],
        };
      });
      return correct;
    },
    [question, selectedAnswerId, state.streak],
  );

  const nextQuestion = useCallback(() => {
    if (selectedAnswerId === null) return;
    setState((prev) => {
      const nextIndex = prev.questionIndex + 1;
      const finished = totalQuestions !== null && nextIndex >= totalQuestions;
      return { ...prev, questionIndex: nextIndex, finished };
    });
    const nextIndex = state.questionIndex + 1;
    const willFinish = totalQuestions !== null && nextIndex >= totalQuestions;
    if (!willFinish) {
      setQuestion(streamRef.current!.next());
      setSelectedAnswerId(null);
      setLastBreakdown(null);
      questionStartRef.current = performance.now();
    }
  }, [selectedAnswerId, state.questionIndex, totalQuestions]);

  const restart = useCallback(() => {
    streamRef.current = new QuestionStream(config, restrictToIso2);
    setState(initialState(config));
    setQuestion(streamRef.current.next());
    setSelectedAnswerId(null);
    setLastBreakdown(null);
    questionStartRef.current = performance.now();
  }, [config, restrictToIso2]);

  return {
    state,
    question,
    selectedAnswerId,
    lastBreakdown,
    totalQuestions,
    answer,
    nextQuestion,
    restart,
  };
}
