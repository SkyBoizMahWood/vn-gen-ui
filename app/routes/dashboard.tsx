import { Link } from "@remix-run/react";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}
