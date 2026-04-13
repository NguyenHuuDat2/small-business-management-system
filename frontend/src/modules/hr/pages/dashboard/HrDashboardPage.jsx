import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiArrowRight,
  FiRefreshCw,
  FiBriefcase,
} from "react-icons/fi";
import dashboardService from "../../services/dashboardService";
import { useAuth } from "../../../../context/AuthContext";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("vi-VN") + " đ";
}

function StatCard({ icon, title, value, hint, colorClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{value}</p>
          {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
        </div>
        <div className={`rounded-xl p-3 ${colorClass}`}>{icon}</div>
      </div>
    </div>
  );
}

function ProgressRow({ name, total, max }) {
  const percent = max > 0 ? Math.round((total / max) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-700">{name}</p>
        <p className="text-sm text-slate-500">{total}</p>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-teal-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function HrDashboardPage() {
  const { hasPermission } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState({
    overview: {
      total_employees: 0,
      active_employees: 0,
      inactive_employees: 0,
      average_salary: 0,
      total_payroll: 0,
    },
    by_department: [],
    recent_employees: [],
  });

  const fetchDashboard = async (isRefresh = false) => {
    try {
      setError("");
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await dashboardService.getHrDashboard();
      setDashboard(
        response.data?.data || {
          overview: {
            total_employees: 0,
            active_employees: 0,
            inactive_employees: 0,
            average_salary: 0,
            total_payroll: 0,
          },
          by_department: [],
          recent_employees: [],
        }
      );
    } catch (err) {
      setError("Không tải được dữ liệu tổng quan nhân sự");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const maxDepartmentTotal = useMemo(() => {
    if (!dashboard.by_department.length) return 0;
    return Math.max(...dashboard.by_department.map((item) => item.total));
  }, [dashboard.by_department]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Đang tải tổng quan nhân sự...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  const overview = dashboard.overview;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Tổng quan nhân sự</h1>
            <p className="mt-1 text-sm text-slate-500">
              Theo dõi nhanh số lượng nhân viên, quỹ lương và phân bổ phòng ban.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fetchDashboard(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              Làm mới
            </button>

            {hasPermission("hr.employees.view") && (
              <Link
                to="/hr/employees"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
              >
                Danh sách nhân viên
                <FiArrowRight />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<FiUsers className="text-xl" />}
          title="Tổng nhân viên"
          value={overview.total_employees}
          hint="Tổng số hồ sơ nhân viên hiện có"
          colorClass="bg-sky-100 text-sky-700"
        />
        <StatCard
          icon={<FiCheckCircle className="text-xl" />}
          title="Đang làm việc"
          value={overview.active_employees}
          hint="Nhân viên đang hoạt động"
          colorClass="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          icon={<FiXCircle className="text-xl" />}
          title="Ngừng làm việc"
          value={overview.inactive_employees}
          hint="Nhân viên đã ngừng hoạt động"
          colorClass="bg-rose-100 text-rose-700"
        />
        <StatCard
          icon={<FiDollarSign className="text-xl" />}
          title="Lương trung bình"
          value={formatCurrency(overview.average_salary)}
          hint="Tính theo dữ liệu nhân viên hiện có"
          colorClass="bg-amber-100 text-amber-700"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Nhân viên theo phòng ban
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Số lượng nhân viên hiện có ở từng phòng ban.
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {dashboard.by_department.length} phòng ban
            </div>
          </div>

          <div className="space-y-4">
            {dashboard.by_department.length > 0 ? (
              dashboard.by_department.map((item) => (
                <div
                  key={`${item.department_id}-${item.department_name}`}
                  className="rounded-xl border border-slate-100 p-3"
                >
                  <ProgressRow
                    name={item.department_name}
                    total={item.total}
                    max={maxDepartmentTotal}
                  />
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">
                      Đang làm: {item.active}
                    </span>
                    <span className="rounded-full bg-rose-100 px-2.5 py-1 text-rose-700">
                      Ngừng: {item.inactive}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                Chưa có dữ liệu phân bổ theo phòng ban.
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Nhân viên mới nhất
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Các hồ sơ nhân viên được tạo gần đây.
              </p>
            </div>
            <div className="rounded-full bg-slate-100 p-2 text-slate-600">
              <FiBriefcase />
            </div>
          </div>

          <div className="space-y-3">
            {dashboard.recent_employees.length > 0 ? (
              dashboard.recent_employees.map((employee) => (
                <div
                  key={employee.id}
                  className="rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">{employee.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {employee.employee_code} • {employee.department_name || "Chưa phân phòng ban"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {employee.phone || "Chưa có số điện thoại"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        employee.status
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {employee.status ? "Hoạt động" : "Ngừng"}
                    </span>
                  </div>

                  <div className="mt-3 text-sm font-medium text-slate-700">
                    {formatCurrency(employee.salary)}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                Chưa có nhân viên mới.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Quỹ lương sơ bộ</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tổng mức lương đang lưu trên hồ sơ nhân viên hiện tại.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 px-5 py-4 text-right text-white">
            <p className="text-xs uppercase tracking-wide text-slate-300">Tổng quỹ lương</p>
            <p className="mt-1 text-2xl font-bold">
              {formatCurrency(overview.total_payroll)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HrDashboardPage;