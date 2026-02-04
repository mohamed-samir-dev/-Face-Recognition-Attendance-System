'use client';

import Image from 'next/image';

interface UserNameCellProps {
  image: string;
  name: string;
}

export default function UserNameCell({ image, name }: UserNameCellProps) {
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <Image
          src={image}
          alt={name}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full mr-3"
        />
        <div className="text-sm font-medium text-gray-900">
          {name}
        </div>
      </div>
    </td>
  );
}