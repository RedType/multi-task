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
import { useEffect, useState } from 'react';

const storageSettings = {
  driverOrder: [Drivers.LocalStorage],
}

type Item = {
  text: string,
  checked: boolean,
};

interface TodoProps {
  name: string,
};

const TodoItem = ({ name }: TodoProps) => {
  // initialize store
  const [store, setStore] = useState<Database | null>(null);
  useEffect(() => {
    async function initStore() {
      const store = await new Storage(storageSettings).create();
      setStore(store);
      console.log("Initialized store");
    }

    initStore();
  }, []); // do only once

  // load item data
  const [text, setText] = useState<string>("Loading...");
  const [checked, setChecked] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  useEffect(() => {
    async function loadItem() {
      if (store === null) {
        console.log("Store not yet initialized");
        return;
      }
      const item: Item = await store.get(name);
      setText(item.text);
      setChecked(item.checked);
      setInitialized(true); // to prevent store.set()s before we want them
    }

    loadItem();
  }, [store]);

  // persist data
  useEffect(() => {
    async function updateItem() {
      if (!initialized) return;
      const item = {
        text: text,
        checked: checked,
      };
      await store.set(name, item);
    }

    updateItem();
  }, [checked, text, initialized]);

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
      <IonButton slot="end" fill="clear">
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
      await store.clear();
      setStore(store);

      //FIXME temporary test entries
      await Promise.all(
      [ store.set('test1', {
          text: 'Begin writing todo list',
          checked: true,
        })
      , store.set('test2', {
          text: 'Make a million dollars',
          checked: false,
        })
      , store.set('test3', {
          text: 'Take over the world',
          checked: false,
        })
      , store.set('test4', {
          text: 'Drink coffee',
          checked: true,
        })
      , store.set('test5', {
          text: 'Another one!',
          checked: false,
        })
      ]);
    }

    initStore();
  }, []); // empty means run once only

  const [names, setNames] = useState<string[]>([]);
  useEffect(() => {
    async function loadNames() {
      if (store === null) {
        console.log('Store not yet initialized');
        return;
      }
      setNames(await store.keys());
    }

    loadNames();
  }, [store]);

  return (
    <IonPage>
      <IonHeader>
        <IonTitle>My To Do List</IonTitle>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {names.map(name => <TodoItem name={name} />)}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
