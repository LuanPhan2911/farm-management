import { createFile } from "@/services/files";
import { getStaffByExternalId } from "@/services/staffs";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { userId } = auth();

      // If you throw, the user will not be able to upload
      if (!userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId };
    })
    .onUploadComplete(
      async ({
        metadata,
        file,
      }): Promise<{
        uploadedBy: string;
      }> => {
        // This code RUNS ON YOUR SERVER after upload

        return {
          uploadedBy: metadata.userId,
        };

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      }
    ),
  fileUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 3 },
    pdf: { maxFileSize: "16MB", maxFileCount: 3 },
    "application/json": { maxFileSize: "16MB", maxFileCount: 3 },
    "application/msword": { maxFileSize: "16MB", maxFileCount: 3 },
    "application/vnd.ms-excel": { maxFileSize: "16MB", maxFileCount: 3 },
  })
    // Set permissions and file types for this FileRoute
    .input(
      z.object({
        isPublic: z.boolean().nullish().default(false),
      })
    )
    .middleware(async ({ req, input }) => {
      // This code runs on your server before upload
      const { userId, orgId } = auth();

      // If you throw, the user will not be able to upload
      if (!userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId, orgId, ...input };
    })
    .onUploadComplete(
      async ({
        metadata,
        file,
      }): Promise<{
        uploadedBy: string;
        uploadedFile: string | null;
      }> => {
        // This code RUNS ON YOUR SERVER after upload
        try {
          const staff = await getStaffByExternalId(metadata.userId);
          if (!staff) {
            return { uploadedBy: metadata.userId, uploadedFile: null };
          }
          const { customId, size, ...other } = file;

          const newFile = await createFile({
            ...other,
            ownerId: staff.id,
            isPublic: metadata.isPublic || false,
            orgId: metadata.orgId,
          });
          return {
            uploadedBy: metadata.userId,
            uploadedFile: JSON.stringify(newFile),
          };
        } catch (error) {
          return { uploadedBy: metadata.userId, uploadedFile: null };
        }

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      }
    ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
