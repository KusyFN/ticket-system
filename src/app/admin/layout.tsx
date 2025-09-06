import { cookies } from 'next/headers';
import AuthGuard from '@/components/AuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const isAdminAuthenticated = cookieStore.get('admin_auth')?.value === 'true';

  return (
    <AuthGuard initialAuthenticated={isAdminAuthenticated}>
      {children}
    </AuthGuard>
  );
}