import { ReactFlow, Background, Controls } from "@xyflow/react";
const edges = [{ id: "1-2", source: "1", target: "2" }];

const nodes = [
  {
    id: "1",
    data: { label: "Hello" },
    position: { x: 100, y: 100 },
    type: "input",
  },
  {
    id: "2",
    data: { label: "World" },
    position: { x: 200, y: 200 },
  },
];

const Flow = () => {
  return (
    <div className="h-[calc(100vh-200px)]">
      <ReactFlow nodes={nodes} edges={edges}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Flow;
