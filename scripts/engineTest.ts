import { QuestionStream, getCountriesByDifficulty } from '../src/game/questionGenerator';
import { scoreCorrectAnswer } from '../src/game/scoring';
import type { GameConfig } from '../src/types/game';

let fails = 0;
const check = (cond: boolean, msg: string) => { if (!cond) { fails++; console.log('FAIL:', msg); } };

for (const mode of ['country','capital','flags'] as const) {
  for (const difficulty of ['easy','medium','hard'] as const) {
    const config: GameConfig = { mode, difficulty, length: 10 };
    const stream = new QuestionStream(config);
    const seen: string[] = [];
    for (let i = 0; i < 60; i++) {
      const q = stream.next();
      check(q.choices.length === 4, `${mode}/${difficulty}: ${q.choices.length} choices`);
      check(q.choices.some(c => c.id === q.correctAnswerId), `${mode}/${difficulty}: correct answer not among choices`);
      const labels = new Set(q.choices.map(c => c.flagIso2 ?? c.label));
      check(labels.size === 4, `${mode}/${difficulty}: duplicate choices [${[...labels]}] for ${q.countryId}`);
      seen.push(q.countryId);
    }
    // no immediate repeats within a pool cycle
    const poolSize = getCountriesByDifficulty(difficulty).length;
    const firstCycle = seen.slice(0, Math.min(poolSize, 60));
    check(new Set(firstCycle).size === firstCycle.length, `${mode}/${difficulty}: repeats within first cycle (pool ${poolSize})`);
  }
}

// scoring
const s1 = scoreCorrectAnswer(0, 0);
check(s1.total === 150, `fast first answer should be 150, got ${s1.total}`);
const s2 = scoreCorrectAnswer(5, 20000);
check(s2.total === 150, `streak-5 slow answer should be 100+50+0=150, got ${s2.total}`);
const s3 = scoreCorrectAnswer(15, 5000);
check(s3.base === 100 && s3.streakBonus === 100 && s3.timeBonus === 25, `capped streak: ${JSON.stringify(s3)}`);

// focus country
const fstream = new QuestionStream({ mode: 'country', difficulty: 'easy', length: 10, focusCountryId: 'jp' });
check(fstream.next().countryId === 'jp', 'focus country should come first');

console.log(fails === 0 ? 'ENGINE OK' : `${fails} failures`);
process.exit(fails ? 1 : 0);
