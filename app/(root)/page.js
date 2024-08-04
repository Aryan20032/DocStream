import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AddDocumentBtn from "@/components/AddDocumentBtn";

const Home = async () => {
  const clerkUser = await currentUser();
  console.log(clerkUser.emailAddresses[0].emailAddress, "sdfsgf");

  if (!clerkUser) redirect("/sign-in");

  const documents = [];
  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          Notification
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>
      {documents.length > 0 ? (
        <div></div>
      ) : (
        <div className="document-list-empty">
          <Image
            src="/assets/icons/doc.svg"
            alt="document"
            height={40}
            width={40}
            className="mx-auto"
          />
          <AddDocumentBtn
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  );
};

export default Home;
