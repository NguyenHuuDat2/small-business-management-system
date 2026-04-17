import { FiGrid, FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function ShortcutCard({ title, desc, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-4 inline-flex rounded-2xl bg-teal-50 p-3 text-teal-600">
        {icon}
      </div>
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm text-slate-500">{desc}</div>
    </button>
  );
}

function WorkspacePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-medium text-teal-600">Workspace</div>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Khu vực làm việc</h1>
        <p className="mt-2 text-sm text-slate-500">
          Đây là màn hình điều hướng chung. Bạn có thể giữ lại để dùng sau, tách riêng với dashboard theo vai trò.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ShortcutCard
          title="Trang dashboard"
          desc="Đi tới dashboard theo vai trò hiện tại."
          icon={<FiHome size={20} />}
          onClick={() => navigate("/dashboard")}
        />
        <ShortcutCard
          title="Khu vực làm việc"
          desc="Nơi gom các lối tắt và thông tin chung của hệ thống."
          icon={<FiGrid size={20} />}
          onClick={() => navigate("/workspace")}
        />
      </div>
    </div>
  );
}

export default WorkspacePage;