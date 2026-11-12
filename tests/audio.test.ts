import { describe, expect, it } from "vitest";
import { loopBounds } from "../src/services/audio";

describe("background music loop bounds", () => {
  it("skips the silent padding a compressed file decodes with", () => {
    const samples = new Float32Array(40);
    samples.fill(0.5, 5, 30);
    expect(loopBounds(samples, 10)).toEqual([0.5, 3]);
  });
  it("loops the whole buffer when almost nothing is audible", () => {
    const samples = new Float32Array(40);
    samples.fill(0.5, 5, 9);
    expect(loopBounds(samples, 10)).toEqual([0, 4]);
  });
});
