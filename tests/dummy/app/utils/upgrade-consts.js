export const EVENTS = Object.freeze({
  READY: 'ready',
  LOAD_DATA: 'load-data',
  DOWNLOAD: 'download',
  COMPLETED: 'completed'
});

export const EVENT_TIMEOUTS = Object.freeze({
  [EVENTS.READY]: 5000,
  [EVENTS.LOAD_DATA]: 500,
  [EVENTS.DOWNLOAD]: 2000
});

