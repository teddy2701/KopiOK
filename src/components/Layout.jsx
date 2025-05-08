
import React from 'react';
import Navbar from './Navbar';
/**
 * Layout component wraps pages with a dynamic Navbar
 * Props:
 * - role: 'admin' | 'user'
 * - children: page content
 */
export default function Layout({ role, children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar based on role */}
      <Navbar role={role} />

      {/* Main content area */}
      <main className="flex-grow p-4 bg-gray-100">
        {children}

      </main>
    </div>
  );
}
