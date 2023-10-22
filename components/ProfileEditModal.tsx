"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import Modal from "./Modal";
import { signOut } from "next-auth/react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });
  const image = watch("image");

  const handleUpload = (result: any) => {
    setValue("image", result?.info?.secure_url, {
      shouldValidate: true,
    });
  };
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post("/api/profileEdit", data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsLoading(false));
  };
  const handleSignOut = () => {
    signOut()
    .then(()=>router.push('/'))
  };
  return (
    <Modal isOpen={isOpen} handleClick={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[300px] lg:w-[500px]">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="flex justify-between mt-5">
              <div className="flex flex-col">
                <h2 className="  text-base   font-semibold   leading-7   text-gray-900">
                  Profile
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Edit your public information.
                </p>
              </div>
              <a href="/">
                <button
                  className="bg-red-500 px-3 py-1 rounded-md text-white"
                  onClick={handleSignOut}
                >
                  logout
                </button>
              </a>
            </div>
            <div className="mt-5 flex flex-col gap-y-5">
              <label
                htmlFor={"name"}
                className=" block text-sm text-semibold font-medium text-gray-900"
              >
                Name
              </label>
              <input
                id="name"
                autoComplete="name"
                {...register("name", { required: true })}
                className={` form-input block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset palceholder:text-gray-400 focus:right-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6`}
              />
              <div>
                <label
                  htmlFor="photo"
                  className="
                    block 
                    text-sm 
                    font-medium 
                    leading-6 
                    text-gray-900
                  "
                >
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <Image
                    width="50"
                    height="50"
                    className="rounded-full w-10 h-10"
                    src={
                      image || currentUser?.image || "/images/placeholder.jpg"
                    }
                    alt="Avatar"
                  />
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset="qpqfnsmj"
                  >
                    <button>Change</button>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            mt-3
            flex 
            items-center 
            justify-end 
            gap-x-6
            mb-2
          "
        >
          <button
            className="bg-red-500 px-3 py-1 rounded-md text-white"
            disabled={isLoading}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
          className="bg-sky-500 px-3 py-1 rounded-md text-white"
           disabled={isLoading} type="submit">
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileEditModal;
