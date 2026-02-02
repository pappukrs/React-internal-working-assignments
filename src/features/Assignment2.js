import React, { useState } from 'react';

/**
 * LEARNING GOALS:
 * - Understand React's automatic batching
 * - See the difference between sync and async updates
 * - Learn how React 18 improves batching
 */

function Assignment2() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [renderCount, setRenderCount] = useState(0);

  // This runs on EVERY render
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  console.log('🎨 Component rendered! Render #', renderCount);

  // Synchronous updates
  const handleSyncClick = () => {
    console.log('--- Sync Click Start ---');
    console.log('Before first update');
    setCount(c => c + 1);
    console.log('After first update');
    
    setText('Sync Updated');
    console.log('After second update');
    
    setCount(c => c + 1);
    console.log('After third update');
    console.log('--- Sync Click End ---');
  };

  // setTimeout (async)
  const handleAsyncClick = () => {
    console.log('--- Async Click Start ---');
    setTimeout(() => {
      console.log('Inside setTimeout');
      setCount(c => c + 1);
      setText('Async Updated');
      setCount(c => c + 1);
      console.log('setTimeout complete');
    }, 100);
    console.log('--- Async Click End ---');
  };

  // Promise (async)
  const handlePromiseClick = async () => {
    console.log('--- Promise Click Start ---');
    await Promise.resolve();
    console.log('After await');
    setCount(c => c + 1);
    setText('Promise Updated');
    console.log('--- Promise Click End ---');
  };

  // Native event handler
  const handleNativeClick = () => {
    console.log('--- Native Event Start ---');
    const button = document.getElementById('native-btn');
    button.addEventListener('click', () => {
      console.log('Native event handler');
      setCount(c => c + 1);
      setText('Native Event');
    }, { once: true });
    button.click();
    console.log('--- Native Event End ---');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Assignment 2: Batching & Update Scheduling</h2>
      
      <div style={{ padding: '20px', background: '#e3f2fd', margin: '20px 0' }}>
        <p><strong>Count:</strong> {count}</p>
        <p><strong>Text:</strong> {text}</p>
        <p><strong>Total Renders:</strong> {renderCount}</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={handleSyncClick}>
          Sync Updates (3 setState calls)
        </button>
        <button onClick={handleAsyncClick}>
          Async Updates (setTimeout)
        </button>
        <button onClick={handlePromiseClick}>
          Promise Updates (async/await)
        </button>
        <button id="native-btn" onClick={handleNativeClick}>
          Native Event
        </button>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#fff3e0' }}>
        <h3>📝 Tasks:</h3>
        <ol>
          <li>Open the browser console</li>
          <li>Click "Sync Updates" - how many renders? Why?</li>
          <li>Click "Async Updates" - how many renders in React 18 vs 17?</li>
          <li>Click "Promise Updates" - is it batched?</li>
          <li>Add more setState calls to each handler - what changes?</li>
        </ol>

        <h3>🤔 Questions:</h3>
        <ol>
          <li>What is automatic batching?</li>
          <li>How did React 18 improve batching?</li>
          <li>When would you want to opt-out of batching?</li>
          <li>What's the performance benefit of batching?</li>
        </ol>

        <h3>💡 Experiment:</h3>
        <p>Try wrapping updates in <code>ReactDOM.flushSync()</code>:</p>
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
{`import { flushSync } from 'react-dom';

const handleClick = () => {
  flushSync(() => {
    setCount(c => c + 1);
  });
  // This forces a render before continuing
  setText('Updated');
};`}
        </pre>
      </div>
    </div>
  );
}

export default Assignment2;