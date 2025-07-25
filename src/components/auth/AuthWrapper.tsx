'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const PUBLIC_PATHS = ['/login'];

function AuthWrapperContent({ children }: AuthWrapperProps) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const isPublicPath = PUBLIC_PATHS.includes(pathname);
    
    // Verificar si es la vista del dashboard mediante pathname únicamente
    const isDashboardView = pathname === '/' && typeof window !== 'undefined' && 
      window.location.search.includes('view=dashboard');
    
    if (isDashboardView) {
      setIsChecking(false);
      setShouldRender(true);
      return;
    }
    
    if (!isAuthenticated && !isPublicPath) {
      router.push('/login');
    } else if (isAuthenticated && isPublicPath) {
      router.push('/');
    } else {
      setShouldRender(true);
    }
    
    setIsChecking(false);
  }, [isAuthenticated, isInitialized, pathname, router]);

  if (!isInitialized || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return shouldRender ? <>{children}</> : (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redireccionando...</p>
      </div>
    </div>
  );
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <AuthWrapperContent>{children}</AuthWrapperContent>
    </Suspense>
  );
}