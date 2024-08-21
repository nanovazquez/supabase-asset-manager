import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { FileObject } from "@supabase/storage-js";
import { Answers } from "./index";
import path from "path";
import fs from "fs";

export default async function downloadAssets(answers: Answers): Promise<void> {
  console.log("Downloading assets with parameters", answers);
  const bucketName = answers.bucketFolderPath.split("/")[0];
  const baseFolderName = answers.bucketFolderPath.split("/").slice(1).toString();

  const supabaseClient = createClient(answers.sourceProjectUrl, answers.sourceProjectKey);
  const baseFolderFiles = await supabaseClient.storage.from(bucketName).list(baseFolderName, { limit: 1000 });

  if (!baseFolderFiles.data) {
    throw new Error(`No files found in the folder ${baseFolderName}`);
  }

  // Iterate recursively through the folders and download the files
  await downloadFilesRecursively(
    supabaseClient,
    bucketName,
    baseFolderName,
    answers.tempFolderPath,
    baseFolderFiles.data,
  );
}

function isFile(asset: any) {
  return !!asset.id && !!asset.metadata?.mimetype;
}

async function downloadFilesRecursively(
  supabaseClient: SupabaseClient,
  bucketName: string,
  folderName: string,
  tempFolderPath: string,
  files: FileObject[],
): Promise<void> {
  console.log(`Downloading files from ${folderName}`);

  for (const file of files) {
    if (isFile(file)) {
      await downloadFile(supabaseClient, bucketName, `${folderName}/${file.name}`, tempFolderPath);
    } else {
      const folder = await supabaseClient.storage.from(bucketName).list(`${folderName}/${file.name}`, { limit: 1000 });

      if (!folder.data) {
        return;
      }

      await downloadFilesRecursively(
        supabaseClient,
        bucketName,
        `${folderName}/${file.name}`,
        tempFolderPath,
        folder.data,
      );
    }
  }
}

async function downloadFile(
  supabaseClient: SupabaseClient,
  bucketName: string,
  filePath: string,
  tempFolderPath: string,
) {
  const { data, error } = await supabaseClient.storage.from(bucketName).download(filePath);

  if (error) {
    throw error;
  }

  const tempFilePath = path.resolve(tempFolderPath, filePath);
  const tempFileDir = path.dirname(tempFilePath);

  if (!fs.existsSync(tempFileDir)) {
    await fs.promises.mkdir(tempFileDir, { recursive: true });
  }

  const buffer = Buffer.from(await data.arrayBuffer());
  await fs.promises.writeFile(tempFilePath, buffer, { encoding: "binary", flag: "w" });
}
