function EmployeeForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  submitting = false,
  departmentOptions = [],
  mode = "create",
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Mã nhân viên
          </label>
          <input
            name="employee_code"
            value={form.employee_code}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Họ tên
          </label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Phòng ban
          </label>
          <select
            name="department_id"
            value={form.department_id}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
          >
            <option value="">Chọn phòng ban</option>
            {departmentOptions.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Số điện thoại
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Lương
          </label>
          <input
            type="number"
            name="salary"
            value={form.salary}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Trạng thái
          </label>
          <select
            name="status"
            value={String(form.status)}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
          >
            <option value="1">Đang làm việc</option>
            <option value="0">Ngừng làm việc</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white"
        >
          {submitting ? "Đang lưu..." : mode === "edit" ? "Cập nhật" : "Tạo nhân viên"}
        </button>
      </div>
    </form>
  );
}

export default EmployeeForm;