// Single source of truth for identifiers, key patterns and limits.
// The client, the API schema and the tests all import these values; never copy them.
export const currentSchema = 2;
export const schemas = [1, 2] as const;
// Lowercase letters, digits and underscores. Prefix by group (harvest_, rare_, region_) so regions never collide.
export const discoveryIdPattern = /^[a-z0-9_]{1,32}$/;
export const maxDiscoveries = 200;
export const maxFields = 200;
export const maxBodyBytes = 64000;
export const maxDecorations = 20;
export const plantKinds = ["sunflower", "carrot", "berry"] as const;
export const decorationIds = ["flower", "butterfly", "star"] as const;
export const houseColors = [
  "#efcf9d",
  "#d7a6b5",
  "#a5bca0",
  "#a2becb",
  "#e7bc7b",
] as const;
export const mealKinds = ["orange", "colors", "berries", "apples"] as const;
// Fields named n.<name> are monotonic counters: the larger value always wins a merge.
export const counterPrefix = "n.";
export const counterKeyPattern = /^n\.[a-z0-9_]{1,40}$/;
export const maxCounter = 1_000_000_000;
export const isCounterKey = (key: string) => key.startsWith(counterPrefix);
