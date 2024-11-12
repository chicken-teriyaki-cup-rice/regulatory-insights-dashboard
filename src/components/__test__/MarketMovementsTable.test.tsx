import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import MarketMovementsTable from "../MarketMovementsTable";

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

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockRegulatoryData),
  })
);

describe("MarketMovementsTable", () => {
  beforeEach(async () => {
    global.fetch.mockClear();

    render(<MarketMovementsTable />);

    await waitFor(() => {
      expect(screen.queryByText("Loading data...")).not.toBeInTheDocument();
    });
  });

  it("renders initial table headers and buttons", async () => {
    expect(screen.getByText("Market Movement Analysis")).toBeInTheDocument();

    expect(screen.getByText("Show Institutional Patterns")).toBeInTheDocument();
    expect(screen.getByText("Show CPI Impact")).toBeInTheDocument();
  });

  it("toggles institutional patterns visibility", async () => {
    const button = screen.getByText("Show Institutional Patterns");
    fireEvent.click(button);

    expect(screen.getByText("Hide Institutional Patterns")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Hide Institutional Patterns"));

    expect(screen.getByText("Show Institutional Patterns")).toBeInTheDocument();
  });

  it("toggles CPI impact visibility", async () => {
    const button = screen.getByText("Show CPI Impact");
    fireEvent.click(button);

    expect(screen.getByText("Hide CPI Impact")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Hide CPI Impact"));

    expect(screen.getByText("Show CPI Impact")).toBeInTheDocument();
  });

  it("handles category selection", async () => {
    const selectElement = screen.getByRole("combobox");

    expect(selectElement).toHaveValue("immigrationRestrictions");
  });

  it("displays both mobile and desktop views", async () => {
    expect(screen.getByTestId("mobile-view")).toBeInTheDocument();
    expect(screen.getByTestId("desktop-view")).toBeInTheDocument();
  });

  it("handles fetch error gracefully", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(<MarketMovementsTable />);

    await waitFor(() => {
      expect(screen.getByText(/Error loading data/)).toBeInTheDocument();
    });
  });

  it("displays loading state initially", async () => {
    global.fetch.mockImplementationOnce(() => new Promise(() => {}));

    render(<MarketMovementsTable />);

    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });
});
