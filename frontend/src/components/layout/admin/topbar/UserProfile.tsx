"use client";

import Image from "next/image";
import { User } from "@/lib/types";

interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  return (
    <Image
      src={user.image.trimEnd()}
      alt={user.name}
      width={32}
      height={32}
      className="w-8 h-8 rounded-full cursor-pointer flex-shrink-0"
      onClick={onLogout}
    />
  );
}