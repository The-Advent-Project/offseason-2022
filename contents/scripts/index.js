/* global fitvids */
import './fitvids.js';

/* Fitvids */
fitvids()

/* Open external links in a new tab */
document.querySelectorAll('a[href*="http"]').forEach(link => {
  link.setAttribute('target', '_blank')
})

/* Expandables */
// Find auto-expand container
const autoExpands = document.querySelectorAll('*[data-auto-expand="yes"]');

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function createExpandContainer(expandId = '') {
  const container = document.createElement('div');
  container.setAttribute('data-expandable', expandId)
  container.classList.add('expandable');
  return container;
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

autoExpands.forEach( container => {
  let expandChildren = [], lastHeading = null, i = 0;
  const immediateChildren = container.querySelectorAll(':scope > *');
  immediateChildren.forEach( child => {
    if(child.tagName === "H3") {
      if( ! child.hasAttribute('id') ) {
       child.setAttribute('id', uuidv4() );
      }
      // child.setAttribute( 'data-expand', child.getAttribute('id') );
      if( child !== lastHeading ) {
        if( expandChildren.length > 0 ) {
          // Create expand container, add children to it
          const expandContainer = createExpandContainer( lastHeading.getAttribute('id') );
          expandChildren.forEach( child => { expandContainer.appendChild(child); } )
          insertAfter( expandContainer, lastHeading );          
          expandChildren.length = 0;
        }
        lastHeading = child;
      }
    } else { // not an h3
      if( lastHeading !== null ) {
        expandChildren.push(child);
      }
    }
    if(i + 1 === immediateChildren.length && expandChildren.length > 0) {
      const expandContainer = createExpandContainer( lastHeading.getAttribute('id') );
      expandChildren.forEach( child => { expandContainer.appendChild(child); } )
      insertAfter( expandContainer, lastHeading );          
    }
    i++;
  } );
} )

const expandables = document.querySelectorAll('*[data-expandable]');
expandables.forEach( expandable => {
  const expandName = expandable.getAttribute('data-expandable');
  const expandToggle = document.querySelector('#' + expandName);
  expandToggle.setAttribute('data-expand-toggle', expandName);
  expandToggle.setAttribute('data-expand-state', 'visible');
  if(! expandable.hasAttribute('data-default-expanded') ) {
	expandable.classList.add('hidden');
	expandToggle.setAttribute('data-state', 'hidden');
  }
  expandToggle.addEventListener('click', (e) => {
	 e.preventDefault();
	 doExpandable(expandable, expandToggle)
  } )
} )

function doExpandable(expandable, expandToggle) {
  if( expandable.classList.contains('hidden') ) {
	 expandable.classList.remove('hidden');
	 expandToggle.setAttribute('data-state', 'visible');
  }
  else {
	 expandable.classList.add('hidden');
	 expandToggle.setAttribute('data-state', 'hidden');
  }
}