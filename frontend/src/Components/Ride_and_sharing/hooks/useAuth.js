import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { joinUserRoom } from '../services/trackingService';

export default function useAuth(withInitialize = false) {
  const auth = useAuthStore();

  useEffect(() => {
    if (withInitialize) {
      auth.initialize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withInitialize]);

  useEffect(() => {
    if (auth.user?.id) {
      joinUserRoom(auth.user.id);
    }
  }, [auth.user?.id]);

  return auth;
}
