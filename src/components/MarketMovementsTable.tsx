//@ts-expect-errorexpect-errors
import React, { useState, useEffect } from "react";
import { Table } from "lucide-react";

const institutionalPatterns = {
  hedgeFunds: {
    timing: "6-8 months prior",
    signalType: "First mover",
    reliability: 0.85,
    volumeThreshold: "2x average",
  },
  pensionFunds: {
    timing: "3-4 months prior",
    signalType: "Second wave",
    reliability: 0.75,
    volumeThreshold: "1.5x average",
  },
  mutualFunds: {
    timing: "1-2 months prior",
    signalType: "Final adjustment",
    reliability: 0.65,
    volumeThreshold: "1.2x average",
  },
};

const MarketMovementsTable = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    "immigrationRestrictions"
  );
  const [showInstitutional, setShowInstitutional] = useState(false);
  const [showCPI, setShowCPI] = useState(false);
  const [regulatoryData, setRegulatoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const response = await fetch("/regulatoryData.json");
        console.log("Response received:", response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data parsed:", data);

        setRegulatoryData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-lg">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-lg text-red-500">
          Error loading data: {error}
          <br />
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!regulatoryData) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-lg">No data available</div>
      </div>
    );
  }

  return (
    <div className="w-full  max-w-6xl  mx-auto p-2 sm:p-3">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3">
          <Table className="w-6 h-6 sm:w-8 sm:h-8" />
          <h2 className="text-xl sm:text-2xl font-bold">
            Market Movement Analysis
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowInstitutional(!showInstitutional)}
            className="px-4 py-2 text-base bg-gray-100 hover:bg-gray-200 rounded w-full sm:w-auto"
          >
            {showInstitutional ? "Hide" : "Show"} Institutional Patterns
          </button>
          <button
            onClick={() => setShowCPI(!showCPI)}
            className="px-4 py-2 text-base bg-gray-100 hover:bg-gray-200 rounded w-full sm:w-auto"
          >
            {showCPI ? "Hide" : "Show"} CPI Impact
          </button>
        </div>
      </div>
      <div className="relative mb-6 mt-8">
        <div className="absolute -top-5 left-0 text-sm text-gray-600 flex items-center gap-4">
          select a category
        </div>
        <select
          className="p-3 text-lg border rounded w-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer appearance-none"
          style={{
            WebkitAppearance: "none",
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1em",
            paddingRight: "2.5rem",
          }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {Object.entries(regulatoryData).map(([key, value]) => (
            <option key={key} value={key}>
              {value.title}
            </option>
          ))}
        </select>
      </div>
      <div data-testid="mobile-view">
        <div className="block sm:hidden">
          {regulatoryData[selectedCategory]?.impacts.map((impact, index) => (
            <div key={index} className="mb-4 bg-white rounded-lg shadow p-3">
              <div className="font-medium text-sm mb-2">{impact.index}</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-gray-600">Movement Range</div>
                  <div>
                    {impact.movement.min}% to {impact.movement.max}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Direction</div>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs ${
                      impact.direction === "positive"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {impact.direction}
                  </span>
                </div>
                <div>
                  <div className="text-gray-600">Timing</div>
                  <div>{impact.timing}</div>
                </div>
                <div>
                  <div className="text-gray-600">Volume</div>
                  <div>{impact.volume}</div>
                </div>
              </div>
            </div>
          ))}

          {showCPI && regulatoryData[selectedCategory]?.cpiImpacts && (
            <div className="mt-4 space-y-4">
              <h3 className="font-bold text-sm">CPI Impact Analysis</h3>

              {regulatoryData[selectedCategory].cpiImpacts.primarySectors.map(
                (sector, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{sector.name}</span>
                      <span className="text-sm">
                        {sector.range.min}% to {sector.range.max}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {sector.drivers.map((driver, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span>{driver}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">Range</span>
                  <span
                    className={`text-sm ${
                      regulatoryData[selectedCategory].cpiImpacts
                        .netContribution.min >= 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {
                      regulatoryData[selectedCategory].cpiImpacts
                        .netContribution.min
                    }
                    % to{" "}
                    {
                      regulatoryData[selectedCategory].cpiImpacts
                        .netContribution.max
                    }
                    %
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Duration</span>
                  <span className="text-sm">
                    {regulatoryData[selectedCategory].cpiImpacts.duration}
                  </span>
                </div>
              </div>
            </div>
          )}

          {showInstitutional && (
            <div className="mt-4 space-y-4">
              <h3 className="font-bold text-sm">Institutional Patterns</h3>
              {Object.entries(institutionalPatterns).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <p className="font-medium capitalize text-sm">{key}</p>
                    <p className="text-xs text-gray-600">{value.signalType}</p>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            value.reliability >= 0.8
                              ? "bg-green-500"
                              : value.reliability >= 0.7
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${value.reliability * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-xs text-gray-500 whitespace-nowrap">
                        {value.timing}
                      </p>
                      <p className="text-xs text-gray-600 whitespace-nowrap">
                        {(value.reliability * 100).toFixed(0)}% reliable
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div data-testid="desktop-view">
        <div className="hidden sm:block">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left border-b text-lg">Index/ETF</th>{" "}
                  {/* Increased padding and text size */}
                  <th className="p-4 text-left border-b text-lg">
                    Movement Range
                  </th>
                  <th className="p-4 text-left border-b text-lg">Direction</th>
                  <th className="p-4 text-left border-b text-lg">Timing</th>
                  <th className="p-4 text-left border-b text-lg">Volume</th>
                </tr>
              </thead>
              <tbody>
                {regulatoryData[selectedCategory].impacts.map(
                  (impact, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-4 border-b text-base font-medium">
                        {" "}
                        {/* Increased padding and text size */}
                        {impact.index}
                      </td>
                      <td className="p-4 border-b text-base">
                        {impact.movement.min}% to {impact.movement.max}%
                      </td>
                      <td className="p-4 border-b text-base">
                        <span
                          className={`px-3 py-2 rounded text-base ${
                            impact.direction === "positive"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {impact.direction}
                        </span>
                      </td>
                      <td className="p-4 border-b text-base">
                        {impact.timing}
                      </td>
                      <td className="p-4 border-b text-base">
                        {impact.volume}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {showCPI && regulatoryData[selectedCategory].cpiImpacts && (
            <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-bold mb-3">CPI Impact Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 h-[160px]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-base">
                        {
                          regulatoryData[selectedCategory].cpiImpacts
                            .primarySectors[0].name
                        }
                      </span>
                      <span>
                        {
                          regulatoryData[selectedCategory].cpiImpacts
                            .primarySectors[0].range.min
                        }
                        % to{" "}
                        {
                          regulatoryData[selectedCategory].cpiImpacts
                            .primarySectors[0].range.max
                        }
                        %
                      </span>
                    </div>
                    <div className="text-gray-600 space-y-1">
                      {regulatoryData[
                        selectedCategory
                      ].cpiImpacts.primarySectors[0].drivers.map(
                        (driver, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span>{driver}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 h-[120px]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-base">
                        {
                          regulatoryData[selectedCategory].cpiImpacts
                            .primarySectors[1].name
                        }
                      </span>
                      <span>
                        {
                          regulatoryData[selectedCategory].cpiImpacts
                            .primarySectors[1].range.min
                        }
                        % to{" "}
                        {
                          regulatoryData[selectedCategory].cpiImpacts
                            .primarySectors[1].range.max
                        }
                        %
                      </span>
                    </div>
                    <div className="text-gray-600 space-y-1">
                      {regulatoryData[
                        selectedCategory
                      ].cpiImpacts.primarySectors[1].drivers.map(
                        (driver, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span>{driver}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 h-[160px]">
                    <div className="flex justify-between items-start w-full">
                      <span>Range</span>
                      <span
                        className={`font-medium ${
                          regulatoryData[selectedCategory].cpiImpacts
                            .netContribution.min >= 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {
                          regulatoryData[selectedCategory].cpiImpacts
                            .netContribution.min
                        }
                        % to{" "}
                        {
                          regulatoryData[selectedCategory].cpiImpacts
                            .netContribution.max
                        }
                        %
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 h-[120px]">
                    <div className="flex justify-between items-start w-full">
                      <span>Duration</span>
                      <span>
                        {regulatoryData[selectedCategory].cpiImpacts.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showInstitutional && (
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg mt-4">
              <h3 className="font-bold mb-2 text-sm sm:text-base">
                Institutional Patterns
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(institutionalPatterns).map(([key, value]) => (
                  <div key={key} className="p-3 bg-white rounded shadow-sm">
                    <p className="font-medium capitalize text-sm sm:text-base">
                      {key}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      {value.signalType}
                    </p>
                    <p className="text-xs text-gray-500">{value.timing}</p>
                    <div className="mt-2 flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            value.reliability >= 0.8
                              ? "bg-green-500"
                              : value.reliability >= 0.7
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${value.reliability * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {(value.reliability * 100).toFixed(0)}% reliable
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketMovementsTable;
