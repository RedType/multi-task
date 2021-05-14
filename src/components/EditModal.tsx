import
{ IonButton
, IonCol
, IonGrid
, IonRow
, IonTextarea
, IonTitle
} from '@ionic/react';

// styling
import './EditModal.css';

// side effects, state, and persistence
import { useEffect, useState } from 'react';
import { initDefaultStore } from '../storage';
import { Database } from '@ionic/storage';

type Item = {
  text: string,
  checked: boolean,
};

type EditProps = {
  name: string,
  doParentUpdate: () => void,
  finish: () => void,
};

const EditModal = ({ name, doParentUpdate, finish }: EditProps) => {
  // create & init store
  const [store, setStore] = useState<Database | null>(null);
  useEffect(() => { initDefaultStore(setStore); }, []);

  // text input field
  const [text, setText] = useState<string>('');
  const [submittedText, setSubmittedText] = useState<string>('');
  useEffect(() => {
    async function editItem() {
      let item = await store.get(name);
      item.text = submittedText;
      await store.set(name, item);
    }

    if (submittedText != '') {
      editItem();
      doParentUpdate();
      finish();
    }
  }, [submittedText]);

  return (
    <div className="modalBox">
      <IonTitle>Edit Task</IonTitle>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonTextarea
              value={text}
              onIonChange={e => setText(e.detail.value!)}
              autoCorrect="on"
            ></IonTextarea>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton
              onClick={() => setSubmittedText(text)}
            >
              Save
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              onClick={finish}
            >
              Cancel
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default EditModal;
