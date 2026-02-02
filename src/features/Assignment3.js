/**
 * LEARNING GOALS:
 * - Understand how Virtual DOM works
 * - Implement basic createElement, render, and diff
 * - See why diffing is more efficient than full re-render
 */

// Step 1: Create Virtual DOM elements
function createElement(type, props, ...children) {
  return {
    type,
    props: props || {},
    children: children.flat().map(child =>
      typeof child === 'object' ? child : createTextElement(child)
    ),
  };
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: { nodeValue: text },
    children: [],
  };
}

// Step 2: Render virtual DOM to actual DOM
function render(vdom, container) {
  // TODO: Implement this function
  // HINTS:
  // 1. Create DOM element based on vdom.type
  // 2. Set properties from vdom.props
  // 3. Recursively render children
  // 4. Append to container
  
  const dom = vdom.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(vdom.type);
  
  // Set properties
  Object.keys(vdom.props)
    .filter(key => key !== 'children')
    .forEach(name => {
      dom[name] = vdom.props[name];
    });
  
  // Render children
  vdom.children.forEach(child => render(child, dom));
  
  container.appendChild(dom);
  return dom;
}

// Step 3: Compare two virtual DOM trees
function diff(oldVdom, newVdom) {
  // TODO: Implement diffing algorithm
  // Return an array of patches:
  // { type: 'CREATE', newNode }
  // { type: 'REMOVE' }
  // { type: 'REPLACE', newNode }
  // { type: 'UPDATE', props }
  
  const patches = [];
  
  // Different types? Replace entire node
  if (!oldVdom) {
    patches.push({ type: 'CREATE', vdom: newVdom });
  } else if (!newVdom) {
    patches.push({ type: 'REMOVE' });
  } else if (oldVdom.type !== newVdom.type) {
    patches.push({ type: 'REPLACE', vdom: newVdom });
  } else if (oldVdom.type === 'TEXT_ELEMENT') {
    // Text changed?
    if (oldVdom.props.nodeValue !== newVdom.props.nodeValue) {
      patches.push({
        type: 'UPDATE_TEXT',
        value: newVdom.props.nodeValue,
      });
    }
  } else {
    // Same type - check props
    const propPatches = diffProps(oldVdom.props, newVdom.props);
    if (propPatches.length > 0) {
      patches.push({ type: 'UPDATE_PROPS', patches: propPatches });
    }
    
    // Diff children
    const childPatches = diffChildren(oldVdom.children, newVdom.children);
    if (childPatches.length > 0) {
      patches.push({ type: 'UPDATE_CHILDREN', patches: childPatches });
    }
  }
  
  return patches;
}

function diffProps(oldProps, newProps) {
  const patches = [];
  
  // Check for removed/changed props
  Object.keys(oldProps).forEach(key => {
    if (!(key in newProps)) {
      patches.push({ type: 'REMOVE_PROP', key });
    } else if (oldProps[key] !== newProps[key]) {
      patches.push({ type: 'SET_PROP', key, value: newProps[key] });
    }
  });
  
  // Check for new props
  Object.keys(newProps).forEach(key => {
    if (!(key in oldProps)) {
      patches.push({ type: 'SET_PROP', key, value: newProps[key] });
    }
  });
  
  return patches;
}

function diffChildren(oldChildren, newChildren) {
  const patches = [];
  const maxLength = Math.max(oldChildren.length, newChildren.length);
  
  for (let i = 0; i < maxLength; i++) {
    patches.push(diff(oldChildren[i], newChildren[i]));
  }
  
  return patches;
}

// Step 4: Apply patches to real DOM
function patch(parent, patches, index = 0) {
  // TODO: Implement patch application
  // This is where you actually update the real DOM
  
  if (!patches || patches.length === 0) return;
  
  const element = parent.childNodes[index];
  
  patches.forEach(p => {
    switch (p.type) {
      case 'CREATE':
        parent.appendChild(render(p.vdom, parent));
        break;
      case 'REMOVE':
        parent.removeChild(element);
        break;
      case 'REPLACE':
        parent.replaceChild(render(p.vdom, parent), element);
        break;
      case 'UPDATE_TEXT':
        element.nodeValue = p.value;
        break;
      case 'UPDATE_PROPS':
        p.patches.forEach(propPatch => {
          if (propPatch.type === 'REMOVE_PROP') {
            element.removeAttribute(propPatch.key);
          } else if (propPatch.type === 'SET_PROP') {
            element[propPatch.key] = propPatch.value;
          }
        });
        break;
      case 'UPDATE_CHILDREN':
        p.patches.forEach((childPatch, i) => {
          patch(element, childPatch, i);
        });
        break;
    }
  });
}

// Test it!
export function testMiniVirtualDOM() {
  const container = document.getElementById('vdom-test');
  
  // Initial render
  const vdom1 = createElement('div', { className: 'container' },
    createElement('h1', null, 'Hello'),
    createElement('p', null, 'World'),
  );
  
  render(vdom1, container);
  console.log('Initial render complete');
  
  // Update after 2 seconds
  setTimeout(() => {
    const vdom2 = createElement('div', { className: 'container active' },
      createElement('h1', null, 'Hello'),
      createElement('p', null, 'React'),
      createElement('span', null, 'New element!'),
    );
    
    const patches = diff(vdom1, vdom2);
    console.log('Patches to apply:', patches);
    patch(container, patches);
    console.log('Update complete');
  }, 2000);
}

// Usage in React component
export default createElement;