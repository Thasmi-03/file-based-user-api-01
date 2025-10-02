// Import required modules
import fs from "fs/promises"; // to read and write files (JSON file)
import path from "path"; // to work with file paths
import { fileURLToPath } from "url"; // to get current file path

// Setup file path for users.json
const __filename = fileURLToPath(import.meta.url); // get this file's name
const __dirname = path.dirname(__filename); // get this file's folder
const dataFile = path.join(__dirname, "../data/users.json"); // join path to users.json file

// Function: Read users from file
async function readUsers() {
  try {
    // Read the file content as text
    const data = await fs.readFile(dataFile, "utf-8");
    // Convert text into JS array (JSON → object/array)
    return JSON.parse(data);
  } catch (error) {
    // If file not found or empty, return an empty array
    return [];
  }
}

// Function: Write users to file
async function writeUsers(users) {
  // Save the users array back to the file as JSON
  await fs.writeFile(dataFile, JSON.stringify(users, null, 2));
}

// GET all users
export async function getAllUsers(req, res) {
  const users = await readUsers(); // get all users
  res.json(users); // send users back as JSON
}
