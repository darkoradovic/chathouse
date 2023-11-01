export const avatarImages: any = [
  "/images/avatars/1.png",
  "/images/avatars/2.png",
  "/images/avatars/3.png",
  "/images/avatars/4.png",
  "/images/avatars/5.png",
  "/images/avatars/6.png",
  "/images/avatars/7.png",
  "/images/avatars/8.png",
];

export const randomAvatars = () => {
  return avatarImages[Math.floor(Math.random() * avatarImages.length)];
};
