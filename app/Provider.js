// "use client";
// import React from "react";
// import {
//   LiveblocksProvider,
//   ClientSideSuspense,
// } from "@liveblocks/react/suspense";
// import Loader from "@/components/Loader";
// const Provider = ({ children }) => {
//   return (
//     <div>
//       <LiveblocksProvider
//         authEndPoint="/api/liveblocks-auth"
//         // publicApiKey={
//         //   "pk_dev_uUj9SDqkut6ZPFr_3gHb3oVzCMEgG1hOzSbUJXp8qIDyb9Q3wEHyVB8ERaZJXQWx"
//         // }
//       >
//         <ClientSideSuspense fallback={<Loader />}>
//           {children}
//         </ClientSideSuspense>
//       </LiveblocksProvider>
//     </div>
//   );
// };

// export default Provider;

"use client";

import Loader from "@/components/Loader";
// import { getClerkUsers, getDocumentUsers } from '@/lib/actions/user.actions';
import { useUser } from "@clerk/nextjs";
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import React from "react";

const Provider = ({ children }) => {
  const { user: clerkUser } = useUser();

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      // resolveUsers={async ({ userIds }) => {
      //   const users = await getClerkUsers({ userIds });
      //   return users;
      // }}
      // resolveMentionSuggestions={async ({ text, roomId }) => {
      //   const roomUsers = await getDocumentUsers({
      //     roomId,
      //     currentUser: clerkUser?.emailAddresses[0].emailAddress,
      //     text,
      //   });
      //   return roomUsers;
      // }}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;
