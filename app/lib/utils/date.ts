/**
 * Calculates the number of days elapsed since a given ISO date string.
 */
export function daysSinceLoan(loanedDate: string): number {
  const date = new Date(loanedDate)
  const now = new Date()
  const timeDifference = now.getTime() - date.getTime()
  return Math.floor(timeDifference / (1000 * 60 * 60 * 24))
}
