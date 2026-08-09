import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { DifficultyId, FlagVariant, GameConfig, GameModeId, SessionLength } from '../types/game';
import { GAME_MODE_LABELS } from '../types/game';
import { useGameSession } from '../hooks/useGameSession';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { playSound } from '../audio/soundManager';
import { QuestionCard } from '../components/QuestionCard/QuestionCard';
import { ScoreDisplay } from '../components/ScoreDisplay/ScoreDisplay';
import { GameResults } from '../components/GameResults/GameResults';
import { Button } from '../components/Button/Button';
import { getCountryByIsoCode } from '../data/countries';
import './QuizGamePage.css';

const AUTO_ADVANCE_MS = 2200;

export function parseGameConfig(
  mode: string | undefined,
  params: URLSearchParams,
): GameConfig | null {
  if (mode !== 'country' && mode !== 'capital' && mode !== 'flags' && mode !== 'map') {
    return null;
  }
  const difficultyRaw = params.get('difficulty');
  const difficulty: DifficultyId =
    difficultyRaw === 'medium' || difficultyRaw === 'hard' ? difficultyRaw : 'easy';
  const lengthRaw = params.get('length');
  const length: SessionLength =
    lengthRaw === '20' ? 20 : lengthRaw === 'endless' ? 'endless' : 10;
  const variantRaw = params.get('variant');
  const flagVariant: FlagVariant | undefined =
    variantRaw === 'flag-to-country' || variantRaw === 'country-to-flag' || variantRaw === 'mixed'
      ? variantRaw
      : undefined;
  const focus = params.get('focus') ?? undefined;
  return {
    mode: mode as GameModeId,
    difficulty,
    length,
    flagVariant,
    focusCountryId: focus,
  };
}

/** Κοινή σελίδα για όλα τα κουίζ πολλαπλής επιλογής. */
export function QuizGamePage() {
  const { mode } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const config = useMemo(
    () => parseGameConfig(mode, searchParams),
    [mode, searchParams],
  );

  useEffect(() => {
    if (!config || config.mode === 'map') navigate('/games', { replace: true });
  }, [config, navigate]);

  if (!config || config.mode === 'map') return null;
  return <QuizSession config={config} />;
}

function QuizSession({ config }: { config: GameConfig }) {
  const navigate = useNavigate();
  const session = useGameSession(config);
  const { state, question, selectedAnswerId, lastBreakdown } = session;
  const autoAdvanceRef = useRef<number | null>(null);

  const handleAnswer = useCallback(
    (answerId: string) => {
      const correct = session.answer(answerId);
      playSound(correct ? 'correct' : 'wrong');
      if (autoAdvanceRef.current) window.clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = window.setTimeout(() => {
        session.nextQuestion();
      }, AUTO_ADVANCE_MS);
    },
    [session],
  );

  const handleAdvance = useCallback(() => {
    if (selectedAnswerId !== null) {
      if (autoAdvanceRef.current) window.clearTimeout(autoAdvanceRef.current);
      session.nextQuestion();
    }
  }, [selectedAnswerId, session]);

  useEffect(
    () => () => {
      if (autoAdvanceRef.current) window.clearTimeout(autoAdvanceRef.current);
    },
    [],
  );

  useKeyboardControls({
    onSelectChoice: (index) => {
      const choice = question.choices[index];
      if (choice && selectedAnswerId === null) handleAnswer(choice.id);
    },
    onAdvance: handleAdvance,
    enabled: !state.finished,
  });

  if (state.finished) {
    return <GameResults state={state} onPlayAgain={session.restart} />;
  }

  const answeredCorrectly =
    selectedAnswerId !== null && selectedAnswerId === question.correctAnswerId;
  const correctCountry = getCountryByIsoCode(question.countryId);

  return (
    <div className="quiz">
      <div className="quiz__top">
        <Button variant="ghost" onClick={() => navigate('/games')} aria-label="Έξοδος από το παιχνίδι">
          ← Έξοδος
        </Button>
        <span className="quiz__mode">{GAME_MODE_LABELS[config.mode]}</span>
        {config.length === 'endless' && (
          <Button variant="secondary" onClick={() => navigate('/games')}>
            Τέλος παιχνιδιού
          </Button>
        )}
      </div>

      <ScoreDisplay
        score={state.score}
        streak={state.streak}
        questionNumber={state.questionIndex + 1}
        totalQuestions={session.totalQuestions}
      />

      <QuestionCard
        key={question.id}
        question={question}
        selectedAnswerId={selectedAnswerId}
        onSelect={handleAnswer}
      />

      {selectedAnswerId !== null && (
        <div className="quiz__feedback" role="status" aria-live="assertive">
          {answeredCorrectly ? (
            <p className="quiz__feedback-text quiz__feedback-text--ok">
              ✓ Σωστό!
              {lastBreakdown && lastBreakdown.total > 0 && (
                <span className="quiz__points"> +{lastBreakdown.total} πόντοι</span>
              )}
            </p>
          ) : (
            <p className="quiz__feedback-text quiz__feedback-text--no">
              ✕ Λάθος! Η σωστή απάντηση είναι:{' '}
              <strong>
                {question.type === 'COUNTRY_TO_CAPITAL'
                  ? correctCountry?.capitalGreek
                  : correctCountry?.nameGreek}
              </strong>
            </p>
          )}
          <Button variant="primary" onClick={handleAdvance}>
            Επόμενη Ερώτηση →
          </Button>
          <p className="quiz__hint">Πάτησε Enter για να συνεχίσεις</p>
        </div>
      )}
      {selectedAnswerId === null && (
        <p className="quiz__hint">Πλήκτρα 1–4 για γρήγορη απάντηση</p>
      )}
    </div>
  );
}
