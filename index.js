#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

// Helper function to convert name to camelCase
const toCamelCase = (string) =>
  string.charAt(0).toLowerCase() + string.slice(1);

// Function to replace placeholders in templates
const replacePlaceholders = (content, name, appName) => {
  const nameCamelCase = toCamelCase(name);
  return content
    .replace(/{{name}}/g, name)
    .replace(/{{nameCamelCase}}/g, nameCamelCase)
    .replace(/{{appName}}/g, appName);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getBaseDir = (normalizedAppName) => {
  // Convert dots to directory separators

  const currentPath = process.cwd();

  // Determine base directory
  let baseDir = currentPath;

  if (currentPath.includes("src/main/java")) {
    // If current path includes `src/main/java`
    baseDir = path.join(currentPath, normalizedAppName);
  } else if (currentPath.includes("src")) {
    // If current path includes `src` but not `src/main/java`
    baseDir = path.join(currentPath, "main", "java", normalizedAppName);
  } else if (currentPath.includes("src/main")) {
    // If current path includes `src/main` but not `src/main/java`
    baseDir = path.join(currentPath, "java", normalizedAppName);
  } else {
    // Append `src/main/java` to the base path
    baseDir = path.join(currentPath, "src", "main", "java", normalizedAppName);
  }

  return baseDir;
};

// Function to generate files based on the provided name
const generateFiles = async (name, appName) => {
  const normalizedAppName = appName
    .replace(/[/\\]/g, path.sep) // Convert slashes to platform-specific separator
    .replace(/\./g, path.sep);
  const baseDir = getBaseDir(normalizedAppName);

  const filesToGenerate = [
    {
      template: "controller.java",
      output: path.join(baseDir, "controller", `${name}Controller.java`),
    },
    {
      template: "dto.java",
      output: path.join(baseDir, "dto", `${name}DTO.java`),
    },
    {
      template: "repository.java",
      output: path.join(baseDir, "repository", `${name}Repository.java`),
    },
    {
      template: "service.java",
      output: path.join(baseDir, "service", `${name}Service.java`),
    },
    {
      template: "serviceImpl.java",
      output: path.join(baseDir, "service", "impl", `${name}ServiceImpl.java`),
    },
  ];

  // Show preview of file paths
  console.log(chalk.cyan("Files to be created:"));
  filesToGenerate.forEach(({ output }) => {
    console.log(chalk.green(output));
  });

  // Prompt user for confirmation
  const answers = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Do you want to create these files?",
      default: false,
    },
  ]);

  if (!answers.confirm) {
    console.log(chalk.yellow("File creation canceled."));
    return;
  }

  // Create files if confirmed
  filesToGenerate.forEach(({ template, output }) => {
    const templatePath = path.join(__dirname, "templates", template);

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(output), { recursive: true });

    // Read template content
    let content = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholders with actual values
    content = replacePlaceholders(
      content,
      capitalizeFirstLetter(name),
      normalizedAppName.replace(/[/\\]/g, ".")
    );

    // Write the generated content to the output file
    fs.writeFileSync(output, content);
    console.log(chalk.green(`Created ${output}`));
  });
};

program
  .command("generate <appName> <name>")
  .description("Generate controller, DTO, repository, service, and serviceImpl")
  .action((appName, name) => {
    console.log("appName:", appName);
    console.log("name:", name);
    if (!appName || !name) {
      console.error(chalk.red("Error: Both appName and name are required."));
      process.exit(1);
    }
    generateFiles(name, appName);
  });

program.on("command:*", () => {
  console.error(
    "Invalid command: %s\nSee --help for a list of available commands.",
    program.args.join(" ")
  );
  process.exit(1);
});

program.parse(process.argv);
