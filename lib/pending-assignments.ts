/**
 * Tracks conversation IDs whose assignee list is currently being
 * persisted by AssignAgentControl. The omnichannel page's poll merges
 * read from this set so a poll that completes mid-flight doesn't
 * overwrite the optimistic assignees with a stale server snapshot —
 * which would make the chip flash off and on.
 *
 * Module-scoped Set rather than a context/store because the read site
 * (poll merge callbacks) and the write site (AssignAgentControl) are
 * always in the same tab; there's no need for cross-component
 * subscriptions, and any state lib would be overkill for this single
 * bit of bookkeeping.
 */
const inFlight = new Set<string>();

export function markAssignmentPending(conversationId: string): void {
  inFlight.add(conversationId);
}

export function clearAssignmentPending(conversationId: string): void {
  inFlight.delete(conversationId);
}

export function isAssignmentPending(conversationId: string): boolean {
  return inFlight.has(conversationId);
}
