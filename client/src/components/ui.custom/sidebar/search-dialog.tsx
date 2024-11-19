'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SearchDialogParams {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}
export default function SearchDialog({ isOpen, setOpen }: SearchDialogParams) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();
  const handleSearch = async () => {
    if (!searchQuery) return null;
    if (!router) return null;
    router.replace(`/search/${searchQuery}`);
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex items-start gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground">
          <SearchIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span>Search</span>
          {/* <span className="sr-only">Toggle theme</span> */}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Tìm kiếm</DialogHeader>
        <Textarea
          className="font-medium text-xl"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            console.log(e.target.value);
          }}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSearch()}
          placeholder="Nhập từ khóa tìm kiếm"
        />
        <Button onClick={handleSearch}>Tìm kiếm</Button>
      </DialogContent>
    </Dialog>
  );
}
function useEffect(arg0: () => void, arg1: import('next/router').NextRouter[]) {
  throw new Error('Function not implemented.');
}
