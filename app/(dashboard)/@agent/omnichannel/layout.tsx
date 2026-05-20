"use client";

// Parallel-route mirror of the admin /omnichannel layout (sets the page
// title + wraps the route in withActiveOrganization). Kept as a re-export
// so the agent slot doesn't drift from the admin layout.
export { default } from "../../omnichannel/layout";
