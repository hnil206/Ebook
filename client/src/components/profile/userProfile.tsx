'use client';

import { useRouter } from 'next/router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/string.utils';

interface UserProfileProps {
  username: string;
  avatar: string;
  email: string;
  _id: string;
  
}


const UserProfile: React.FC<UserProfileProps> = ({ username, avatar, email, _id }) => {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push(`/profile/${_id}`); // Redirect to the profile page
  };

  return (
    <div
      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 transition"
      onClick={handleProfileClick}
    >
      <Avatar className="w-12 h-12 border rounded-full">
        <AvatarImage className="rounded-full" src={avatar} />
        <AvatarFallback>{getInitials(username)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-semibold">{username}</span>
        <span className="text-sm text-muted-foreground">{email}</span>
      </div>
    </div>
  );
};

export default UserProfile;