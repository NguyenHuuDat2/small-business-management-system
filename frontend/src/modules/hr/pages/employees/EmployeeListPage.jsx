import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import employeeService from "../../services/employeeService";
import EmployeeForm from "../../../../shared/components/forms/employees/EmployeeForm";
import { useAuth } from "../../../../context/AuthContext";

function formatCurrency(value) {
  const number = Number(value || 0);
  return number.toLocaleString("vi-VN") + " đ";
}

function StatusBadge({ status }) {
  return status ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
      <FiCheckCircle />
      Đang làm việc
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
      <FiXCircle />
      Ngừng làm việc
    </span>
  );
}

const defaultForm = {
  employee_code: "",
  name: "",
  department_id: "",
  phone: "",
  salary: "",
  status: "1",
};

function EmployeeListPage() {
  const { hasPermission } = useAuth();

  const canCreate = hasPermission("hr.employees.create");
  const canUpdate = hasPermission("hr.employees.update");
  const canDelete = hasPermission("hr.employees.delete");

  const [employees, setEmployees] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    department_id: "",
    per_page: 10,
    page: 1,
  });

  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const activeCount = useMemo(
    () => employees.filter((item) => item.status).length,
    [employees]
  );

  const inactiveCount = useMemo(
    () => employees.filter((item) => !item.status).length,
    [employees]
  );

  const fetchEmployees = async (customFilters = filters, isRefresh = false) => {
    try {
      setError("");
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await employeeService.list(customFilters);
      const data = response.data;

      setEmployees(data?.data || []);
      setMeta(
        data?.meta || {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        }
      );
    } catch (err) {
      setError("Không tải được danh sách nhân viên");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchDepartmentOptions = async () => {
    try {
      const response = await employeeService.departmentOptions();
      setDepartmentOptions(response.data?.data || []);
    } catch (err) {
      console.error("Không tải được danh sách phòng ban", err);
    }
  };

  useEffect(() => {
    fetchDepartmentOptions();
  }, []);

  useEffect(() => {
    fetchEmployees(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.status, filters.department_id, filters.per_page]);

  const openCreateModal = () => {
    setModalMode("create");
    setEditingId(null);
    setForm(defaultForm);
    setIsModalOpen(true);
  };

  const openEditModal = async (employeeId) => {
    try {
      const response = await employeeService.detail(employeeId);
      const employee = response.data?.data;

      setModalMode("edit");
      setEditingId(employeeId);
      setForm({
        employee_code: employee?.employee_code || "",
        name: employee?.name || "",
        department_id: employee?.department_id ? String(employee.department_id) : "",
        phone: employee?.phone || "",
        salary: employee?.salary || "",
        status: employee?.status ? "1" : "0",
      });
      setIsModalOpen(true);
    } catch (err) {
      toast.error("Không lấy được thông tin nhân viên");
    }
  };

  const closeModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const payload = {
      employee_code: form.employee_code.trim(),
      name: form.name.trim(),
      department_id: form.department_id || null,
      phone: form.phone.trim() || null,
      salary: form.salary === "" ? null : Number(form.salary),
      status: String(form.status) === "1",
    };

    try {
      setSubmitting(true);

      if (modalMode === "edit" && editingId) {
        await employeeService.update(editingId, payload);
        toast.success("Cập nhật nhân viên thành công");
      } else {
        await employeeService.create(payload);
        toast.success("Tạo nhân viên thành công");
      }

      closeModal();
      fetchEmployees(filters, true);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Lưu nhân viên thất bại";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa nhân viên "${employee.name}" không?`
    );

    if (!confirmed) return;

    try {
      await employeeService.remove(employee.id);
      toast.success("Xóa nhân viên thành công");

      const nextPage =
        employees.length === 1 && meta.current_page > 1
          ? meta.current_page - 1
          : meta.current_page;

      const nextFilters = {
        ...filters,
        page: nextPage,
      };

      setFilters(nextFilters);
      fetchEmployees(nextFilters, true);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Xóa nhân viên thất bại";
      toast.error(message);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const nextFilters = {
      ...filters,
      search: searchInput.trim(),
      page: 1,
    };

    setFilters(nextFilters);
    fetchEmployees(nextFilters);
  };

  const handleRefresh = () => {
    fetchEmployees(filters, true);
  };

  const handlePrevPage = () => {
    if (meta.current_page > 1) {
      setFilters((prev) => ({
        ...prev,
        page: prev.page - 1,
      }));
    }
  };

  const handleNextPage = () => {
    if (meta.current_page < meta.last_page) {
      setFilters((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Nhân viên</h1>
            <p className="mt-1 text-sm text-slate-500">
              Tra cứu, tạo mới, cập nhật và quản lý trạng thái nhân viên.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-700">
              <FiUsers />
              Tổng: {meta.total}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <FiCheckCircle />
              Đang làm: {activeCount}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-700">
              <FiXCircle />
              Ngừng: {inactiveCount}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-5">
          <form onSubmit={handleSearchSubmit} className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Tìm kiếm
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 px-3">
              <FiSearch className="text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Mã NV, tên, số điện thoại..."
                className="w-full border-none px-3 py-2.5 outline-none"
              />
            </div>
          </form>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value,
                  page: 1,
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
            >
              <option value="">Tất cả</option>
              <option value="1">Đang làm việc</option>
              <option value="0">Ngừng làm việc</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Phòng ban
            </label>
            <select
              value={filters.department_id}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  department_id: e.target.value,
                  page: 1,
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
            >
              <option value="">Tất cả phòng ban</option>
              {departmentOptions.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              onClick={handleSearchSubmit}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-900"
            >
              <FiSearch />
              Tìm
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-slate-700 hover:bg-slate-50"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            </button>

            {canCreate && (
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
              >
                <FiPlus />
                Thêm
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="border-b px-4 py-3 text-left font-semibold">#</th>
                <th className="border-b px-4 py-3 text-left font-semibold">Mã NV</th>
                <th className="border-b px-4 py-3 text-left font-semibold">Họ tên</th>
                <th className="border-b px-4 py-3 text-left font-semibold">Phòng ban</th>
                <th className="border-b px-4 py-3 text-left font-semibold">Số điện thoại</th>
                <th className="border-b px-4 py-3 text-left font-semibold">Lương</th>
                <th className="border-b px-4 py-3 text-left font-semibold">Trạng thái</th>
                <th className="border-b px-4 py-3 text-center font-semibold">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                    Đang tải danh sách nhân viên...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : employees.length > 0 ? (
                employees.map((employee, index) => (
                  <tr key={employee.id} className="transition hover:bg-slate-50">
                    <td className="border-b px-4 py-3 text-slate-500">
                      {(meta.current_page - 1) * meta.per_page + index + 1}
                    </td>
                    <td className="border-b px-4 py-3 font-medium text-slate-700">
                      {employee.employee_code}
                    </td>
                    <td className="border-b px-4 py-3 text-slate-800">
                      {employee.name}
                    </td>
                    <td className="border-b px-4 py-3 text-slate-600">
                      {employee.department_name || "-"}
                    </td>
                    <td className="border-b px-4 py-3 text-slate-600">
                      {employee.phone || "-"}
                    </td>
                    <td className="border-b px-4 py-3 text-slate-600">
                      {formatCurrency(employee.salary)}
                    </td>
                    <td className="border-b px-4 py-3">
                      <StatusBadge status={employee.status} />
                    </td>
                    <td className="border-b px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {canUpdate && (
                          <button
                            type="button"
                            onClick={() => openEditModal(employee.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <FiEdit2 />
                            Sửa
                          </button>
                        )}

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(employee)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50"
                          >
                            <FiTrash2 />
                            Xóa
                          </button>
                        )}

                        {!canUpdate && !canDelete && (
                          <span className="text-xs text-slate-400">Không có quyền</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                    Chưa có dữ liệu nhân viên phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-500">
            Trang <span className="font-semibold">{meta.current_page}</span> /{" "}
            <span className="font-semibold">{meta.last_page}</span> — Tổng{" "}
            <span className="font-semibold">{meta.total}</span> nhân viên
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={meta.current_page <= 1}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <FiChevronLeft />
              Trước
            </button>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={meta.current_page >= meta.last_page}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Sau
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {modalMode === "edit" ? "Cập nhật nhân viên" : "Tạo nhân viên"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Nhập thông tin nhân viên theo biểu mẫu bên dưới.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>

            <div className="p-5">
              <EmployeeForm
                form={form}
                onChange={handleChangeForm}
                onSubmit={handleSubmitForm}
                onCancel={closeModal}
                submitting={submitting}
                departmentOptions={departmentOptions}
                mode={modalMode}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeListPage;