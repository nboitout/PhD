import '../admin.css';
import Link from 'next/link';
import AdminNavLink from '@/components/admin/AdminNavLink';
import BrandMark from '@/components/admin/BrandMark';
import LogoutButton from '@/components/admin/LogoutButton';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm-root">
      <nav className="adm-nav">
        <div className="adm-nav-left">
          <span className="adm-nav-brand">
            <BrandMark />
            Nicolas Boitout
            <span className="adm-nav-brand-tail">Admin</span>
          </span>
          <div className="adm-nav-links">
            <AdminNavLink href="/admin">Overview</AdminNavLink>
            <AdminNavLink href="/admin/visits">Visits</AdminNavLink>
          </div>
        </div>
        <div className="adm-nav-right">
          <Link href="/" className="adm-nav-site-link">&larr; back to site</Link>
          <LogoutButton />
        </div>
      </nav>
      {children}
    </div>
  );
}
