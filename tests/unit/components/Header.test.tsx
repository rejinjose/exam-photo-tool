import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "../../../src/components/Header";

describe("Header", () => {
  it("shows the product name", () => {
    render(<Header />);
    expect(screen.getByText("Exam Photo Tool")).toBeInTheDocument();
  });
});
