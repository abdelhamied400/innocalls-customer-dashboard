import { DateTimeProps, ExtCellProps } from "../types";

export const DateTime = ({ date, time }: DateTimeProps) => (
  <div className="flex flex-col">
    <span>{date}</span>
    <span className="text-gray-500 text-xs">{time}</span>
  </div>
);

export const ExtCell = ({ ext, name }: ExtCellProps) => (
  <div className="flex flex-col">
    <span>{name}</span>
    <span className="text-gray-500 text-xs">{ext}</span>
  </div>
);
