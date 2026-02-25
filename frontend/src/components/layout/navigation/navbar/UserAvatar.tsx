"use client";

import { DocumentData } from "firebase/firestore";

interface UserAvatarProps {
  user: DocumentData;
  onUserClick: () => void;
}

export default function UserAvatar({ user }: UserAvatarProps) {
  // Check if image is base64 encoding or actual image
  const isBase64Image = user.image?.startsWith('data:image');
  const isEncoding = user.image && !isBase64Image && user.image.length > 100 && !user.image.startsWith('http');
  
  // Use placeholder for encodings
  const displayImage = isEncoding ? '/default-avatar.png' : user.image;
  
  return (
    <img
      src={displayImage}
      alt={user.name}
      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
      onError={(e) => {
        e.currentTarget.src = '/default-avatar.png';
      }}
    />
  );
}