import { Button } from "@/components/ui/button";
import { defaultAppSettings } from "@/lib/constants";
import Image from "next/image";

const UpdateUserAvatar = ({ avatar }: { avatar: string | null }) => {
  return (
    <div className="my-auto mx-auto">
      <div className="size-48 rounded-lg overflow-hidden relative shadow">
        <Image
          src={avatar ?? defaultAppSettings.placeholderPostImage}
          alt="Avatar"
          fill
          className="object-cover hover:scale-110 transition-all duration-200"
        />
      </div>

      <Button
        type="submit"
        className="px-5 h-14 text-base rounded-none mt-5 w-48"
      >
        Upload
      </Button>
    </div>
  );
};

export default UpdateUserAvatar;
