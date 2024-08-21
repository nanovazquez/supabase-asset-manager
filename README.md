# Supabase Asset Manager

## Overview

Supabase Asset Manager is a tool designed to manage assets using Supabase. It allows you to upload, download, and manage your assets efficiently.

## Command Options

The project supports the following command options:

- **Download**: Download assets from Supabase. See [./src/download-assets.ts](./src/download-assets.ts) for more details.
- **Upload**: Upload assets to Supabase. See [./src/upload-assets.ts](./src/upload-assets.ts) for more details.

For more details on each command, refer to the respective files.

## Installation

To install the project, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/supabase-asset-manager.git
   cd supabase-asset-manager
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the necessary environment variables (see below).

## Environment Variables

The project requires the following environment variables to be set in a .env file:

- `SOURCE_PROJECT_SUPABASE_URL`: Your Supabase project URL for the source project.
- `SOURCE_PROJECT_SUPABASE_KEY`: Your Supabase API key for the source project.
- `TARGET_PROJECT_SUPABASE_URL`: Your Supabase project URL for the target project.
- `TARGET_PROJECT_SUPABASE_KEY`: Your Supabase API key for the target project.
- `BUCKET_FOLDER_PATH`: The path within the bucket where assets will be stored.

If these variables are not set, the program will prompt you to enter them during execution.

## Usage

To use the project, run the following command:

```sh
npm run dev
```

## Contributing

This project is open for pull requests. If you have any suggestions or improvements, feel free to contribute.

## Contact

For any questions or issues, you can contact the author nanovazquez.

Thank you for using Supabase Asset Manager!
