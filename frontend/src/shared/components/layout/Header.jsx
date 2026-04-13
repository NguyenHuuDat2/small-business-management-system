import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiUser,
  FiLock,
  FiSettings,
} from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";

function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const profileRef = useRef(null);

  const displayName =
    user?.display_name || user?.name || user?.email || "Người dùng";

  const roleName = user?.role?.name || "Nhân viên";
  const departmentName = user?.employee?.department?.name || null;

  const avatarUrl =
    user?.avatar ||
    user?.avatar_url ||
    user?.photo_url ||
    "https://i.pravatar.cc/100?img=12";

  const initials = useMemo(() => {
    const source = displayName?.trim() || "U";
    const parts = source.split(" ").filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    return source.slice(0, 2).toUpperCase();
  }, [displayName]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  const handleGoProfile = () => {
    setProfileOpen(false);
    navigate("/profile");
  };

  const handleChangePassword = () => {
    setProfileOpen(false);
    navigate("/change-password");
  };

  const handleAccountSettings = () => {
    setProfileOpen(false);
    navigate("/account-settings");
  };

  const renderAvatar = (size = "h-10 w-10") => {
    if (!avatarError) {
      return (
        <div className={`relative ${size}`}>
          <img
            src={avatarUrl}
            alt="avatar"
            onError={() => setAvatarError(true)}
            className="h-full w-full rounded-full object-cover ring-2 ring-slate-100"
          />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        </div>
      );
    }

    return (
      <div
        className={`relative flex ${size} items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-sm font-bold text-white shadow-sm`}
      >
        {initials}
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600"
            title="Thu gọn / mở rộng menu"
          >
            <FiMenu className="text-lg" />
          </button>

          <div className="hidden min-w-0 lg:block">
            <h2 className="truncate text-base font-semibold text-slate-800">
              Khu vực làm việc
            </h2>
            <p className="truncate text-xs text-slate-500">
              Theo dõi công việc và xử lý nghiệp vụ hằng ngày
            </p>
          </div>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-xl">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng, khách hàng, phiếu nhập..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600"
            title="Thông báo"
          >
            <FiBell className="text-lg" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>

          <div className="hidden h-8 w-px bg-slate-200 md:block" />

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-2 transition hover:border-teal-500 hover:bg-slate-50"
            >
              {renderAvatar("h-10 w-10")}

              <span className="hidden text-slate-400 md:inline-flex">
                <FiChevronDown
                  className={`transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    {renderAvatar("h-12 w-12")}

                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-800">
                        {displayName}
                      </div>
                      <div className="truncate text-xs text-slate-500">
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-medium text-teal-700">
                      {roleName}
                    </span>

                    {departmentName && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        {departmentName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleGoProfile}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <FiUser className="text-slate-500" />
                    <span>Thông tin tài khoản</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleChangePassword}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <FiLock className="text-slate-500" />
                    <span>Đổi mật khẩu</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAccountSettings}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <FiSettings className="text-slate-500" />
                    <span>Cài đặt cá nhân</span>
                  </button>

                  <div className="my-2 border-t border-slate-100" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    <FiLogOut />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 md:hidden">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;