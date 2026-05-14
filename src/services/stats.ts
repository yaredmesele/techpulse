import { doc, getDoc, setDoc, increment, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function incrementViewCount(blogId: string) {
  const statsRef = doc(db, 'blog_stats', blogId);
  try {
    const docSnap = await getDoc(statsRef);
    if (!docSnap.exists()) {
      await setDoc(statsRef, {
        views: 1,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(statsRef, {
        views: increment(1),
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `blog_stats/${blogId}`);
  }
}

export function subscribeToViewCount(blogId: string, callback: (count: number) => void) {
  const statsRef = doc(db, 'blog_stats', blogId);
  return onSnapshot(statsRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().views || 0);
    } else {
      callback(0);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, `blog_stats/${blogId}`);
  });
}
