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
import { Database, Storage } from '@ionic/storage';
import { useEffect, useState } from 'react';

type Item = {
  text: string,
  checked: boolean,
};

const TodoItem = ({ key }: { key: string }) => {
  //FIXME WHY IS key UNDEFINED????

  // initialize store
  const [store, setStore] = useState<Database | null>(null);
  useEffect(() => {
    async function initStore() {
      const store = await new Storage().create();
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
      const item: Item = await store.get(key);
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
      await store.set(key, item);
    }

    updateItem();
  }, [checked, text, initialized]);

  const strike = checked ? {
    textDecoration: "line-through",
  } : {};

  return (
    <IonItem>
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
      const store = await new Storage().create();
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

  const [keys, setKeys] = useState<string[]>([]);
  useEffect(() => {
    async function loadKeys() {
      if (store === null) {
        console.log('Store not yet initialized');
        return;
      }
      setKeys(await store.keys());
    }

    loadKeys();
  }, [store]);

  return (
    <IonPage>
      <IonHeader>
        <IonTitle>My To Do List</IonTitle>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {keys.map(mikey => <TodoItem key={mikey} />)}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
