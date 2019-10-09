import maybe from './maybe';

export const DOCUMENT_STORE_AREA_ID = 'document-store-area';

export function createStoreArea(document = window.document) {
  let storeArea = document.createElement('div');
  storeArea.id = DOCUMENT_STORE_AREA_ID;
  document.body.appendChild(storeArea);
  return storeArea;
}

export function createStore(storeName, storeArea, document = window.document) {
  let store = document.createElement('div');
  store.id = storeName;
  storeArea.appendChild(store);
  return store;
}

export function getStoreArea(document = window.document) {
  return document.body.getElementById(DOCUMENT_STORE_AREA_ID);
}

export function loadStore(storeName, document = window.document) {
  return maybe(getStoreArea(document))
    .bind(storeArea => storeArea.getElementById(storeName))
    .prop('innerHTML')
    .bind(data => JSON.parse(decodeURIComponent(data)))
    .value();
}

export function saveStore(storeName, data, document = window.document) {
  let storeArea = maybe(getStoreArea(document))
    .nothing(() => createStoreArea(document))
    .value();
  let store = maybe(storeArea.getElementById(storeName))
    .nothing(() => createStore(storeName, storeArea, document))
    .value();
  store.innerHTML = encodeURIComponent(JSON.stringify(data));
  return store;
}

export function destroyStore(storeName, document = window.document) {
  let storeArea = getStoreArea(document);
  maybe(storeArea)
    .bind(() => storeArea.getElementById(storeName))
    .bind(store => storeArea.removeChild(store));
}

export function destroyAll(document = window.document) {
  maybe(getStoreArea(document))
    .bind(storeArea => document.body.removeChild(storeArea));
}
