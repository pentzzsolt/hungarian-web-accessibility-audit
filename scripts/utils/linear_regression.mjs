/**
 * @typedef {Object} RegressionResult
 * @property {number} slope
 */

/**
 * @type {(previousValue: number, currentValue: number) => number}
 */
const sumReducer = (previousValue, currentValue) => previousValue + currentValue;

/**
 * Calculates the linear regression of a dataset.
 * @param {number[]} y - Array of y-values
 * @returns {RegressionResult} Object containing slope
 */
export const linearRegression = y => {
  const n = y.length;
  const x = Array.from({ length: n }, (_, i) => i);

  const sumX = x.reduce(sumReducer, 0),
        sumY = y.reduce(sumReducer, 0),
        sumXY = x.reduce((accumulator, currentValue, currentIndex) => accumulator + currentValue * y[currentIndex], 0),
        sumXX = x.reduce((accumulator, currentValue) => accumulator + currentValue * currentValue, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

  return { slope };
}

/**
 * Calculates the linear regression of normalized data.
 * @param {number[]} y - Array of y-values
 * @returns {RegressionResult} Object containing slope
 */
export const normalizedLinearRegression = y => {
  const base = y[0];
  const normalized = y.map(v => v / base);
  return linearRegression(normalized);
}
