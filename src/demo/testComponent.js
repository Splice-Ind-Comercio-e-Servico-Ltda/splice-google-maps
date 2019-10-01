import React from 'react';

const TestComponent = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <p>Counter {count}</p>
      <button onClick={() => setCount((value) => value + 1)}>Add 1</button>
      <button onClick={() => setCount((value) => value - 1)}>Subtract 1</button>
    </div>
  );
};

export default TestComponent;
