"use client";

interface UserAvatarProps {
  image?: string | null;
}

export default function UserAvatar({ image }: UserAvatarProps) {
  const imageUrl = image ?? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

  return (
    <div className="btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full">
        <img
          alt="User Profile"
          src={imageUrl}
        />
      </div>
      
    </div>
  );
}