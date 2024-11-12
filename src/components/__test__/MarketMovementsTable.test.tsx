import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import MarketMovementsTable from "../MarketMovementsTable";

// Mock data for testing
const mockRegulatoryData = {
  immigrationRestrictions: {
    title: "Immigration Restrictions (2017)",
    period: "2017",
    impacts: [
      {
        index: "S&P 500",
        movement: { min: 0.5, max: 1.2 },
        direction: "positive",
        timing: "6-8 months",
        volume: "1.5x average",
      },
    ],
    cpiImpacts: {
      primarySectors: [
        {
          name: "Agricultural Products",
          range: { min: 0.4, max: 0.8 },
          drivers: ["Labor cost increases"],
        },
      ],
      netContribution: { min: 0.2, max: 0.3 },
      duration: "6-8 months",
    },
  },
};

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockRegulatoryData),
  })
);

describe("MarketMovementsTable", () => {
  beforeEach(async () => {
    // Reset fetch mock before each test
    global.fetch.mockClear();

    render(<MarketMovementsTable />);

    // Wait for the data to be loaded
    await waitFor(() => {
      expect(screen.queryByText("Loading data...")).not.toBeInTheDocument();
    });
  });

  it("renders initial table headers and buttons", async () => {
    // Check exact text match for heading
    expect(screen.getByText("Market Movement Analysis")).toBeInTheDocument();

    // Check exact text match for buttons in initial state
    expect(screen.getByText("Show Institutional Patterns")).toBeInTheDocument();
    expect(screen.getByText("Show CPI Impact")).toBeInTheDocument();
  });

  it("toggles institutional patterns visibility", async () => {
    // Click the button
    const button = screen.getByText("Show Institutional Patterns");
    fireEvent.click(button);

    // Verify button text changed to Hide
    expect(screen.getByText("Hide Institutional Patterns")).toBeInTheDocument();

    // Click again
    fireEvent.click(screen.getByText("Hide Institutional Patterns"));

    // Verify button text changed back to Show
    expect(screen.getByText("Show Institutional Patterns")).toBeInTheDocument();
  });

  it("toggles CPI impact visibility", async () => {
    // Click the button
    const button = screen.getByText("Show CPI Impact");
    fireEvent.click(button);

    // Verify button text changed to Hide
    expect(screen.getByText("Hide CPI Impact")).toBeInTheDocument();

    // Click again
    fireEvent.click(screen.getByText("Hide CPI Impact"));

    // Verify button text changed back to Show
    expect(screen.getByText("Show CPI Impact")).toBeInTheDocument();
  });

  it("handles category selection", async () => {
    const selectElement = screen.getByRole("combobox");

    // Check initial value matches useState default
    expect(selectElement).toHaveValue("immigrationRestrictions");
  });

  it("displays both mobile and desktop views", async () => {
    // Check for presence of both views
    expect(screen.getByTestId("mobile-view")).toBeInTheDocument();
    expect(screen.getByTestId("desktop-view")).toBeInTheDocument();
  });

  it("handles fetch error gracefully", async () => {
    // Mock fetch to reject
    global.fetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    // Re-render component
    render(<MarketMovementsTable />);

    // Wait for and check error message
    await waitFor(() => {
      expect(screen.getByText(/Error loading data/)).toBeInTheDocument();
    });
  });

  it("displays loading state initially", async () => {
    // Clear previous render
    global.fetch.mockImplementationOnce(() => new Promise(() => {}));

    // Re-render component
    render(<MarketMovementsTable />);

    // Check for loading message
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });
});
