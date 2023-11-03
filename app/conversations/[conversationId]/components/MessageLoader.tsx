import { ClipLoader } from "react-spinners";

export const MessageLoader = () => {
  return (
    <div className="flex justify-center items-center min-h-full ">
      <ClipLoader size={40} color="#6c1cdc" />
    </div>
  );
};
