"use client";

// Parallel-route mirror for the agent slot. The (dashboard) layout swaps
// between `children` (admin) and `agent` (parallel slot) based on
// session.userType, so the agent-side /omnichannel needs its own page
// entry inside @agent. Re-exports the same client component so admin
// and agent inboxes share a single implementation.
export { default } from "../../omnichannel/page";
