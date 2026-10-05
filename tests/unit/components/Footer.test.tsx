import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "../../../src/components/Footer";

describe("Footer", () => {
  it("shows the privacy line", () => {
    render(<Footer />);
    expect(screen.getByTestId("privacy-line")).toHaveTextContent(
      "Your photos never leave your device.",
    );
  });

  it("links to a privacy page", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute(
      "href",
      "/privacy",
    );
  });
});
