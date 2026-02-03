// src/pages/navigation.js

let currentPage = 'home';
let listeners = [];

// Hook to navigate programmatically
export function useNavigate() {
  return (page) => {
    setCurrentPage(page);
  };
}

// Get the current page
export function getCurrentPage() {
  return currentPage;
}

// Listen for page changes
export function onPageChange(listener) {
  if (typeof listener !== 'function') return () => {};
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

// Set the current page manually
export function setCurrentPage(page) {
  currentPage = page;
  listeners.forEach((listener) => {
    try {
      listener(page);
    } catch (err) {
      console.error('Error in page change listener:', err);
    }
  });
}
