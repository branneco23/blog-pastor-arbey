"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface BlogContextType {
  isLiveModalOpen: boolean;
  setIsLiveModalOpen: (open: boolean) => void;
  liveVideoId: string;
  setLiveVideoId: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [liveVideoId, setLiveVideoId] = useState("");

  return (
    <BlogContext.Provider value={{ isLiveModalOpen, setIsLiveModalOpen, liveVideoId, setLiveVideoId }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error("useBlogContext debe usarse dentro de BlogProvider");
  return context;
};