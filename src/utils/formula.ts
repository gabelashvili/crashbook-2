import type { FormulaKey } from '../context/formula';

export const formatFormula = (formula: string): FormulaKey[] => {
  const arr = formula.split('').map((char) => {
    if (char === '(') return 'open-bracket';
    if (char === ')') return 'close-bracket';
    if (char === '+') return 'plus';
    if (char === '-') return 'minus';
    if (char === '*') return 'multiply';
    if (char === '/') return 'divide';
    if (char === '=') return 'equal';
    return char;
  });
  return arr.filter((x) => x !== '' && x !== ' ') as FormulaKey[];
};
