'use client';

import Image from 'next/image';

interface UserNameCellProps {
  image: string;
  name: string;
}

export default function UserNameCell({ image, name }: UserNameCellProps) {
  // Extract profile image if it's a JSON object from camera capture
  let displayImage = image;
  try {
    const parsed = JSON.parse(image);
    if (parsed.profileImage) {
      displayImage = parsed.profileImage;
    } else if (Array.isArray(parsed)) {
      displayImage = parsed[0];
    }
  } catch {
    // Not JSON, use as-is
  }

  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <Image
          src={displayImage}
          alt={name}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full mr-3 object-cover flex-shrink-0"
          unoptimized
        />
        <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
          {name}
        </div>
      </div>
    </td>
  );
}