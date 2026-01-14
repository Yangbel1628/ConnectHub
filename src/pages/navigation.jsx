// src/pages/navigation.js

// List of valid pages
let currentPage = 'home';
let listeners = [];

// Hook to navigate programmatically
export function useNavigate() {
  return (page) => {
    currentPage = page;
    listeners.forEach((listener) => listener(page));
  };
}

// Get the current page
export function getCurrentPage() {
  return currentPage;
}

// Listen for page changes
export function onPageChange(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

// Set the current page manually
export function setCurrentPage(page) {
  currentPage = page;
  listeners.forEach((listener) => listener(page));
}