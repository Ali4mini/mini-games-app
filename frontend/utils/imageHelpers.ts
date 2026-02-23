import { pb } from "@/utils/pocketbase";

export const getStorageUrl = (
  record: any, // Pass the whole user/record object
  filename: string | null | undefined,
) => {
  if (!filename || !record?.id) return "https://via.placeholder.com/300";

  // If it's already a full URL, return it
  if (filename.startsWith("http")) return filename;

  // PocketBase SDK helper: (record, filename, options)
  return pb.files.getURL(record, filename, {
    thumb: "100x100", // Optional: PocketBase can auto-generate thumbs
  });
};
