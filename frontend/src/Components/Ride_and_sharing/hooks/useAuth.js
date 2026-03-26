import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { joinUserRoom } from '../services/trackingService';

export default function useAuth() {
  const auth = useAuthStore();

  useEffect(() => {
    auth.initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (auth.user?.id) {
      joinUserRoom(auth.user.id);
    }
  }, [auth.user?.id]);

  return auth;
}
