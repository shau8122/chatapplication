"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ModalProps {
  isOpen: boolean;
  handleClick: () => void;
  users: User[];
}
const GroupModal: React.FC<ModalProps> = ({ isOpen, handleClick, users }) => {
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
      name: "",
      members: [],
    },
  });
  const members = watch("members");
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post("/api/messages", {
        ...data,
        isGroup: true,
      })
      .then(() => {
        router.refresh();
        handleClick();
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsLoading(false));
  };
  return (
    <Modal isOpen={isOpen} handleClick={handleClick}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[300px] lg:w-[500px] ">
        <div className="space-y-6">
          <div className="border-b border-gray-900/10 pb-6">
            <h2
              className="
                text-base 
                font-semibold 
                leading-7 
                text-gray-900
              "
            >
              Create a group chat
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Create a chat with more than 2 people.
            </p>
            <div className="mt-5 flex flex-col gap-y-4">
              <label
                htmlFor={"name"}
                className=" block text-sm font-medium text-gray-900"
              >
                Name
              </label>
                <input
                  id="name"
                  autoComplete="name"
                  {...register("name",{required:true})}
                  className={` form-input block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset palceholder:text-gray-400 focus:right-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6`}
                />
              <Select
                disabled={isLoading}
                label="Members"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                onChange={(value) =>
                  setValue("members", value, {
                    shouldValidate: true,
                  })
                }
                value={members}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button className="bg-red-500 px-3 py-1 rounded-md text-white" disabled={isLoading} onClick={handleClick} type="button">
            Cancel
          </button>
          <button className="bg-sky-500 px-3 py-1 rounded-md text-white" disabled={isLoading} type="submit">
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupModal;
