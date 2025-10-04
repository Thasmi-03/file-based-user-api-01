// Import Node.js modules to work with files and paths
import fs from "fs/promises"; // allows us to read/write files asynchronously
import path from "path"; // helps us create file paths that work on any system

// Get the path to the users.json file
// "data" folder should be in the same folder as app.js
const dataFile = path.join("data", "users.json");

// Function to read users from the file
async function readUsers() {
  try {
    // Read the file content as a string
    const data = await fs.readFile(dataFile, "utf-8");
    // Convert JSON string into a JavaScript array and return it
    return JSON.parse(data);
  } catch {
    // If the file does not exist or is empty, return an empty array
    return [];
  }
}

// Function to write users to the file
async function writeUsers(users) {
  // Convert the JavaScript array into a JSON string and save it to the file
  // "null, 2" makes the JSON readable with indentation
  await fs.writeFile(dataFile, JSON.stringify(users, null, 2));
}

// Controller functions for Express routes

// Get all users
export async function getAllUsers(req, res) {
  const users = await readUsers(); // Read users from the file
  res.json(users); // Send all users as JSON response
}

// Get a user by ID
export async function getUserById(req, res) {
  const users = await readUsers(); // Read all users
  // Find the user with the ID from the URL
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) {
    // If user not found, send 404 error
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user); // Send the found user as JSON
}

// Create a new user
export async function createUser(req, res) {
  const users = await readUsers(); // Get existing users

  // Create a new user object
  // ID is automatically set as last ID + 1, or 1 if no users exist
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name: req.body.name, // Get name from request body
    email: req.body.email, // Get email from request body
  };

  users.push(newUser); // Add new user to the array
  await writeUsers(users); // Save updated array to file
  res.status(201).json(newUser); // Send new user as response
}

// Update an existing user
export async function updateUser(req, res) {
  const users = await readUsers(); // Get all users
  const index = users.findIndex((u) => u.id === Number(req.params.id)); // Find index by ID

  if (index === -1) {
    // If user not found, send 404 error
    return res.status(404).json({ message: "User not found" });
  }

  // Update the name and email if provided, else keep old values
  users[index].name = req.body.name || users[index].name;
  users[index].email = req.body.email || users[index].email;

  await writeUsers(users); // Save updated users to file
  res.json(users[index]); // Send updated user as response
}

// Delete a user
export async function deleteUser(req, res) {
  const users = await readUsers(); // Get all users
  const index = users.findIndex((u) => u.id === Number(req.params.id)); // Find index by ID

  if (index === -1) {
    // If user not found, send 404 error
    return res.status(404).json({ message: "User not found" });
  }

  // Remove the user from the array
  const deletedUser = users.splice(index, 1)[0];
  await writeUsers(users); // Save updated array to file
  res.json(deletedUser); // Send deleted user as response
}
