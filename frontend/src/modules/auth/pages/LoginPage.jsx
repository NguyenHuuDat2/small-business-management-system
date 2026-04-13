import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

function findFirstPath(items = []) {
  for (const item of items) {
    if (item?.path) return item.path;

    if (item?.children?.length) {
      const childPath = findFirstPath(item.children);
      if (childPath) return childPath;
    }
  }

  return null;
}

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, getFirstAccessiblePath } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-sm text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getFirstAccessiblePath()} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = await login({
        email: form.email,
        password: form.password,
      });

      toast.success(data?.message || "Đăng nhập thành công");

      const nextPath = findFirstPath(data?.sidebar || []) || "/dashboard";
      navigate(nextPath, { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Đăng nhập thất bại";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-gray-800">Đăng nhập</h1>
        <p className="mb-6 text-sm text-gray-500">ERP Mini System</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Nhập email"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;