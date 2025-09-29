import React from "react";
import { TooltipProps } from "recharts";

type ChartCustomTooltipProps = TooltipProps<any, any> & {
  headerDataKeys?: string[];
};

const ChartCustomTooltip = ({
  active,
  payload,
  label,
  contentStyle,
  headerDataKeys = [],
  labelFormatter,
}: ChartCustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-64"
      style={{
        ...contentStyle,
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      {label && (
        <p className="font-medium text-gray-900 text-sm mb-2">
          {labelFormatter ? labelFormatter(label, payload) : label}
        </p>
      )}

      {payload
        .filter(
          (item) =>
            typeof item.dataKey === "string" &&
            headerDataKeys?.includes(item.dataKey)
        )
        .map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-600">
                {entry.name || entry.dataKey}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : entry.value}
            </span>
          </div>
        ))}
      <hr className="my-2" />

      <div className="space-y-1">
        {payload
          .filter(
            (item) =>
              !(
                typeof item.dataKey === "string" &&
                headerDataKeys?.includes(item.dataKey)
              )
          )
          .map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">
                  {entry.name || entry.dataKey}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {typeof entry.value === "number"
                  ? entry.value.toLocaleString()
                  : entry.value}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChartCustomTooltip;
