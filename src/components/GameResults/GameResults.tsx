import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SessionState } from '../../types/game';
import { formatScore } from '../../game/scoring';
import { addScore, loadScores, sanitizePlayerName, MAX_PLAYER_NAME_LENGTH } from '../../utils/storage';
import { useSettings } from '../../context/SettingsContext';
import { playSound } from '../../audio/soundManager';
import { Button } from '../Button/Button';
import './GameResults.css';

interface GameResultsProps {
  state: SessionState;
  onPlayAgain: () => void;
}

/** Οθόνη αποτελεσμάτων με καταχώριση ονόματος στον πίνακα βαθμολογίας. */
export function GameResults({ state, onPlayAgain }: GameResultsProps) {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const [name, setName] = useState(settings.lastPlayerName);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const correct = state.answers.filter((a) => a.correct).length;
  const total = state.answers.length;
  const isNewHighScore =
    state.score > 0 &&
    (loadScores()[0]?.score === undefined || state.score > loadScores()[0].score);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isNewHighScore) playSound('highscore');
    // μόνο κατά την πρώτη εμφάνιση της οθόνης
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = () => {
    const clean = sanitizePlayerName(name);
    if (!clean || saved) return;
    addScore({
      playerName: clean,
      score: state.score,
      mode: state.config.mode,
      difficulty: state.config.difficulty,
      correctAnswers: correct,
      totalQuestions: total,
      date: new Date().toISOString(),
    });
    updateSettings({ lastPlayerName: clean });
    setSaved(true);
    playSound('correct');
  };

  return (
    <section className="game-results card" aria-label="Αποτελέσματα παιχνιδιού">
      <h2 className="game-results__title">Τελικό Σκορ</h2>
      {isNewHighScore && (
        <p className="game-results__highscore" role="status">
          🎉 Νέο ρεκόρ!
        </p>
      )}
      <p className="game-results__score">{formatScore(state.score)} πόντοι</p>
      <div className="game-results__stats">
        <div className="game-results__stat">
          <span className="game-results__stat-value">
            {correct} / {total}
          </span>
          <span className="game-results__stat-label">σωστές απαντήσεις</span>
        </div>
        <div className="game-results__stat">
          <span className="game-results__stat-value">{state.bestStreak}</span>
          <span className="game-results__stat-label">καλύτερο σερί</span>
        </div>
      </div>

      {saved ? (
        <p className="game-results__saved" role="status">
          ✓ Η βαθμολογία αποθηκεύτηκε!
        </p>
      ) : (
        <form
          className="game-results__form"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <label className="game-results__label" htmlFor="player-name">
            Όνομα παίκτη:
          </label>
          <div className="game-results__form-row">
            <input
              ref={inputRef}
              id="player-name"
              className="game-results__input"
              type="text"
              value={name}
              maxLength={MAX_PLAYER_NAME_LENGTH}
              placeholder="π.χ. Αλέξανδρος"
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
            />
            <Button type="submit" variant="leaf" disabled={!sanitizePlayerName(name)}>
              Αποθήκευση
            </Button>
          </div>
        </form>
      )}

      <div className="game-results__actions">
        <Button variant="primary" size="lg" onClick={onPlayAgain}>
          Παίξε ξανά
        </Button>
        <Button variant="secondary" size="lg" onClick={() => navigate('/')}>
          Αρχικό μενού
        </Button>
        {saved && (
          <Button variant="sun" size="lg" onClick={() => navigate('/scoreboard')}>
            Δες τη Βαθμολογία
          </Button>
        )}
      </div>
    </section>
  );
}
