import { UserContext } from "../UserContext";
import { useContext } from "react";
import { Link, Navigate } from "react-router-dom";

export default function AccountPage() {
  const { user, ready } = useContext(UserContext);

  if (!user) {
    return "Loading...";
  }

  if (ready && !user) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div>
      <nav className="w-full flex justify-center mt-8 gap-2">
        <Link
          className="py-2 px-6 bg-primary text-white rounded-full"
          to={"/account"}
        >
          My account
        </Link>
        <Link className="py-2 px-6" to={"/account/bookings"}>
          My bookings
        </Link>
        <Link className="py-2 px-6" to={"/account/places"}>
          My places
        </Link>
      </nav>
    </div>
  );
}
