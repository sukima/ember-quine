import maybe from './maybe';

export const DOCUMENT_STORE_AREA_ID = 'document-store-area';

export function encodeStoreData(storeData) {
  return maybe(storeData)
    .bind(data => encodeURIComponent(JSON.stringify(data)));
}

export function decodeStoreData(textData) {
  return maybe(textData)
    .bind(data => JSON.parse(decodeURIComponent(data)));
}

export function createStoreArea(document = window.document) {
  let storeArea = document.createElement('div');
  storeArea.id = DOCUMENT_STORE_AREA_ID;
  storeArea.style.display = 'none';
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
  return document.getElementById(DOCUMENT_STORE_AREA_ID);
}

export function loadStore(storeName, document = window.document) {
  return maybe(getStoreArea(document))
    .bind(() => document.getElementById(storeName))
    .prop('innerHTML')
    .bind(decodeStoreData)
    .value();
}

export function saveStore(storeName, data, document = window.document) {
  let storeArea = maybe(getStoreArea(document))
    .nothing(() => createStoreArea(document))
    .value();
  let store = maybe(document.getElementById(storeName))
    .nothing(() => createStore(storeName, storeArea, document))
    .value();
  store.innerHTML = encodeStoreData(data).value('');
  return store;
}

export function destroyStore(storeName, document = window.document) {
  let storeArea = getStoreArea(document);
  maybe(storeArea)
    .bind(() => document.getElementById(storeName))
    .bind(store => storeArea.removeChild(store));
}

export function loadAll(document = window.document) {
  return maybe(getStoreArea(document))
    .bind(storeArea => [...storeArea.children])
    .bind(nodes => nodes.map(node => [
      node.getAttribute('id'),
      decodeStoreData(node.innerHTML).value()
    ]))
    .bind(storeIterable => new Map(storeIterable))
    .nothing(() => new Map())
    .value();
}

export function destroyAll(document = window.document) {
  maybe(getStoreArea(document))
    .bind(storeArea => document.body.removeChild(storeArea));
}
