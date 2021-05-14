import
{ IonButton
, IonCheckbox
, IonCol
, IonContent
, IonGrid
, IonHeader
, IonIcon
, IonInput
, IonItem
, IonLabel
, IonList
, IonPage
, IonRow
, IonTitle
, IonToolbar
} from '@ionic/react';
import TodoItem from '../components/TodoItem';

// styling
import './Home.css';

// side effects, state, and persistence
import { useEffect, useState } from 'react';
import { initDefaultStore } from '../storage';
import { Database } from '@ionic/storage';

function genUniqueName(text: string) {
  const n = text.length;
  // using java's hashCode algorithm
  const hashCode = text
    // split into characters
    .split('')
    // calc exponent
    .map((ch, i) => [ch.charCodeAt(0), n - i - 1])
    // sum terms
    .reduce(
      (a, [ch, p]) => a + ch * Math.pow(31, p),
      0,
    );
  const timestamp = Date.now();
  const salt = Math.random();

  return `${timestamp}-${hashCode}-${salt}`;
}

const Home = () => {
  // create and initialize store
  const [store, setStore] = useState<Database | null>(null);
  useEffect(() => { initDefaultStore(setStore); }, []); // do only once

  // provide handle for children to force re-render
  const [updateCount, setUpdateCount] = useState<number>(0);
  const doUpdate = () => setUpdateCount((updateCount + 1) % 10);

  const [names, setNames] = useState<string[]>([]);
  useEffect(() => {
    async function loadNames() {
      setNames(await store.keys());
    }

    if (store !== null) loadNames();
  }, [store, updateCount]);

  // text input for adding new items
  const [text, setText] = useState<string>('');
  const [submittedText, setSubmittedText] = useState<string>('');
  useEffect(() => {
    async function addItem() {
      const name = genUniqueName(text);
      const item = {
        text: submittedText,
        checked: false,
      };
      await store.set(name, item);
    }

    if (submittedText != '') {
      addItem();
      setSubmittedText('');
      setText('');
      doUpdate();
    }
  }, [submittedText]);

  return (
    <IonPage>
      <IonHeader><IonToolbar>
        <div className="toolbar">
          <IonTitle className={"boldwhite big title"}>
            My To Do List
          </IonTitle>
          <IonInput
            value={text}
            onIonChange={e => setText(e.detail.value!)}
            autoCorrect="on"
            clearInput
          >
            <IonButton
              className="boldwhite"
              expand="full"
              onClick={() => setSubmittedText(text)}
              slot="end"
            >
              Add To List
            </IonButton>
          </IonInput>
        </div>
      </IonToolbar></IonHeader>
      <IonContent fullscreen>
        <IonList>
          {names.map((name, i) =>
            <TodoItem
              key={name}
              name={name}
              doParentUpdate={doUpdate}
              color={i % 2 == 0 ? "light" : "dark"}
            />
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
