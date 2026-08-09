import { formatScore } from '../../game/scoring';
import './ScoreDisplay.css';

interface ScoreDisplayProps {
  score: number;
  streak: number;
  questionNumber: number;
  totalQuestions: number | null;
}

export function ScoreDisplay({ score, streak, questionNumber, totalQuestions }: ScoreDisplayProps) {
  return (
    <div className="score-display" role="status" aria-live="polite">
      <div className="score-display__item">
        <span className="score-display__label">Σκορ</span>
        <span className="score-display__value">{formatScore(score)}</span>
      </div>
      <div className="score-display__item">
        <span className="score-display__label">Ερώτηση</span>
        <span className="score-display__value">
          {questionNumber}
          {totalQuestions !== null && <span className="score-display__total"> / {totalQuestions}</span>}
        </span>
      </div>
      <div className={`score-display__item ${streak >= 3 ? 'score-display__item--hot' : ''}`}>
        <span className="score-display__label">Σερί</span>
        <span className="score-display__value">
          {streak >= 3 && <span aria-hidden="true">🔥 </span>}
          {streak}
        </span>
      </div>
    </div>
  );
}
