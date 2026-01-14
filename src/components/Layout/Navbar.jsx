import { Home, Calendar, Award, User, PlusCircle, Shield, LogOut } from "lucide-react";
import { useAuth } from "../../context/useAuth";

function Navbar({ currentPage, onNavigate }) {
  const { signOut, profile, isAdmin } = useAuth();

  const navItems = [
    { page: "home", icon: Home, label: "Home" },
    { page: "events", icon: Calendar, label: "Events" },
    { page: "rewards", icon: Award, label: "Rewards" },
    { page: "profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold text-gray-800">ConnectHub</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === item.page
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon size={18} />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}

            {/* Create Post */}
            <button
              onClick={() => onNavigate("create-post")}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <PlusCircle size={18} />
              <span className="hidden md:inline">Create</span>
            </button>

            {/* Admin */}
            {isAdmin && (
              <button
                onClick={() => onNavigate("admin")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white transition ${
                  currentPage === "admin"
                    ? "bg-yellow-700"
                    : "bg-yellow-600 hover:bg-yellow-700"
                }`}
              >
                <Shield size={18} />
                <span className="hidden md:inline">Admin</span>
              </button>
            )}

            {/* Logout */}
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>

          {/* Points */}
          {profile && (
            <div className="hidden lg:flex items-center gap-2 ml-4">
              <Award size={18} className="text-yellow-500" />
              <span className="font-semibold text-gray-700">
                {profile.reward_points} pts
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
