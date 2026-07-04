import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeToHistory, logHistoryEntry } from "../firebase/firestore";

export function useHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }
    const unsubscribe = subscribeToHistory(user.uid, setHistory);
    return unsubscribe;
  }, [user]);

  const recordPlay = (song) => {
    if (!user || !song) return;
    logHistoryEntry(user.uid, song).catch((err) =>
      console.error("Failed to log history entry:", err)
    );
  };

  return { history, recordPlay };
}
