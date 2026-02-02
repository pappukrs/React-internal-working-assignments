import React, { useState, memo, useCallback, useMemo } from 'react';

/**
 * LEARNING GOALS:
 * - Understand when components re-render
 * - Learn to use React.memo effectively
 * - Master useCallback and useMemo
 */

// Version 1: Regular component (always re-renders)
function ListItemRegular({ item, onDelete, onEdit }) {
  console.log('🔴 ListItemRegular rendered:', item.id);
  
  return (
    <div style={{ 
      padding: '10px', 
      border: '2px solid red', 
      margin: '5px',
      borderRadius: '5px'
    }}>
      <span>{item.name}</span>
      <button onClick={() => onEdit(item.id, prompt('New name:'))}>Edit</button>
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  );
}

// Version 2: Memo'd component (only re-renders if props change)
const ListItemMemo = memo(function ListItemMemo({ item, onDelete, onEdit }) {
  console.log('🟢 ListItemMemo rendered:', item.id);
  
  return (
    <div style={{ 
      padding: '10px', 
      border: '2px solid green', 
      margin: '5px',
      borderRadius: '5px'
    }}>
      <span>{item.name}</span>
      <button onClick={() => onEdit(item.id, prompt('New name:'))}>Edit</button>
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  );
});

function Assignment5() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', category: 'A' },
    { id: 2, name: 'Item 2', category: 'B' },
    { id: 3, name: 'Item 3', category: 'A' },
    { id: 4, name: 'Item 4', category: 'C' },
  ]);
  
  const [filter, setFilter] = useState('');
  const [useOptimized, setUseOptimized] = useState(false);
  const [counter, setCounter] = useState(0);

  console.log('\n=== 🎨 PARENT COMPONENT RENDERED ===');

  // ❌ BAD: New function on every render
  const deleteItemBad = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // ✅ GOOD: Memoized function
  const deleteItemGood = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []); // No dependencies = function never changes

  // ❌ BAD: New function on every render
  const editItemBad = (id, newName) => {
    if (!newName) return;
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, name: newName } : item
    ));
  };

  // ✅ GOOD: Memoized function
  const editItemGood = useCallback((id, newName) => {
    if (!newName) return;
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, name: newName } : item
    ));
  }, []);

  // ❌ BAD: Recalculated on every render
  const filteredItemsBad = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  // ✅ GOOD: Only recalculated when dependencies change
  const filteredItemsGood = useMemo(() => {
    console.log('💭 useMemo: Filtering items...');
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  const addItem = () => {
    setItems(prev => [...prev, {
      id: Date.now(),
      name: `Item ${prev.length + 1}`,
      category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
    }]);
  };

  const ItemComponent = useOptimized ? ListItemMemo : ListItemRegular;
  const deleteHandler = useOptimized ? deleteItemGood : deleteItemBad;
  const editHandler = useOptimized ? editItemGood : editItemBad;
  const filteredItems = useOptimized ? filteredItemsGood : filteredItemsBad;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Assignment 5: Reconciliation Performance</h2>
      
      <div style={{ padding: '20px', background: '#e3f2fd', margin: '20px 0' }}>
        <p><strong>Mode:</strong> {useOptimized ? '🟢 OPTIMIZED' : '🔴 UNOPTIMIZED'}</p>
        <p><strong>Total Items:</strong> {items.length}</p>
        <p><strong>Filtered Items:</strong> {filteredItems.length}</p>
        <p><strong>Counter:</strong> {counter}</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => setUseOptimized(!useOptimized)}>
          Toggle: {useOptimized ? 'Optimized ✅' : 'Unoptimized ❌'}
        </button>
        <button onClick={addItem}>Add Item</button>
        <button onClick={() => setCounter(c => c + 1)}>
          Increment Counter (doesn't affect list)
        </button>
      </div>

      <input
        type="text"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter items..."
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />

      <div>
        {/* <h3>Items ({useOptimized ? 'Green = memo'd' : 'Red = regular'}):</h3> */}
        {filteredItems.map(item => (
          <ItemComponent
            key={item.id}
            item={item}
            onDelete={deleteHandler}
            onEdit={editHandler}
          />
        ))}
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#fff3e0' }}>
        <h3>📝 Tasks:</h3>
        <ol>
          <li>Clear console and click "Increment Counter" in UNOPTIMIZED mode
            <br/>→ All items re-render even though they didn't change!
          </li>
          <li>Switch to OPTIMIZED mode and click "Increment Counter"
            <br/>→ No items re-render! 🎉
          </li>
          <li>Type in the filter input in both modes
            <br/>→ What's different?
          </li>
          <li>Try deleting/editing items in both modes
            <br/>→ Why do memo'd items still re-render in unoptimized mode?
          </li>
        </ol>

        <h3>🤔 Questions:</h3>
        <ol>
          <li>Why does memo not work without useCallback?</li>
          <li>When should you use React.memo?</li>
          <li>What's the cost of using memo everywhere?</li>
          <li>How does React compare props in memo?</li>
          <li>What's the difference between useMemo and useCallback?</li>
        </ol>

        <h3>🚀 Bonus Challenge:</h3>
        <p>Open React DevTools → Profiler tab:</p>
        <ol>
          <li>Click "Start Profiling"</li>
          <li>Click "Increment Counter" a few times</li>
          <li>Click "Stop Profiling"</li>
          <li>Compare flame graphs between optimized/unoptimized</li>
        </ol>
      </div>
    </div>
  );
}

export default Assignment5;