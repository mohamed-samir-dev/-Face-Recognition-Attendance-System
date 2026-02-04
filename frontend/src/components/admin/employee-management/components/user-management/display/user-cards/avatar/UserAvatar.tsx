'use client';

import Image from 'next/image';

interface UserAvatarProps {
  image: string;
  name: string;
}

export default function UserAvatar({ image, name }: UserAvatarProps) {
  return (
    <Image
      src={image}
      alt={name}
      width={40}
      height={40}
      className="w-10 h-10 rounded-full"
    />
  );
}