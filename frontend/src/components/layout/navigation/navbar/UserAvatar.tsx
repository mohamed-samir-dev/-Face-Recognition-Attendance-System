"use client";

import Image from "next/image";
import { DocumentData } from "firebase/firestore";

interface UserAvatarProps {
  user: DocumentData;
  onUserClick: () => void;
}

export default function UserAvatar({ user, onUserClick }: UserAvatarProps) {
  return (
    <Image
      src={user.image}
      alt={user.name}
      width={40}
      height={40}
      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover cursor-pointer"
      unoptimized
      onClick={onUserClick}
    />
  );
}