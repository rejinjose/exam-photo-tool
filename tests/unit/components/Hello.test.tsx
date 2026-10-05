import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Hello from "../../../src/components/Hello";

describe("Hello", () => {
  it("renders the privacy message", () => {
    render(<Hello />);
    expect(screen.getByTestId("hello")).toHaveTextContent(
      "Your photos never leave your device.",
    );
  });
});
