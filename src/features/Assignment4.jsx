import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

/**
 * LEARNING GOALS:
 * - Understand hook execution order
 * - Learn when effects run vs when renders happen
 * - See the difference between useEffect and useLayoutEffect
 */

let globalRenderCount = 0;

function Assignment4() {
  console.log('\n=== 🎯 RENDER PHASE START ===');
  console.log('Render #', ++globalRenderCount);

  // Hook 1: useState with initializer
  const [count, setCount] = useState(() => {
    console.log('  📦 useState(count) initializer runs');
    return 0;
  });
  console.log('  ✓ useState(count) hook called, value:', count);

  // Hook 2: useState with initializer
  const [name, setName] = useState(() => {
    console.log('  📦 useState(name) initializer runs');
    return 'John';
  });
  console.log('  ✓ useState(name) hook called, value:', name);

  // Hook 3: useRef
  const renderCountRef = useRef(0);
  renderCountRef.current++;
  console.log('  ✓ useRef hook called, renders:', renderCountRef.current);

  // Hook 4: useLayoutEffect (no dependencies)
  useLayoutEffect(() => {
    console.log('  🎨 useLayoutEffect (no deps) - RUNS SYNCHRONOUSLY BEFORE PAINT');
    return () => {
      console.log('  🧹 useLayoutEffect (no deps) - CLEANUP');
    };
  });

  // Hook 5: useLayoutEffect (mount only)
  useLayoutEffect(() => {
    console.log('  🎨 useLayoutEffect (mount) - RUNS ONCE');
    return () => {
      console.log('  🧹 useLayoutEffect (mount) - CLEANUP ON UNMOUNT');
    };
  }, []);

  // Hook 6: useEffect (mount only)
  useEffect(() => {
    console.log('  ⚡ useEffect (mount) - RUNS AFTER PAINT');
    return () => {
      console.log('  🧹 useEffect (mount) - CLEANUP ON UNMOUNT');
    };
  }, []);

  // Hook 7: useEffect (every render)
  useEffect(() => {
    console.log('  ⚡ useEffect (every render)');
    return () => {
      console.log('  🧹 useEffect (every render) - CLEANUP');
    };
  });

  // Hook 8: useEffect (count dependency)
  useEffect(() => {
    console.log('  ⚡ useEffect (count dep) - count is', count);
    return () => {
      console.log('  🧹 useEffect (count dep) - CLEANUP, count was', count);
    };
  }, [count]);

  // Hook 9: useEffect (name dependency)
  useEffect(() => {
    console.log('  ⚡ useEffect (name dep) - name is', name);
    return () => {
      console.log('  🧹 useEffect (name dep) - CLEANUP, name was', name);
    };
  }, [name]);

  console.log('=== 🎯 RENDER PHASE END ===\n');

  return (
    <div style={{ padding: '20px' }}>
      <h2>Assignment 4: Hooks Execution Order</h2>
      
      <div style={{ padding: '20px', background: '#e3f2fd', margin: '20px 0' }}>
        <p><strong>Count:</strong> {count}</p>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Component Renders:</strong> {renderCountRef.current}</p>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setCount(c => c + 1)}>
          Increment Count
        </button>
        <button onClick={() => setName(name === 'John' ? 'Jane' : 'John')}>
          Toggle Name
        </button>
        <button onClick={() => {
          setCount(c => c + 1);
          setName(name === 'John' ? 'Jane' : 'John');
        }}>
          Update Both (Batched)
        </button>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#fff3e0' }}>
        <h3>📝 Tasks:</h3>
        <ol>
          <li>Open browser console and clear it</li>
          <li>Refresh the page - observe INITIAL MOUNT sequence</li>
          <li>Click "Increment Count" - which effects run?</li>
          <li>Click "Toggle Name" - which effects run?</li>
          <li>Click "Update Both" - are updates batched?</li>
        </ol>

        <h3>🤔 Questions:</h3>
        <ol>
          <li>What's the order: render → layoutEffect → paint → effect?</li>
          <li>When do cleanup functions run?</li>
          <li>Why do useState initializers only run once?</li>
          <li>What happens if you add a conditional hook?</li>
          <li>When should you use useLayoutEffect vs useEffect?</li>
        </ol>

        <h3>💡 Experiment:</h3>
        <p>Try adding this AFTER the other hooks (it will break!):</p>
        <pre style={{ background: '#ffebee', padding: '10px' }}>
{`// ❌ This breaks the rules of hooks!
if (count > 5) {
  const [extra, setExtra] = useState(0);
}`}
        </pre>
        <p>What error do you get? Why?</p>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: '#e8f5e9' }}>
        <h3>🧠 Mental Model:</h3>
        <pre style={{ background: '#f5f5f5', padding: '15px' }}>
{`1. RENDER PHASE (can be interrupted)
   ├─ Call function component
   ├─ Execute useState hooks (get current state)
   ├─ Execute useRef hooks
   ├─ Return JSX
   └─ Build new Fiber tree

2. COMMIT PHASE (synchronous)
   ├─ Run useLayoutEffect cleanups
   ├─ Run useLayoutEffect effects
   ├─ Update DOM
   ├─ Browser paints screen
   └─ (Later) Run useEffect cleanups & effects`}
        </pre>
      </div>
    </div>
  );
}

export default Assignment4;