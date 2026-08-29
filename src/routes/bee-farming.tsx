import { createFileRoute, redirect } from "@tanstack/react-router";

// Redirect the old bee farming route to the merged Our Story page
export const Route = createFileRoute("/bee-farming")({
  beforeLoad: () => {
    throw redirect({
      to: "/our-story",
    });
  },
});
