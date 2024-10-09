import { useSocket } from "@/stores/use-socket";
import { MessageWithStaff } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface ChatSocketProps {
  addKey: string;
  updateKey: string;
  queryKey: string;
  onNewMessage: () => void;
}
export const useChatSocket = ({
  addKey,
  queryKey,
  updateKey,
  onNewMessage,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (message: MessageWithStaff) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }
        const newData = oldData.pages?.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithStaff) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });
        return {
          ...oldData,
          pages: newData,
        };
      });
    });
    socket.on(addKey, (message: MessageWithStaff) => {
      onNewMessage();
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }
        let newData = [...oldData.pages];
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, updateKey, queryKey, socket]);
};
