/**
 * This function validates if the given string is a valid URL.
 * @param url
 * @returns boolean indicating if the URL is valid
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * This function validates if the given thresholds are in correct format.
 * @param thresholds
 * @returns boolean indicating if the thresholds are valid
 */
export function validateThresholds(thresholds: string[]): boolean {
  const validPattern = [/^p\(\d+\)<\d+$/, /^rate<[\d.]+$/, /^count[<>=]\d+$/];
  return thresholds.every((threshold) =>
    validPattern.some((pattern) => pattern.test(threshold)),
  );
}

/**
 * This function calculates the percentile of a given array of numbers.
 * @param values
 * @param percentile
 * @returns the calculated percentile value
 */
export function calculatePercentile(
  values: number[],
  percentile: number,
): number {
  // Sort the array and find the percentile value - Ascending order
  const sortedValues = [...values].sort((a, b) => a - b);
  // Find the index corresponding to the percentile
  const index = Math.ceil((percentile / 100) * sortedValues.length) - 1;
  // Return the value at the calculated index
  return sortedValues[index];
}
