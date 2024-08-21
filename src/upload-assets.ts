import path from "path";
import { Answers } from "./index";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import mimeTypes from "mime-types";

export default async function uploadAssets(answers: Answers): Promise<void> {
  console.log("Uploading assets with parameters", answers);

  // Get all files in the temp folder recursively
  const filesPaths = getFilesRecursively(answers.tempFolderPath);

  // Upload all files to the target project on supabase
  const supabaseClient = createClient(answers.targetProjectUrl, answers.targetProjectKey);
  const bucketName = answers.bucketFolderPath.split("/")[0];

  console.log("Files to upload:", filesPaths.length);
  let filesUploadedCount = 0;

  for (const fileFullPath of filesPaths) {
    try {
      const fileRelativePath = path.relative(answers.tempFolderPath, fileFullPath);

      // Read image file from disk
      const fileBuffer = fs.readFileSync(fileFullPath);
      const fileMimeType = mimeTypes.lookup(fileFullPath) || "application/octet-stream";

      const { error } = await supabaseClient.storage
        .from(bucketName)
        .upload(fileRelativePath, fileBuffer, { upsert: true, contentType: fileMimeType });

      if (error) {
        console.error(`Error uploading ${fileFullPath}:`, error.message);
        throw error;
      }

      filesUploadedCount++;

      // Notify every 50 files uploaded
      if (filesUploadedCount % 50 === 0) {
        console.log(`Uploaded ${filesUploadedCount}/${filesPaths.length} files`);
      }
    } catch (error) {
      console.error(`Error uploading ${fileFullPath}:`, error);
      // throw error;
    }
  }
}

function getFilesRecursively(folderPath: string): string[] {
  const files = fs.readdirSync(folderPath);
  let allFiles: string[] = [];

  for (const file of files) {
    const fullPath = `${folderPath}/${file}`;
    if (fs.statSync(fullPath).isDirectory()) {
      allFiles = allFiles.concat(getFilesRecursively(fullPath));
    } else {
      allFiles.push(fullPath);
    }
  }

  return allFiles.filter((file) => !file.endsWith(".DS_Store")); // Remove macOS .DS_Store files
}
