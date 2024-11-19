const TotalCalls = async () => {
  await fetch("https://jsonplaceholder.typicode.com/todos");

  return (
    <div className="page" id="totalCalls">
      <div className="border-gray-200 bg-white shadow-md p-4 border rounded">
        <p>Total Calls</p>
      </div>
    </div>
  );
};

export default TotalCalls;
