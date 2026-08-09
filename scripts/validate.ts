import { ALL_COUNTRIES, getCountryByIsoNumeric } from '../src/data/countries';
import topo from 'world-atlas/countries-50m.json';

const errs: string[] = [];
const warn: string[] = [];

const iso2s = new Set<string>(), iso3s = new Set<string>(), nums = new Set<string>(), names = new Set<string>();
for (const c of ALL_COUNTRIES) {
  if (iso2s.has(c.iso2)) errs.push(`dup iso2 ${c.iso2}`);
  if (iso3s.has(c.iso3)) errs.push(`dup iso3 ${c.iso3}`);
  if (c.isoNumeric !== '-99' && nums.has(c.isoNumeric)) errs.push(`dup isoNumeric ${c.isoNumeric} (${c.nameGreek})`);
  if (names.has(c.nameGreek)) errs.push(`dup nameGreek ${c.nameGreek}`);
  iso2s.add(c.iso2); iso3s.add(c.iso3); nums.add(c.isoNumeric); names.add(c.nameGreek);
  if (!/^[a-z]{2}$/.test(c.iso2)) errs.push(`bad iso2 ${c.iso2}`);
  if (!/^[A-Z]{3}$/.test(c.iso3)) errs.push(`bad iso3 ${c.iso3} (${c.nameGreek})`);
  if (!c.capitalGreek) errs.push(`no capital ${c.nameGreek}`);
  if (!c.factsGreek?.length) warn.push(`no facts ${c.nameGreek}`);
  if (![1,2,3].includes(c.tier)) errs.push(`bad tier ${c.nameGreek}`);
  if (!c.nameGreekAccusative || !c.nameGreekGenitive) errs.push(`missing declension ${c.nameGreek}`);
}

const tierCounts = [1,2,3].map(t => ALL_COUNTRIES.filter(c=>c.tier===t).length);
console.log(`Total: ${ALL_COUNTRIES.length} | tiers 1/2/3: ${tierCounts.join('/')}`);
const byCont: Record<string, number> = {};
for (const c of ALL_COUNTRIES) byCont[c.continent] = (byCont[c.continent]??0)+1;
console.log('Continents:', JSON.stringify(byCont));

// map join
const geoIds = new Set((topo as any).objects.countries.geometries.map((g: any) => String(g.id ?? '')));
const unmatchedData = ALL_COUNTRIES.filter(c => !geoIds.has(c.isoNumeric)).map(c => `${c.nameGreek}(${c.isoNumeric})`);
const unmatchedGeo = [...geoIds].filter(id => id !== '010' && !getCountryByIsoNumeric(id));
console.log('Countries with no map geometry:', unmatchedData.join(', ') || 'none');
console.log('Geometries with no country match:', unmatchedGeo.map(id => {
  const g = (topo as any).objects.countries.geometries.find((x:any)=>String(x.id??'')===id);
  return `${g?.properties?.name}(${id})`;
}).join(', ') || 'none');

// flags
import { readdirSync } from 'fs';
const flagFiles = new Set(readdirSync('node_modules/flag-icons/flags/4x3').map(f=>f.replace('.svg','')));
const noFlag = ALL_COUNTRIES.filter(c=>!flagFiles.has(c.iso2)).map(c=>c.nameGreek);
console.log('Countries with no flag file:', noFlag.join(', ') || 'none');

if (errs.length) { console.log('\nERRORS:'); errs.forEach(e=>console.log(' -',e)); process.exit(1); }
if (warn.length) { console.log('\nWarnings:'); warn.forEach(e=>console.log(' -',e)); }
console.log('\nOK');
