import React, { useState } from "react";

const DEFAULT_MAX_VISIBLE_CARDS = 3;

type StackedStatsRowCardProps = {
  children: React.ReactNode;
  defaultExpanded?: boolean;
  maxVisibleCards?: number;
};

const StackedStatsRowCard = ({
  children,
  defaultExpanded = false,
  maxVisibleCards = DEFAULT_MAX_VISIBLE_CARDS,
}: StackedStatsRowCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const childrenArray = React.Children.toArray(children);

  const visibleChildren = childrenArray.slice(0, maxVisibleCards);

  return (
    <div className="stacked-stats-container">
      <div
        className={`relative transition-all duration-300 ease-in-out cursor-pointer ${
          !isExpanded ? "pb-6" : "space-y-2"
        }`}
        style={{
          minHeight: !isExpanded ? "60px" : "auto",
        }}
        onClick={() => childrenArray.length > 1 && setIsExpanded(!isExpanded)}
      >
        {isExpanded
          ? // Show all cards when expanded
            childrenArray.map((child, index) => (
              <div
                key={index}
                className="relative transform translate-y-0 opacity-100 hover:scale-[1.01] transition-all duration-300 ease-in-out"
              >
                {child}
              </div>
            ))
          : // Show only first 3 cards in stacked mode
            visibleChildren.map((child, index) => (
              <div
                key={index}
                className={`transition-all duration-300 ease-in-out ${
                  index === 0
                    ? "relative z-20 hover:scale-[1.02]"
                    : "absolute top-0 left-0 right-0"
                }`}
                style={
                  index > 0
                    ? {
                        transform: `translateY(${index * 12}px) scale(${
                          1 - index * 0.03
                        })`,
                        zIndex: 20 - index,
                        opacity: Math.max(0.3, 1 - index * 0.2),
                      }
                    : undefined
                }
              >
                {child}
              </div>
            ))}
      </div>
    </div>
  );
};

export default StackedStatsRowCard;
