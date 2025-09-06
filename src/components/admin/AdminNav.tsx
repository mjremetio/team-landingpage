'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileText, 
  Settings,
  LogOut,
  Menu
} from 'lucide-react'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { name: 'Sections', href: '/admin/sections', icon: FileText },
]

export function AdminNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const NavItems = ({ className = '' }: { className?: string }) => (
    <nav className={`space-y-1 ${className}`}>
      {navigation.map((item) => {
        const isActive = pathname?.startsWith(item.href)
        const Icon = item.icon
        
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={`
              flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }
            `}
          >
            <Icon className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:border-r md:bg-background">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          
          <div className="flex flex-col flex-grow mt-8">
            <NavItems className="px-3" />
          </div>
          
          <div className="flex-shrink-0 p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <Avatar className="w-8 h-8 mr-3">
                    <AvatarImage src={session?.user?.image || ''} />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">{session?.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={session?.user?.image || ''} />
                  <AvatarFallback className="text-xs">
                    {session?.user?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Navigation</h2>
                </div>
                <NavItems className="p-4" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Content spacer for desktop */}
      <div className="hidden md:block md:w-64 md:flex-shrink-0" aria-hidden="true" />
    </>
  )
}