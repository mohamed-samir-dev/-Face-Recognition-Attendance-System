import Image from "next/image";

interface ProfileImageProps {
  image: string;
  name: string;
}

export default function ProfileImage({ image, name }: ProfileImageProps) {
  return (
    <div className="relative flex justify-center sm:justify-start">
      <Image
        src={image}
        alt={name}
        width={120}
        height={120}
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full object-cover ring-4 ring-blue-100 shadow-lg"
        unoptimized
      />
    </div>
  );
}