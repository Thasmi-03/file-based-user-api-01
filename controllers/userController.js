import fs from "fs/promises";
import path from "path";

// Get the path to users.json
const dataFile = path.join("data", "users.json");

// Read users from the file
async function readUsers() {
  try {
    const data = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(data);
  } catch {
    return []; // return empty array if file not found
  }
}

// Write users to the file
async function writeUsers(users) {
  await fs.writeFile(dataFile, JSON.stringify(users, null, 2));
}

// Get all users
export async function getAllUsers(req, res) {
  const users = await readUsers();
  res.json(users);
}

// Get user by ID
export async function getUserById(req, res) {
  const users = await readUsers();
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
}

// Create new user
export async function createUser(req, res) {
  const users = await readUsers();
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name: req.body.name,
    email: req.body.email,
  };
  users.push(newUser);
  await writeUsers(users);
  res.status(201).json(newUser);
}

// Update user
export async function updateUser(req, res) {
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "User not found" });

  users[index].name = req.body.name || users[index].name;
  users[index].email = req.body.email || users[index].email;

  await writeUsers(users);
  res.json(users[index]);
}

// Delete user
export async function deleteUser(req, res) {
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "User not found" });

  const deletedUser = users.splice(index, 1)[0];
  await writeUsers(users);
  res.json(deletedUser);
}
