import { daysSinceLoan } from "@/app/lib/utils/date"

describe("daysSinceLoan", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-03-18T12:00:00Z"))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("returns 0 for a loan from today", () => {
    expect(daysSinceLoan("2026-03-18T00:00:00Z")).toBe(0)
  })

  it("returns 1 for a loan from yesterday", () => {
    expect(daysSinceLoan("2026-03-17T00:00:00Z")).toBe(1)
  })

  it("returns 7 for a loan from one week ago", () => {
    expect(daysSinceLoan("2026-03-11T00:00:00Z")).toBe(7)
  })

  it("returns 30 for a loan from 30 days ago", () => {
    expect(daysSinceLoan("2026-02-16T00:00:00Z")).toBe(30)
  })

  it("floors partial days", () => {
    // Loaned at 11:00, now is 12:00 same day -> 0 days (not 1)
    expect(daysSinceLoan("2026-03-18T11:00:00Z")).toBe(0)
  })
})
