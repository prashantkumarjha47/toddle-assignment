const baseUrl = process.env.REACT_APP_BACKEND_URL;

async function login(credentials) {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (response.status !== 200) throw new Error("");
  return await response.json();
}

const authSrvc = { login };
export default authSrvc;
