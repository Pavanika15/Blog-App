import { NavLink, Outlet } from "react-router";
import { useAuth } from "../store/authStore";

import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  navLinkClass,
  navLinkActiveClass,
  divider,
} from "../styles/common";

function AuthorProfile() {

  const user = useAuth((state)=>state.currentUser)

  return (
    <div className={pageWrapper}>

      {/* Profile Header */}
      <div className="mb-10">
        <h1 className={pageTitleClass}>
          {user?.firstName}'s Articles
        </h1>

        <p className={mutedText}>
          Manage and publish your blog articles.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-6 mb-6">

        <NavLink
          to="articles"
          className={({ isActive }) =>
            isActive ? navLinkActiveClass : navLinkClass
          }
        >
          Articles
        </NavLink>

        <NavLink
          to="write-article"
          className={({ isActive }) =>
            isActive ? navLinkActiveClass : navLinkClass
          }
        >
          Write Article
        </NavLink>

      </div>

      <div className={divider}></div>

      <Outlet />

    </div>
  );
}

export default AuthorProfile;