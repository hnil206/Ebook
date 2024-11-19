'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import useEbookStore from '@/hooks/useEbookStore';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Context({
  selection,
  setSelection,
  onHighlight,
  onRemoveHighlight,
  isOpen,
  setIsOpen,
}: // takeNote,
// setTakeNote,
any) {
  const { highlights, color } = useEbookStore();
  // const [textNote, setTextNote] = useState<string>('');

  const [note, setNote] = useState<string>('');
  const [debouncedNote, setDebouncedNote] = useState<string>(note);

  useEffect(() => {
    console.log('chay cai nayf nek');
    if (selection) {
      setNote(selection.takeNote || '');
    }
  }, [selection]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedNote(note);
    }, 300); // Thay đổi thời gian debounce nếu cần

    return () => {
      clearTimeout(handler);
    };
  }, [note]);

  useEffect(() => {
    console.log('sss');
    if (selection) {
      onHighlight(selection.color, debouncedNote); // Gọi onHighlight với debouncedNote
    }
  }, [debouncedNote, selection?.color]);

  if (!selection) return null;

  //khi tắt dialog thì set clear takeNote
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold items-center justify-center">
            Highlight
          </DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardContent className="p-0 pt-4">
            <div className="flex flex-wrap gap-2">
              {color.map((item) => (
                <Button
                  key={item.name}
                  className="w-8 h-8 rounded-full p-0"
                  style={{ backgroundColor: item.code }}
                  onClick={() => {
                    onHighlight(item);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start p-0 pt-4">
            <p className="text-sm text-gray-600 mb-2">
              "{selection.content?.substring(0, 100)}..."
            </p>
            <Textarea
              value={note}
              onChange={(e) => {
                // setSelection({ ...selection, takeNote: e.target.value });
                // console.log('color: ', selection.color);
                // onHighlight(selection.color, e.target.value);
                setNote(e.target.value);
                // console.log('note: ', selection.takeNote);
              }}
              placeholder="Add a note..."
              className="w-full"
            />
            {highlights.find((item) => item.key === selection?.key) && (
              <Button
                variant="destructive"
                size="sm"
                className="mt-2"
                onClick={() => {
                  onRemoveHighlight(selection);
                  setIsOpen(false);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Remove
              </Button>
            )}
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
