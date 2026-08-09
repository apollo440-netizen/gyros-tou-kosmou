import type { Question } from '../../types/game';
import { getCountryByIsoCode } from '../../data/countries';
import { Flag } from '../Flag/Flag';
import './QuestionCard.css';

interface QuestionCardProps {
  question: Question;
  selectedAnswerId: string | null;
  onSelect: (answerId: string) => void;
}

/**
 * Κάρτα ερώτησης πολλαπλής επιλογής. Μετά την απάντηση δείχνει
 * ✓/✕ και αποκαλύπτει τη σωστή επιλογή (όχι μόνο με χρώμα).
 */
export function QuestionCard({ question, selectedAnswerId, onSelect }: QuestionCardProps) {
  const answered = selectedAnswerId !== null;
  const country = getCountryByIsoCode(question.countryId);
  const showPromptFlag =
    question.type === 'FLAG_TO_COUNTRY' || question.type === 'COUNTRY_TO_CAPITAL';
  const flagChoices = question.type === 'COUNTRY_TO_FLAG';

  return (
    <section className="question-card card" aria-label="Ερώτηση">
      <div className="question-card__prompt-area">
        {showPromptFlag && country && (
          <Flag
            iso2={country.iso2}
            countryName={question.type === 'FLAG_TO_COUNTRY' ? undefined : country.nameGreek}
            size={question.type === 'FLAG_TO_COUNTRY' ? 'xl' : 'lg'}
            className="question-card__flag"
          />
        )}
        <h2 className="question-card__prompt">{question.prompt}</h2>
      </div>

      <div
        className={`question-card__choices ${flagChoices ? 'question-card__choices--flags' : ''}`}
        role="group"
        aria-label="Επιλογές απάντησης"
      >
        {question.choices.map((choice, index) => {
          const isCorrect = choice.id === question.correctAnswerId;
          const isSelected = choice.id === selectedAnswerId;
          let stateClass = '';
          if (answered && isCorrect) stateClass = 'choice--correct';
          else if (answered && isSelected) stateClass = 'choice--wrong';
          else if (answered) stateClass = 'choice--muted';

          return (
            <button
              key={choice.id}
              type="button"
              className={`choice ${flagChoices ? 'choice--flag' : ''} ${stateClass}`}
              disabled={answered}
              onClick={() => onSelect(choice.id)}
              aria-label={
                flagChoices
                  ? `Επιλογή ${index + 1}: σημαία`
                  : `Επιλογή ${index + 1}: ${choice.label}`
              }
            >
              <span className="choice__key" aria-hidden="true">{index + 1}</span>
              {flagChoices && choice.flagIso2 ? (
                <Flag iso2={choice.flagIso2} size="lg" className="choice__flag-img" />
              ) : (
                <span className="choice__label">{choice.label}</span>
              )}
              {answered && isCorrect && (
                <span className="choice__result choice__result--ok">✓ Σωστό</span>
              )}
              {answered && isSelected && !isCorrect && (
                <span className="choice__result choice__result--no">✕ Λάθος</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
