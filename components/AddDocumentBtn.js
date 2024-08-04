"use client";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { createDocument } from "@/lib/actions/room.actions";
import { useRouter } from "next/navigation";

const AddDocumentBtn = ({ userId, email }) => {
  const router = useRouter();
  const addDocumentHandler = async () => {
    try {
      console.log("UserId and Email: ", userId, email);
      const room = await createDocument({ userId, email });
      console.log("Created Room: ", room);

      if (room && room.id) {
        router.push(`/documents/${room.id}`);
      } else {
        console.error("Room creation failed: No ID returned.");
      }
    } catch (error) {
      console.error("Error in addDocumentHandler: ", error);
    }
  };

  return (
    <Button
      className="gradient-blue flex gap-1 shadow-md"
      type="submit"
      onClick={addDocumentHandler}
    >
      <Image src="/assets/icons/add.svg" alt="add" width={24} height={24} />
      <p className="hidden sm:block"> Start a blank document</p>
    </Button>
  );
};

export default AddDocumentBtn;
