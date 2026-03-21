import React from "react";
import { ProjectArchive } from "@/components/Projects/ProjectArchive";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Archive",
  description: "A comprehensive collection of digital products, AI solutions, and design case studies by LOrdEnRYQuE.",
};

export default function ProjectsPage() {
  return (
    <main style={{ marginTop: "80px" }}>
      <ProjectArchive />
    </main>
  );
}
