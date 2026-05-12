import { useAuth } from "../store/authStore";
import { Outlet, NavLink } from "react-router";

import {
  pageWrapper,
  navLinkClass,
  navLinkActiveClass,
  divider,
} from "../styles/common.js";

function UserProfile() {
  const currentUser = useAuth((state) => state.currentUser);

  // If user is an AUTHOR, show AuthorProfile equivalent
  if (currentUser?.role === "AUTHOR") {
    return (
      <div className={pageWrapper}>
        {/* User Header */}
        <div className="text-start mb-6">
          <div className="flex items-center gap-4">
            <img src={currentUser?.profileImageUrl} className="w-20 rounded-full" alt={currentUser?.firstName} />
            <div>
              <h1 className="text-3xl font-bold">{currentUser?.firstName} {currentUser?.lastName || ""}</h1>
              <p className="text-gray-600">{currentUser?.email}</p>
            </div>
          </div>
        </div>

      {/* Navigation */}
        <div className="flex gap-6 mb-6">
          <NavLink to="/user-profile" className={({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass)}>
            Articles
          </NavLink>

          <NavLink to="/user-profile/write-article" className={({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass)}>
            Write Article
          </NavLink>
        </div>

        <div className={divider}></div>

        {/* Nested route content */}
        <Outlet />
      </div>
    );
  }

  // Regular USER profile - show only details
  return (
    <div className={pageWrapper}>
      {/* User Details */}
      <div className="text-start mb-8">
        <div className="flex items-center gap-4">
          <img src={currentUser?.profileImageUrl} className="w-20 rounded-full" alt={currentUser?.firstName} />
          <div>
            <h1 className="text-3xl font-bold">{currentUser?.firstName} {currentUser?.lastName || ""}</h1>
            <p className="text-gray-600">{currentUser?.email}</p>
            <p className="text-sm text-gray-500 mt-2">Role: User</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;