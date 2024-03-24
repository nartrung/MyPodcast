export default function authHeader() {
  const token = localStorage.getItem("token");
  if (token) {
    return { "x-access-token": token };
  } else {
    return { "x-access-token": null };
  }
}
