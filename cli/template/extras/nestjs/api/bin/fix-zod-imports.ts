import * as fs from 'node:fs'
import * as path from 'node:path'

const directoryPath = 'src/@generated/zod'

const processFile = (filePath: string): void => {
  try {
    // Read the content of the file
    let fileContent = fs.readFileSync(filePath, 'utf-8')

    // Replace the specified line
    fileContent = fileContent.replace(
      'import * as z from "nestjs-zod/z"',
      'import * as z from "zod"',
    )

    // Write the modified content back to the file
    fs.writeFileSync(filePath, fileContent, 'utf-8')
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error}`)
  }
}

const processFilesInDirectory = (directory: string): void => {
  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file)

    // Check if it's a file
    if (fs.statSync(filePath).isFile()) {
      processFile(filePath)
    } else if (fs.statSync(filePath).isDirectory()) {
      // Recursively process files in subdirectories
      processFilesInDirectory(filePath)
    }
  })
}

// Start processing files in the specified directory
processFilesInDirectory(directoryPath)