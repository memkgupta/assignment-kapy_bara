import { PostWith } from "@/types/posts";
import Link from "next/link";
import React, { createContext, useContext } from "react";

const PostCardContext = createContext<{}>({});

interface PostCardProps {
  children: React.ReactNode;
  className?: string;
}

export const PostCard: React.FC<PostCardProps> & {
  Thumbnail: React.FC<{ children: React.ReactNode; className?: string }>;
  Header: React.FC<{ children: React.ReactNode; className?: string }>;
  Body: React.FC<{ children: React.ReactNode; className?: string }>;
  Footer: React.FC<{ children: React.ReactNode; className?: string }>;
} = ({ children, className }) => {
  return (
    <PostCardContext.Provider value={{}}>
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}
      >
        {children}
      </div>
    </PostCardContext.Provider>
  );
};

PostCard.Thumbnail = ({ children, className }) => {
  return <div className={`${className}`}>{children}</div>;
};

PostCard.Header = ({ children, className }) => {
  const postCardContext = useContext(PostCardContext);
  return <div className={`${className}`}>{children}</div>;
};

PostCard.Body = ({ children, className }) => {
  return <div className={` ${className}`}>{children}</div>;
};

PostCard.Footer = ({ children, className }) => {
  return <div className={` pt-0 ${className}`}>{children}</div>;
};
