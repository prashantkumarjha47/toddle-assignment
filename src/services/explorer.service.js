const baseUrl = "http://localhost:3001";

const token = () => localStorage.getItem("token");

async function getAllExplorer() {
  const response = await fetch(`${baseUrl}/explorer`, {
    headers: { "Content-Type": "application/json", token: token() },
  });
  return await response.json();
}

async function updateContent(content) {
  content.parent = content.parentId;

  await fetch(`${baseUrl}/explorer`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", token: token() },
    body: JSON.stringify(content),
  });
  return await getAllExplorer();
}

async function addContent(content) {
  await fetch(`${baseUrl}/explorer`, {
    method: "POST",
    headers: { "Content-Type": "application/json", token: token() },
    body: JSON.stringify(content),
  });
  return await getAllExplorer();
}

async function deleteContent(id) {
  await fetch(`${baseUrl}/explorer/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", token: token() },
  });
  return await getAllExplorer();
}

export default { getAllExplorer, deleteContent, updateContent, addContent };
