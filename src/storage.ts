import { Database, Drivers, Storage } from '@ionic/storage';

export const storageSettings = {
  driverOrder: [Drivers.LocalStorage],
};

export async function initDefaultStore(setStore: (store: Database) => void) {
  const store = await new Storage(storageSettings).create();
  setStore(store);
}
