import { useNavigate } from "react-router-dom";
import {
  FiArchive,
  FiDownload,
  FiRefreshCw,
  FiTruck,
  FiPackage,
  FiAlertCircle,
} from "react-icons/fi";

function StatCard({ title, value, desc, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">{title}</div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
          <div className="mt-2 text-xs text-slate-400">{desc}</div>
        </div>

        <div className="rounded-2xl bg-teal-50 p-3 text-teal-600">{icon}</div>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, onClick, icon }) {
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

function WarehouseDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-teal-600">Nhân viên kho</div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Dashboard kho</h1>
            <p className="mt-2 text-sm text-slate-500">
              Theo dõi nhanh nhập kho, giao hàng, tồn kho và các việc cần xử lý trong kho.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/warehouse/receipts")}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            <FiDownload />
            Tạo phiếu nhập
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Phiếu nhập"
          value="--"
          desc="Sẽ nối số liệu sau"
          icon={<FiDownload size={20} />}
        />
        <StatCard
          title="Phiếu giao"
          value="--"
          desc="Sẽ nối số liệu sau"
          icon={<FiTruck size={20} />}
        />
        <StatCard
          title="Tồn kho"
          value="--"
          desc="Sẽ nối số liệu sau"
          icon={<FiArchive size={20} />}
        />
        <StatCard
          title="Cần kiểm tra"
          value="--"
          desc="Sẽ nối số liệu sau"
          icon={<FiAlertCircle size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ActionCard
          title="Phiếu nhập"
          desc="Quản lý các phiếu nhập hàng vào kho."
          icon={<FiDownload size={20} />}
          onClick={() => navigate("/warehouse/receipts")}
        />
        <ActionCard
          title="Giao hàng / Xuất kho"
          desc="Theo dõi các phiếu giao và trạng thái xuất kho."
          icon={<FiTruck size={20} />}
          onClick={() => navigate("/warehouse/deliveries")}
        />
        <ActionCard
          title="Tồn kho"
          desc="Kiểm tra số lượng tồn tại các vị trí trong kho."
          icon={<FiPackage size={20} />}
          onClick={() => navigate("/warehouse/inventory")}
        />
      </div>
    </div>
  );
}

export default WarehouseDashboardPage;