import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  // setting up the states to hold registration variables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser(e) {
    e.preventDefault(); // prevents the default action to occur which is reloading the page

    // csending the required data to the backend to create a user model for a registering user
    try {
      const response = await axios.post("/register", {
        name,
        email,
        password,
      });
      if (response.status === 201) {
        alert("Registration successful. Now you can log in.");
      } 

      if (response.status === 202) {
        alert("Cookie good");
      } 
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Registration failed. Email in use.");
      } else {
        alert("Registration failed. Try again later.");
      }
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="Nathan Xie"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already have an account?{" "}
            <Link className="underline text-black" to={"/login"}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
