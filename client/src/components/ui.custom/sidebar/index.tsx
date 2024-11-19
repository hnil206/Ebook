'use client';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { HomeIcon, MenuIcon, ShoppingCartIcon, UserIcon, UsersIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ThemeMode } from '../ThemeMode';
import AuthButton from './auth-button';
import SearchDialog from './search-dialog';
export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true); // Mở sidebar khi màn hình lớn hơn breakpoint 'lg'
      } else {
        setIsOpen(false); // Đóng sidebar khi màn hình nhỏ hơn breakpoint 'lg'
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <>
      <div className="flex flex-col h-full min-h-screen">
        {!isOpen && (
          <button
            className="lg:hidden p-4 fixed top-4 left-4 z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        )}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={cn(
            'lg:block fixed lg:static inset-0 lg:inset-auto z-40 bg-mainbackground border-r h-full',
            isOpen ? 'block' : 'hidden',
            'w-[280px] lg:static lg:translate-x-0',
          )}
        >
          <button
            className="absolute top-4 right-4 lg:hidden p-2 z-50"
            onClick={() => setIsOpen(false)}
          >
            <XIcon className="h-6 w-6" />
          </button>
          <div className="flex flex-col h-full">
            <div className="flex h-[120px] items-center border-b px-6">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold text-mainforeground flex-row"
                prefetch={false}
              >
                {/* <BookIcon className="h-16 w-16" /> */}
                <img
                  src="/logo.png"
                  className="w-24 h-24 rounded-full dark:invert bg-transparent"
                />
                <span className="text-lg text-balance">Ebook platform</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <HomeIcon className="h-4 w-4" />
                  Home
                </Link>
                <Link
                  href="/community"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <UsersIcon className="h-4 w-4" />
                  Community
                </Link>
                <Link
                  href="/user"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <UserIcon className="h-4 w-4" />
                  Account Management
                </Link>
                
                <SearchDialog isOpen={isOpenSearch} setOpen={setIsOpenSearch} />
                <Link href="/shop" className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground">
                  <ShoppingCartIcon className="h-4 w-4" />
                  Shop
                </Link>
                <ThemeMode />
              </nav>
            </div>
            <div className="sticky bottom-0 w-full">
              <Separator className="my-2" />
              <div className="h-16 mb-2">
                <AuthButton />
              </div>
            </div>
          </div>
        </motion.div>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-80 lg:hidden w-[280px]"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
      </div>
    </>
  );
}
export function SideBarFull() {
  return (
    <div className="hidden border-r bg-mainbackground lg:block h-full">
      <div className="flex h-screen max-h-full flex-col gap-2 sticky top-1">
        <div className="flex h-[80px] items-center border-b px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-mainforeground"
            prefetch={false}
          >
            <img src="/logo.png" className="w-16 h-16" />
            <span className="text-lg">Ebook</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="self-start grid items-start px-4 text-sm font-medium">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground"
              prefetch={false}
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/community"
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground"
              prefetch={false}
            >
              <UsersIcon className="h-4 w-4" />
              Community
            </Link>
            <Link
              href="/user"
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground"
              prefetch={false}
            >
              <UserIcon className="h-4 w-4" />
              Account Management
            </Link>
            <ThemeMode />
          </nav>
        </div>
        <div className="">
          <Separator className="my-2" />
          <div className="h-16 mb-2">
            <AuthButton />
          </div>
        </div>
      </div>
    </div>
  );
}
