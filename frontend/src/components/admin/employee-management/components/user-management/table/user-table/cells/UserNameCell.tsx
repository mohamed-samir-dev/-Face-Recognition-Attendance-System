'use client';

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
        <img
          src={displayImage}
          alt={name}
          className="w-8 h-8 rounded-full mr-3 object-cover"
        />
        <div className="text-sm font-medium text-gray-900">
          {name}
        </div>
      </div>
    </td>
  );
}