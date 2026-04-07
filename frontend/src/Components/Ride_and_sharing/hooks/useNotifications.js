import { useEffect, useState } from 'react';
import { getMyNotifications } from '../services/notificationService';
import { onNewNotification } from '../services/trackingService';

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let unsubscribe;

    async function load() {
      try {
        const list = await getMyNotifications();
        setNotifications(list);
      } catch {
        setNotifications([]);
      }
    }

    load();

    unsubscribe = onNewNotification((notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  return {
    notifications,
  };
}
