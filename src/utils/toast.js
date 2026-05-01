/**
 * Lightweight event-based toast utility.
 * No context needed — works anywhere in the app via subscribe/dispatch.
 */

const listeners = new Set();

function dispatch(type, message, duration = 4000) {
  const toast = { id: Date.now() + Math.random(), type, message, duration };
  listeners.forEach((fn) => fn(toast));
}

export const toast = {
  success: (msg, duration) => dispatch('success', msg, duration),
  error: (msg, duration) => dispatch('error', msg, duration),
  info: (msg, duration) => dispatch('info', msg, duration),
  warning: (msg, duration) => dispatch('warning', msg, duration),
};

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
