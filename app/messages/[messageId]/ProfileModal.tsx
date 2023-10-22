"use client";

import useOtherUser from "@/app/hooks/useOtherUser";
import { Message, User } from "@prisma/client";
import { useMemo, useState, useCallback } from "react";
import { format } from "date-fns";
import { IoClose, IoTrash } from "react-icons/io5";
import Modal from "@/components/Modal";
import AvatarGroup from "@/components/AvatarGroups";
import Avatar from "@/components/Avatar";
import useMessages from "@/app/hooks/useMessages";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ProfileModalProps {
  isOpen: boolean;
  handleClick: () => void;
  data: Message & {
    users: User[];
  };
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  handleClick,
  data,
}) => {
  const otherUser = useOtherUser(data);

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), "PP");
  }, [otherUser.createdAt]);

  const title = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }
    return "Active";
  }, [data]);
  const router = useRouter();
  const {messageId} = useMessages()
  const [isLoading, setIsLoading] = useState(false);
  const onDelete = useCallback(()=>{
    setIsLoading(true)
    axios.delete(`/api/messages/${messageId}`)
    .then(()=>{
      router.push('/messages');
      router.refresh();
    })
    .catch(()=>toast.error('Something went wrong!'))
    .finally(()=>setIsLoading(false))
  },[messageId,router])
  return (
    <>
      <Modal isOpen={isOpen} handleClick={handleClick}>
        <div
          className="flex w-[300px] lg:w-[400px] flex-col  bg-white "
        >
          <div className="px-4 sm:px-6">
            <div  className="flex items-start justify-end">
              <div className=" flex items-center">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={handleClick}
                >
                  <span className="sr-only">Close panel</span>
                  <IoClose size={24} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <div className="relative mt-6 flex-1 px-2 sm:px-3">
            <div className="flex flex-col items-center">
              <div className="mb-1">
                {data.isGroup ? (
                  <AvatarGroup users={data.users} />
                ) : (
                  <Avatar user={otherUser} />
                )}
              </div>
              <div>{title}</div>
              <div className="text-sm text-gray-500">{statusText}</div>
              <div
                className="flex gap-5 my-4"
              >
                <div className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75">
                  <div onClick={onDelete} className="w-10 h-10 bg-red-300 rounded-full flex items-center justify-center">
                    <IoTrash size={20} />
                  </div>
                  <div className="text-sm font-light text-red-600">
                    Delete
                  </div>
                </div>
              </div>
              <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                  {data.isGroup && (
                    <div>
                      <dt
                        className="
                                  text-sm 
                                  font-medium 
                                  text-gray-500 
                                  sm:w-40 
                                  sm:flex-shrink-0
                                "
                      >
                        Emails
                      </dt>
                      <dd
                        className="
                                  mt-1 
                                  text-sm 
                                  text-gray-900 
                                  sm:col-span-2
                                "
                      >
                        {data.users.map((user) => user.email).join(", ")}
                      </dd>
                    </div>
                  )}
                  {!data.isGroup && (
                    <div>
                      <dt
                        className="
                                  text-sm 
                                  font-medium 
                                  text-gray-500 
                                  sm:w-40 
                                  sm:flex-shrink-0
                                "
                      >
                        Email
                      </dt>
                      <dd
                        className="
                                  mt-1 
                                  text-sm 
                                  text-gray-900 
                                  sm:col-span-2
                                "
                      >
                        {otherUser.email}
                      </dd>
                    </div>
                  )}
                  {!data.isGroup && (
                    <>
                      <hr />
                      <div>
                        <dt
                          className="
                                    text-sm 
                                    font-medium 
                                    text-gray-500 
                                    sm:w-40 
                                    sm:flex-shrink-0
                                  "
                        >
                          Joined
                        </dt>
                        <dd
                          className="
                                    mt-1 
                                    text-sm 
                                    text-gray-900 
                                    sm:col-span-2
                                  "
                        >
                          <time dateTime={joinedDate}>{joinedDate}</time>
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileModal;
