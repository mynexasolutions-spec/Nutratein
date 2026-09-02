'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminRoute from '@/components/AdminRoute.jsx';

const LINKS = [
  { href: '/admin', label: 'Dashboard', end: true },
  { href: '/admin/homepage', label: 'Homepage Content' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/orders', label: 'Orders' },
];

function isActive(pathname, href, end) {
  if (end) return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <AdminRoute>
      <div className="admin-shell">
        <div className="container admin-container">
          <aside className="admin-sidebar">
            <h3>Admin</h3>
            <nav>
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive(pathname, link.href, link.end) ? 'active' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="admin-content">{children}</div>
        </div>
      </div>
    </AdminRoute>
  );
}
