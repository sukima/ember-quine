import config from '../config/environment';
import URI from 'urijs';

export const MESSAGE_TYPE = config.APP.name;

export function normalizeOrigin(url) {
  if (url === '*') { return url; }
  return new URI(url).origin();
}

export function messagerFor(win, targetOrigin = '*') {
  return function(event, data) {
    win.postMessage(
      { type: MESSAGE_TYPE, event, data },
      normalizeOrigin(targetOrigin)
    );
  };
}

export function waitForPostMessage(eventName, { origin, timeout } = {}) {
  return new Promise((resolve, reject) => {
    let timer;

    function resolver({ origin: messageOrigin, data: response }) {
      if (origin && messageOrigin !== normalizeOrigin(origin)) {
        return;
      }
      if (response.type !== MESSAGE_TYPE) {
        return;
      }
      clearTimeout(timer);
      window.removeEventListener('message', resolver);
      if (response.event === 'error') {
        reject(response);
      } else if (!eventName || response.event === eventName) {
        resolve(response);
      }
    }

    window.addEventListener('message', resolver);

    if (timeout) {
      timer = setTimeout(() => {
        window.removeEventListener('message', resolver);
        let error = new Error(`Timeout waiting for postMessage('${eventName}')`);
        error.code = 'ETIMEOUT';
        reject(error);
      }, timeout);
    }
  });
}

export function waiterFor(origin) {
  return function(eventName, options = {}) {
    return waitForPostMessage(eventName, { origin, ...options });
  };
}
