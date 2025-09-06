import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Redirect to dashboard when accessing /admin
  redirect('/admin/dashboard')
}