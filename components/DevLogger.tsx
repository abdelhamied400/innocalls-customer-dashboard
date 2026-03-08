"use client";
import useAuth from "@/hooks/useAuth";
import useAuthStore from "@/store/auth.slice";
import { useSession } from "@/hooks/useSession";
import React, { useState } from "react";

const DevLogger = () => {
  const [open, setOpen] = useState(false);
  const { Organization } = useAuthStore();
  const { data: session } = useSession();
  const { data: auth } = useAuth();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div dir="ltr">
      {/* Small icon button */}
      {!open && (
        <button
          className="fixed bottom-20 right-4 z-50 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
          onClick={() => setOpen(true)}
          aria-label="Open DevLogger"
        >
          {/* Simple bug icon */}
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#fff" opacity="0.1" />
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="12"
              r="5"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      )}

      {/* Fullscreen popup */}
      {open && (
        <div className="fixed inset-2 rounded-3xl z-50 bg-gray-900 flex flex-col items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              className="absolute top-5 right-5 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600"
              onClick={() => setOpen(false)}
              aria-label="Close DevLogger"
            >
              {/* Close icon */}
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="text-white w-full h-full p-8 overflow-auto">
              <pre>
                <code>
                  {JSON.stringify(
                    {
                      timestamp: new Date().toISOString(),
                      Organization,
                      session,
                      auth,
                    },
                    null,
                    2
                  )}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevLogger;
