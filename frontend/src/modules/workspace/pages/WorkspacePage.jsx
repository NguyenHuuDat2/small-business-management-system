import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiGrid,
  FiLayers,
  FiCheckCircle,
  FiShield,
  FiUser,
  FiBriefcase,
  FiClock,
} from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";

function flattenSidebar(items = []) {
  const result = [];

  for (const item of items) {
    if (item?.path) {
      result.push(item);
    }

    if (item?.children?.length) {
      result.push(...flattenSidebar(item.children));
    }
  }

  return result;
}

function getRoleDisplay(user) {
  return user?.role?.name || "Người dùng";
}

function getDepartmentDisplay(user) {
  return user?.employee?.department?.name || "Chưa phân phòng ban";
}

function getGreeting(name) {
  return `Chào ${name || "bạn"}, bắt đầu công việc hôm nay nhé`;
}

function StatCard({ icon, label, value, colorClass = "bg-slate-100 text-slate-700" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${colorClass}`}>{icon}</div>
      </div>
    </div>
  );
}

function ShortcutCard({ item }) {
  return (
    <Link
      to={item.path}
      className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-800">{item.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{item.path}</p>
        </div>

        <div className="rounded-xl bg-slate-100 p-2 text-slate-600 transition group-hover:bg-teal-100 group-hover:text-teal-700">
          <FiArrowRight />
        </div>
      </div>
    </Link>
  );
}

function WorkspacePage() {
  const { user, sidebar = [], permissions = [] } = useAuth();

  const flatMenus = flattenSidebar(sidebar);
  const quickLinks = flatMenus.slice(0, 6);
  const moduleCount = sidebar.length;
  const pageCount = flatMenus.length;
  const actionPermissionCount = permissions.length;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
              <FiClock />
              Khu vực làm việc cá nhân
            </div>

            <h1 className="mt-3 text-2xl font-bold text-slate-800">
              {getGreeting(user?.name)}
            </h1>

            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              Đây là trang tổng hợp nhanh để bạn truy cập các chức năng thường dùng,
              theo dõi vai trò hiện tại và đi vào đúng module được phân quyền.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <FiShield />
                Vai trò
              </div>
              <p className="mt-2 text-base font-semibold text-slate-800">
                {getRoleDisplay(user)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <FiBriefcase />
                Phòng ban
              </div>
              <p className="mt-2 text-base font-semibold text-slate-800">
                {getDepartmentDisplay(user)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<FiLayers className="text-xl" />}
          label="Số module được cấp"
          value={moduleCount}
          colorClass="bg-sky-100 text-sky-700"
        />
        <StatCard
          icon={<FiGrid className="text-xl" />}
          label="Số trang truy cập được"
          value={pageCount}
          colorClass="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          icon={<FiCheckCircle className="text-xl" />}
          label="Tổng quyền hiện có"
          value={actionPermissionCount}
          colorClass="bg-amber-100 text-amber-700"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Truy cập nhanh
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Các màn hình bạn có thể vào ngay theo role hiện tại.
              </p>
            </div>

            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {quickLinks.length} mục
            </div>
          </div>

          {quickLinks.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {quickLinks.map((item) => (
                <ShortcutCard key={item.path} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
              Chưa có shortcut nào được cấp quyền.
            </div>
          )}
        </div>

        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Thông tin tài khoản
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Tóm tắt nhanh hồ sơ đăng nhập hiện tại.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-slate-100 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Họ tên
              </p>
              <p className="mt-1 font-medium text-slate-800">{user?.name || "-"}</p>
            </div>

            <div className="rounded-xl border border-slate-100 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Email
              </p>
              <p className="mt-1 font-medium text-slate-800">{user?.email || "-"}</p>
            </div>

            <div className="rounded-xl border border-slate-100 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Số điện thoại
              </p>
              <p className="mt-1 font-medium text-slate-800">{user?.phone || "-"}</p>
            </div>

            <div className="rounded-xl border border-slate-100 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Hồ sơ nhân viên
              </p>
              <p className="mt-1 flex items-center gap-2 font-medium text-slate-800">
                <FiUser className="text-slate-500" />
                {user?.employee?.employee_code || "Chưa liên kết"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspacePage;