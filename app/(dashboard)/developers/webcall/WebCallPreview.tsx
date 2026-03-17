"use client";

import WebCallIcon from "./WebCallIcon";

type WebCallPreviewProps = {
  iconText: string;
  iconBackgroundColor: string;
  iconBaseColor: string;
  iconFontColor: string;
};

const WebCallPreview = ({
  iconText,
  iconBackgroundColor,
  iconBaseColor,
  iconFontColor,
}: WebCallPreviewProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center">
        {iconText && (
          <div
            className="h-12 flex items-center rounded-full ps-14 pe-5"
            style={{ backgroundColor: iconBaseColor }}
          >
            <span
              className="text-sm font-medium whitespace-nowrap"
              style={{ color: iconFontColor }}
            >
              {iconText}
            </span>
          </div>
        )}
        <div
          className="absolute start-0 flex items-center justify-center w-12 h-12 rounded-full shrink-0 text-white shadow-md"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <WebCallIcon />
        </div>
      </div>
    </div>
  );
};

export default WebCallPreview;
