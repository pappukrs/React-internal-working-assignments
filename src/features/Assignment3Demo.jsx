import React, { useEffect } from 'react';
import { testMiniVirtualDOM } from './Assignment3';

function Assignment3Demo() {
  useEffect(() => {
    testMiniVirtualDOM();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Assignment 3: Mini Virtual DOM</h2>
      
      <div style={{ padding: '20px', background: '#f5f5f5' }}>
        <h3>Test Area (watch console):</h3>
        <div id="vdom-test"></div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#e8f5e9' }}>
        <h3>📝 Tasks:</h3>
        <ol>
          <li>Open the browser console</li>
          <li>Watch the initial render</li>
          <li>After 2 seconds, see the patches applied</li>
          <li>Improve the diff algorithm to handle keys</li>
          <li>Add support for event handlers</li>
        </ol>

        <h3>🤔 Questions:</h3>
        <ol>
          <li>What's the time complexity of your diff algorithm?</li>
          <li>How would you optimize diffing children?</li>
          <li>Why is a full re-render inefficient?</li>
          <li>How do keys improve reconciliation?</li>
        </ol>

        <h3>🚀 Challenges:</h3>
        <ol>
          <li>Add support for keys in children</li>
          <li>Implement event handler props (onClick, onChange, etc.)</li>
          <li>Add lifecycle hooks (componentDidMount, componentWillUnmount)</li>
          <li>Implement a simple state management system</li>
        </ol>
      </div>
    </div>
  );
}

export default Assignment3Demo;