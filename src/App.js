import Assignment1 from './features/Assignment1';
import Assignment2 from './features/Assignment2';
import Assignment3Demo from './features/Assignment3Demo';
import Assignment4 from './features/Assignment4';
import Assignment5 from './features/Assignment5';


import { useState } from 'react';

function App() {
  const [currentAssignment, setCurrentAssignment] = useState(1);

  const assignments = {
    1: <Assignment1 />,
    2: <Assignment2 />,
    3: <Assignment3Demo />,
    4: <Assignment4 />,
    5: <Assignment5 />,
  };

  return (
    <div>
      <nav style={{ padding: '20px', background: '#333', color: 'white' }}>
        <h1>React Internals Assignments</h1>
        {[1, 2, 3, 4, 5].map(num => (
          <button
            key={num}
            onClick={() => setCurrentAssignment(num)}
            style={{
              margin: '5px',
              padding: '10px',
              background: currentAssignment === num ? '#4CAF50' : '#666',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Assignment {num}
          </button>
        ))}
      </nav>
      {assignments[currentAssignment]}
    </div>
  );
}

export default App;