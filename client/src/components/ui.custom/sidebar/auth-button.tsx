'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { useAuthFormToggle } from '@/hooks/useAuthFormToggle';
import { getInitials } from '@/utils/string.utils';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { AnimatePresence, motion } from 'framer-motion';
import { signIn, signOut, useSession } from 'next-auth/react';
import  React from 'react';

interface UserAvatarProps {
  username: string;
  avatar: string;
  handleLogout: () => void;
}

export default function AuthButton() {
  const { data: session, status } = useSession();

  return (
    <>
      <AnimatePresence mode="wait">
        {status === 'loading' ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Spinner size="large" />
          </motion.div>
        ) : session?.user ? (
          <motion.div
            key="avatar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <UserAvatar
              username={session.user.name as string}
              avatar={session.user.image as string}
              handleLogout={async () => await signOut()}
            />
          </motion.div>
        ) : (
          <motion.div
            key="auth-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AuthenticateForm />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function UserAvatar({ username, avatar, handleLogout }: UserAvatarProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-[#d14d62] transition-all hover:bg-accent hover:text-accent-foreground">
          <Avatar className="w-8 h-8 border rounded-full">
            <AvatarImage className="rounded-full" src={avatar} />
            <AvatarFallback>{getInitials(username)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="font-semibold">{username}</div>
            <div className="text-sm text-muted-foreground">@{username}</div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right">
        <DropdownMenuItem className="items-center" onClick={handleLogout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AuthenticateForm() {
  const { isOpen, setIsOpen } = useAuthFormToggle();

  const handleGoogleLogin = async () => {
    await signIn('google');
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="w-full flex justify-center">
          <DialogTrigger asChild>
            <Button variant="outline" className="items-center">
              Authenticate
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Authenticate</DialogTitle>
            <DialogDescription>
              Đăng nhập để sử dụng các tính năng của Ebook!!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-center space-y-4 ">
            {/* <Button
              className="bg-indigo-600"
              // onClick={handleDiscordLogin}
            >
              Đăng nhập với Discord
            </Button> */}
            <Button className="bg-red-600" onClick={handleGoogleLogin}>
              Đăng nhập với Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
