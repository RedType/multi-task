import
{ IonButton
, IonCheckbox
, IonIcon
, IonItem
, IonLabel
, useIonModal
} from '@ionic/react';
import EditModal from './EditModal';

// styling
import
{ pencil
, trash
} from 'ionicons/icons';
import './TodoItem.css';

// side effects, state, and persistence
import { useEffect, useState } from 'react';
import { initDefaultStore } from '../storage';
import { Database } from '@ionic/storage';

type Item = {
  text: string,
  checked: boolean,
};

type TodoProps = {
  name: string,
  doParentUpdate: () => void,
  color: string,
};

const TodoItem = ({ name, doParentUpdate, color }: TodoProps) => {
  // initialize store
  const [store, setStore] = useState<Database | null>(null);
  useEffect(() => { initDefaultStore(setStore); }, []); // do only once

  // provide handle for edit modal to update this
  const [updateCount, setUpdateCount] = useState<number>(0);
  const doUpdate = () => setUpdateCount((updateCount + 1) % 10);

  // load item data
  const [text, setText] = useState<string>('Loading...');
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
  }, [store, updateCount]);

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

  // edit modal
  const doDismissEditModal = () => dismissEditModal();
  const [presentEditModal, dismissEditModal] = useIonModal(EditModal, {
    name: name,
    currentText: text,
    doParentUpdate: doUpdate,
    finish: doDismissEditModal,
  });

  const showModal = (e: any) => {
    e.stopPropagation();
    presentEditModal({
      cssClass: "modalBox",
    });
  };

  return (
    <IonItem
      key={name}
      className={color}
      button={true}
      onClick={() => setChecked(!checked)}
    >
      <IonCheckbox
        checked={checked}
        color="medium"
        slot="start"
      />
      <IonLabel><span className={checked ? "strike" : ""}>
        {text}
      </span></IonLabel>
      <IonButton
        slot="end"
        fill="clear"
        onClick={showModal}
      >
        <IonIcon slot="icon-only" color="dark" icon={pencil} />
      </IonButton>
      <IonButton
        slot="end"
        fill="clear"
        onClick={(e) => { e.stopPropagation(); setDelet(true); }}
      >
        <IonIcon slot="icon-only" color="dark" icon={trash} />
      </IonButton>
    </IonItem>
  );
};

export default TodoItem;
