import { db, storage } from './firebase';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    increment,
    getDocs,
    writeBatch,
    setDoc
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { Participant, ActivityConfig } from '../types';

const PARTICIPANTS_COLLECTION = 'participants';
const CONFIG_COLLECTION = 'config';
const CONFIG_DOC_ID = 'main_config';

export const dataService = {
    // 監聽參賽者資料 (即時更新)
    listenToParticipants: (callback: (participants: Participant[]) => void) => {
        const q = query(collection(db, PARTICIPANTS_COLLECTION), orderBy('timestamp', 'asc'));
        return onSnapshot(q, (snapshot) => {
            const participants = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Participant[];
            callback(participants);
        });
    },

    // 監聽設定檔
    listenToConfig: (callback: (config: ActivityConfig) => void) => {
        return onSnapshot(doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID), (doc) => {
            if (doc.exists()) {
                callback(doc.data() as ActivityConfig);
            } else {
                // 設定默認值
                callback({ isRegistrationOpen: true, isResultsRevealed: false });
            }
        });
    },

    // 新增參賽者 (含圖片上傳)
    // Fix: Omit photoUrl as well since it's passed as 2nd arg
    addParticipant: async (participant: Omit<Participant, 'id' | 'entryNumber' | 'timestamp' | 'votes' | 'photoUrl'>, photoBase64: string) => {
        try {
            // 1. 上傳圖片到 Storage
            const storageRef = ref(storage, `photos/${Date.now()}_${Math.random().toString(36).substring(7)}`);
            await uploadString(storageRef, photoBase64, 'data_url');
            const photoUrl = await getDownloadURL(storageRef);

            // 2. 取得目前數量以產生編號 (Transaction 較嚴謹，但此處簡化直接讀取)
            const snapshot = await getDocs(collection(db, PARTICIPANTS_COLLECTION));
            const entryNumber = snapshot.size + 1;

            // 3. 寫入 Firestore
            await addDoc(collection(db, PARTICIPANTS_COLLECTION), {
                ...participant,
                photoUrl,
                entryNumber,
                votes: 0,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error("Error adding participant: ", error);
            throw error;
        }
    },

    // 投票
    voteForParticipant: async (id: string) => {
        const participantRef = doc(db, PARTICIPANTS_COLLECTION, id);
        await updateDoc(participantRef, {
            votes: increment(1)
        });
    },

    // 更新設定
    updateConfig: async (config: ActivityConfig) => {
        const configRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
        // Fix: use setDoc directly which handles both create and update
        await setDoc(configRef, config);
    },

    // 重置所有資料 (危險操作)
    resetAllData: async () => {
        const batch = writeBatch(db);

        // 刪除所有參賽者
        const snapshot = await getDocs(collection(db, PARTICIPANTS_COLLECTION));
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // 重置設定
        const configRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
        batch.set(configRef, { isRegistrationOpen: true, isResultsRevealed: false });

        await batch.commit();
    }
};
