const http = require("http");

async function run() {
  const fetch = (await import('node-fetch')).default;
  
  const user = { username: "tech2", password: "pw", role: "technician", fullName: "Techy" };
  await fetch("http://localhost:5000/api/register", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "tech2", password: "pw" })
  });
  const data = await res.json();
  console.log("Login User Data:", data.user);

  const updateRes = await fetch("http://localhost:5000/api/users/" + data.user._id, {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data.user, name: "New Name", phone: "999" })
  });
  const updateData = await updateRes.json();
  console.log("Updated User Data:", updateData);

  const res2 = await fetch("http://localhost:5000/api/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "tech2", password: "pw" })
  });
  const data2 = await res2.json();
  console.log("Relogin Data:", data2.user);
}
run();
