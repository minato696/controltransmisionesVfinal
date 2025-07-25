'use client';

import { useAuth } from '@/context/AuthContext';
// Eliminar imports no usados: Link, useState

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 flex items-center shadow-md z-20">
      <div className="ml-auto"></div>
    </div>
  );
}