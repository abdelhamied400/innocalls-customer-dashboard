"use client";

import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";

const Test = () => {
  return (
    <div className="page" id="test">
      <h1 className="text-2xl font-bold">Test Page</h1>
      <p>This is a test page to verify locale handling.</p>
      <FilterBar onClear={() => console.log("Clear filters")}>
        <FilterBox
          triggerLabel="Filter 1"
          label="Filter 1 Options"
          onApply={() => console.log("Filter 1 applied")}
          onReset={() => console.log("Filter 1 reset")}
        >
          <p>test</p>
        </FilterBox>
      </FilterBar>
    </div>
  );
};

export default Test;
