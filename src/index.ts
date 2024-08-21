import path from "path";
import "dotenv/config";
import inquirer, { QuestionMap } from "inquirer";

import downloadAssets from "./donwload-assets";
import uploadAssets from "./upload-assets";

enum CLIOptions {
  DOWNLOAD = "Download all assets from source project",
  UPLOAD = "Upload all assets to target project",
  DOWNLOAD_AND_UPLOAD = "Download all assets from source project and upload them to target project",
}

const questions: QuestionMap[] = [
  {
    message: "What do you want to do?",
    type: "list",
    name: "action",
    choices: Object.values(CLIOptions),
  } as any,
  {
    type: "input",
    name: "sourceProjectUrl",
    message: "Supabase source project URL",
    default: process.env.SOURCE_PROJECT_SUPABASE_URL!,
  },
  {
    type: "input",
    name: "sourceProjectKey",
    message: "Supabase source project key",
    default: process.env.SOURCE_PROJECT_SUPABASE_KEY!,
  },
  {
    type: "input",
    name: "targetProjectUrl",
    message: "Supabase target project URL",
    default: process.env.TARGET_PROJECT_SUPABASE_URL!,
  },
  {
    type: "input",
    name: "targetProjectKey",
    message: "Supabase target project key",
    default: process.env.TARGET_PROJECT_SUPABASE_KEY!,
  },
  {
    type: "input",
    name: "bucketFolderPath",
    message: "Folder path in the bucket to download/upload assets (format: <bucketName>/<folderName>)",
    default: process.env.BUCKET_FOLDER_PATH!,
  },
  {
    type: "input",
    name: "tempFolderPath",
    message: "Folder path to store temporary files",
    default: path.resolve(__dirname, "temp"),
  },
];

export type Answers = {
  action: CLIOptions;
  sourceProjectUrl: string;
  sourceProjectKey: string;
  targetProjectUrl: string;
  targetProjectKey: string;
  bucketFolderPath: string;
  tempFolderPath: string;
};

async function main() {
  const answers: Answers = await inquirer.prompt(questions as any, {
    sourceProjectUrl: process.env.SOURCE_PROJECT_SUPABASE_URL,
    sourceProjectKey: process.env.SOURCE_PROJECT_SUPABASE_KEY,
    targetProjectUrl: process.env.TARGET_PROJECT_SUPABASE_URL,
    targetProjectKey: process.env.TARGET_PROJECT_SUPABASE_KEY,
    bucketFolderPath: process.env.BUCKET_FOLDER_PATH,
    tempFolderPath: path.resolve(__dirname, "temp"),
  });

  switch (answers.action) {
    case CLIOptions.DOWNLOAD:
      await downloadAssets(answers);
      break;
    case CLIOptions.UPLOAD:
      await uploadAssets(answers);
      break;
    case CLIOptions.DOWNLOAD_AND_UPLOAD:
      await downloadAssets(answers);
      await uploadAssets(answers);
      break;
    default:
      console.log("Invalid option");
      break;
  }
}

try {
  main();
} catch (error) {
  console.error("Error:", error);
}
