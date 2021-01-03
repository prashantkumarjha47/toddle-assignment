// let contents = [
//   { id: 0, type: "folder", name: "root", parent: null },
//   { id: 1, type: "file", name: "file1", parent: 0 },
//   { id: 2, type: "folder", name: "folder1", parent: 0 },
//   { id: 3, type: "file", name: "file2", parent: 2 },
//   { id: 4, type: "folder", name: "folder2", parent: 2 },
//   { id: 5, type: "file", name: "file3", parent: 4 },
//   { id: 6, type: "folder", name: "folder3", parent: 4 }
// ];

const baseUrl = "http://localhost:3001";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoyLCJ1c2VybmFtZSI6InJvb3QifSwiaWF0IjoxNjA5NzAwNzczLCJleHAiOjE2MDk3MDQzNzN9.D_p2NCoBubuoozVqnbfiiqjxYhkhO8ATZsbY3cnlOiw";
async function getAllExplorer() {
  const response = await fetch(`${baseUrl}/explorer`, {
    headers: { "Content-Type": "application/json", token: token },
  });
  return await response.json();
}

async function updateContent(content) {
  content.parent = content.parentId;

  await fetch(`${baseUrl}/explorer`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", token: token },
    body: JSON.stringify(content),
  });
  return await getAllExplorer();
}

async function addContent(content) {
  await fetch(`${baseUrl}/explorer`, {
    method: "POST",
    headers: { "Content-Type": "application/json", token },
    body: JSON.stringify(content),
  });
  return await getAllExplorer();
}

async function deleteContent(id) {
  await fetch(`${baseUrl}/explorer/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", token },
  });
  return await getAllExplorer();
}

export default { getAllExplorer, deleteContent, updateContent, addContent };
