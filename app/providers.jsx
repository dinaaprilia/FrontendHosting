'use client';

import { SessionProvider } from 'next-auth/react';
import { UserProvider } from '@/hooks/UserContext'; // ✅ pastikan path sesuai

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </SessionProvider>
  );
}
