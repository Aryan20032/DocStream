"use client";
import { RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@/components/editor/Editor";
import Header from "@/components/Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import ActiveCollaborators from "./ActiveCollaborators";
import { Input } from "./ui/input";

const CollaborativeRoom = ({ roomId, roomMetadata }) => {
  console.log("roomMetadata", roomMetadata);
  if (roomMetadata) {
    const title = roomMetadata.title;
  }
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(roomMetadata?.title);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        <Header>
          <div
            ref={containerRef}
            className="flex w-fit items-center justify-center gap-2"
          >
            {editing && !loading ? (
              <Input />
            ) : (
              <>
                <p className="document-title">{documentTitle}</p>
              </>
            )}
          </div>
          <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
            <ActiveCollaborators />
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </Header>
        <Editor />
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;
