import type { FormulaKey } from '../context/formula';

export const formatFormula = (formula: string): FormulaKey[] => {
  const keys: string[] = [];

  for (let i = 0; i < formula.length; i++) {
    const char = formula[i];
    if (char === '^') {
      keys.push(`^${formula[i + 1]}`);
      i++;
    } else {
      keys.push(char);
    }
  }
  console.log(keys);

  const arr = keys.map((char) => {
    if (char === '(') return 'open-bracket';
    if (char === ')') return 'close-bracket';
    if (char === '+') return 'plus';
    if (char === '-') return 'minus';
    if (char === '*') return 'multiply';
    if (char === '/') return 'divide';
    if (char === '=') return 'equal';
    if (char === ',' || char === '.') return 'hiphen';
    return char;
  });
  return arr.filter((x) => x !== '' && x !== ' ') as FormulaKey[];
};
