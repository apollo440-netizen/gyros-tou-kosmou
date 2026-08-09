import { useState } from 'react';
import { DIFFICULTY_LABELS, GAME_MODE_LABELS, type ScoreEntry } from '../types/game';
import { clearScores, loadScores } from '../utils/storage';
import { formatScore } from '../game/scoring';
import { Button } from '../components/Button/Button';
import './ScoreboardPage.css';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export function ScoreboardPage() {
  const [scores, setScores] = useState<ScoreEntry[]>(() => loadScores());
  const [confirming, setConfirming] = useState(false);
  const topScore = scores[0]?.score;

  const handleClear = () => {
    clearScores();
    setScores([]);
    setConfirming(false);
  };

  return (
    <div className="scoreboard">
      <h1 className="page-title">🏆 Πίνακας Βαθμολογίας</h1>

      {scores.length === 0 ? (
        <div className="scoreboard__empty card">
          <p>Δεν υπάρχουν ακόμη βαθμολογίες.</p>
          <p>Παίξε ένα παιχνίδι και αποθήκευσε το σκορ σου!</p>
        </div>
      ) : (
        <>
          <div className="scoreboard__table-wrap card">
            <table className="scoreboard__table">
              <caption className="visually-hidden">
                Οι κορυφαίες βαθμολογίες, ταξινομημένες από την υψηλότερη στη χαμηλότερη
              </caption>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Παίκτης</th>
                  <th scope="col">Σκορ</th>
                  <th scope="col">Παιχνίδι</th>
                  <th scope="col">Δυσκολία</th>
                  <th scope="col">Σωστές</th>
                  <th scope="col">Ημερομηνία</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={entry.score === topScore ? 'scoreboard__row--top' : ''}
                  >
                    <td>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </td>
                    <td className="scoreboard__name">{entry.playerName}</td>
                    <td className="scoreboard__score">{formatScore(entry.score)}</td>
                    <td>{GAME_MODE_LABELS[entry.mode] ?? '—'}</td>
                    <td>{DIFFICULTY_LABELS[entry.difficulty] ?? '—'}</td>
                    <td>
                      {entry.correctAnswers} / {entry.totalQuestions}
                    </td>
                    <td>{formatDate(entry.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="scoreboard__actions">
            {confirming ? (
              <div className="scoreboard__confirm card" role="alertdialog" aria-label="Επιβεβαίωση διαγραφής">
                <p>Σίγουρα θέλεις να διαγράψεις όλες τις βαθμολογίες;</p>
                <div className="scoreboard__confirm-buttons">
                  <Button variant="danger" onClick={handleClear}>
                    Ναι, διαγραφή
                  </Button>
                  <Button variant="secondary" onClick={() => setConfirming(false)}>
                    Ακύρωση
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="ghost" onClick={() => setConfirming(true)}>
                Καθαρισμός Βαθμολογίας
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
