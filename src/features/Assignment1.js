import React, { useState } from 'react';

/**
 * LEARNING GOALS:
 * - Understand how React uses keys for reconciliation
 * - See the impact of improper key usage
 * - Learn when DOM nodes are reused vs recreated
 */

function Assignment1() {
  const [items, setItems] = useState([
    { id: 1, name: 'Apple', color: 'red' },
    { id: 2, name: 'Banana', color: 'yellow' },
    { id: 3, name: 'Cherry', color: 'red' },
  ]);

  const [useProperKeys, setUseProperKeys] = useState(true);

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: prompt('Enter fruit name:') || 'Unknown',
      color: prompt('Enter color:') || 'gray',
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const reorderItems = () => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  };

  const insertAtStart = () => {
    const newItem = {
      id: Date.now(),
      name: 'Strawberry',
      color: 'red',
    };
    setItems([newItem, ...items]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Assignment 1: Virtual DOM & Keys</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={addItem}>Add Item</button>
        <button onClick={insertAtStart}>Insert at Start</button>
        <button onClick={reorderItems}>Reorder Items</button>
        <button onClick={() => setUseProperKeys(!useProperKeys)}>
          Toggle Keys: {useProperKeys ? 'Using ID' : 'Using Index'}
        </button>
      </div>

      <div>
        <h3>Items:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item, index) => (
            <ListItem
              key={useProperKeys ? item.id : index}
              item={item}
              onDelete={removeItem}
            />
          ))}
        </ul>
      </div>

      {/* TASKS FOR YOU: */}
      <div style={{ marginTop: '40px', padding: '20px', background: '#f0f0f0' }}>
        <h3>📝 Tasks:</h3>
        <ol>
          <li>Open React DevTools → Components tab</li>
          <li>Toggle "Highlight updates when components render"</li>
          <li>Try the following with PROPER keys (ID):
            <ul>
              <li>Click "Reorder Items" - Which items re-render?</li>
              <li>Click "Insert at Start" - Which items re-render?</li>
              <li>Delete an item from the middle - What happens?</li>
            </ul>
          </li>
          <li>Now toggle to INDEX keys and repeat the above. What's different?</li>
          <li>Type some text in the input fields, then reorder. What happens to the text?</li>
        </ol>
        
        <h3>🤔 Questions to Answer:</h3>
        <ol>
          <li>Why does using index as key cause problems?</li>
          <li>When is it OK to use index as key?</li>
          <li>What happens to component state when keys change?</li>
          <li>How does React know which DOM nodes to reuse?</li>
        </ol>
      </div>
    </div>
  );
}

function ListItem({ item, onDelete }) {
  const [notes, setNotes] = useState('');
  
  // This console.log helps you see when component re-renders
  console.log('Rendering ListItem:', item.id, item.name);

  return (
    <li style={{
      padding: '10px',
      margin: '5px 0',
      border: '2px solid #ccc',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: item.color,
      }} />
      <span style={{ flex: 1 }}>{item.name}</span>
      <input
        type="text"
        placeholder="Add notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        style={{ padding: '5px' }}
      />
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </li>
  );
}

export default Assignment1;