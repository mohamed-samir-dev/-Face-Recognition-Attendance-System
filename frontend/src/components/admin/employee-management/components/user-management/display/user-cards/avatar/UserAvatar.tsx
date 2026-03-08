'use client';

import Image from 'next/image';

interface UserAvatarProps {
  image: string;
  name: string;
}

export default function UserAvatar({ image, name }: UserAvatarProps) {
  let displayImage = image;
  try {
    const parsed = JSON.parse(image);
    if (parsed.profileImage) displayImage = parsed.profileImage;
    else if (Array.isArray(parsed)) displayImage = parsed[0];
  } catch {}

  return (
    <Image
      src={displayImage}
      alt={name}
      width={40}
      height={40}
      className="w-10 h-10 rounded-full object-cover"
      unoptimized
    />
  );
}