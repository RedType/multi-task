import
{ IonButton
, IonCheckbox
, IonContent
, IonHeader
, IonIcon
, IonItem
, IonLabel
, IonList
, IonPage
, IonTitle
, IonToolbar
} from '@ionic/react';
import
{ pencil
, trash
} from "ionicons/icons";
import './Home.css';

/* side effects, state, and persistence */
import { Database, Drivers, Storage } from '@ionic/storage';
import { useEffect, useReducer, useState } from 'react';

const storageSettings = {
  driverOrder: [Drivers.LocalStorage],
}

type Item = {
  text: string,
  checked: boolean,
};

type TodoProps = {
  name: string,
  doParentUpdate: () => void,
};

const TodoItem = ({ name, doParentUpdate }: TodoProps) => {
  // initialize store
  const [store, setStore] = useState<Database | null>(null);
  useEffect(() => {
    async function initStore() {
      const store = await new Storage(storageSettings).create();
      setStore(store);
    }

    initStore();
  }, []); // do only once

  // load item data
  const [text, setText] = useState<string>("Loading...");
  const [checked, setChecked] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  useEffect(() => {
    async function loadItem() {
      const item: Item = await store.get(name);
      setText(item.text);
      setChecked(item.checked);
      setInitialized(true); // to prevent store.set()s before we want them
    }

    if (store !== null) loadItem();
  }, [store]);

  // persist data
  useEffect(() => {
    async function updateItem() {
      const item = {
        text: text,
        checked: checked,
      };
      await store.set(name, item);
    }

    if (initialized) updateItem();
  }, [checked, text, initialized]);

  // remove self
  const [delet, setDelet] = useState<boolean>(false);
  useEffect(() => {
    async function removeSelf() {
      await store.remove(name);
      doParentUpdate();
    }

    if (delet) removeSelf();
  }, [delet]);

  const strike = checked ? {
    textDecoration: "line-through",
  } : {};

  return (
    <IonItem key={name}>
      <IonCheckbox
        checked={checked}
        onIonChange={e => setChecked(e.detail.checked)}
        slot="start"
      />
      <IonLabel><span style={strike}>{text}</span></IonLabel>
      <IonButton slot="end" fill="clear">
        <IonIcon slot="icon-only" icon={pencil} />
      </IonButton>
      <IonButton slot="end" fill="clear" onClick={() => setDelet(true)}>
        <IonIcon slot="icon-only" icon={trash} />
      </IonButton>
    </IonItem>
  );
};

const Home = () => {
  // create and initialize store
  const [store, setStore] = useState<Database | null>(null);
  useEffect(() => {
    async function initStore() {
      const store = await new Storage(storageSettings).create();
      setStore(store);

      //FIXME temporary test entries
      if (true) await Promise.all(
      [ store.set('begin', {
          text: 'Begin writing todo list',
          checked: true,
        })
      , store.set('a million', {
          text: 'Make a million dollars',
          checked: false,
        })
      , store.set('take over', {
          text: 'Take over the world',
          checked: false,
        })
      , store.set('coffee', {
          text: 'Drink coffee',
          checked: true,
        })
      , store.set('another', {
          text: 'Another one!',
          checked: false,
        })
      ]);
    }

    initStore();
  }, []); // empty means run once only

  const [names, setNames] = useState<string[]>([]);
  const [updateCount, setUpdateCount] = useState<number>(0);
  useEffect(() => {
    async function loadNames() {
      setNames(await store.keys());
    }

    if (store !== null) loadNames();
  }, [store, updateCount]);

  const doUpdate = () => {
    setUpdateCount((updateCount + 1) % 10);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonTitle>My To Do List</IonTitle>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {names.map(name => <TodoItem key={name} name={name} doParentUpdate={doUpdate} />)}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
