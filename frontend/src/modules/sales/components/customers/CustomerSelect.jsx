import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiSearch, FiUser } from "react-icons/fi";
import { salesReferenceService } from "../../services/salesReferenceService";

function CustomerSelect({ value, onChange }) {
  const wrapperRef = useRef(null);
  const [query, setQuery] = useState(value?.label || "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setQuery(value?.label || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const data = await salesReferenceService.getCustomers({
          q: query,
          limit: 20,
        });
        setOptions(data);
      } catch (error) {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (customer) => {
    onChange(customer);
    setQuery(customer.label || `${customer.name} - ${customer.phone}`);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Khách hàng
      </label>

      <div className="relative">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Tìm theo tên hoặc số điện thoại..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        >
          <FiChevronDown />
        </button>
      </div>

      {open && (
        <div className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl">
          {loading ? (
            <div className="px-4 py-3 text-sm text-slate-500">Đang tải khách hàng...</div>
          ) : options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-500">Không có dữ liệu phù hợp.</div>
          ) : (
            options.map((customer) => (
              <button
                key={customer.id}
                type="button"
                onClick={() => handleSelect(customer)}
                className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50"
              >
                <div className="mt-0.5 rounded-lg bg-teal-50 p-2 text-teal-600">
                  <FiUser />
                </div>

                <div className="min-w-0">
                  <div className="font-medium text-slate-800">{customer.name}</div>
                  <div className="text-sm text-slate-500">{customer.phone || "Chưa có SĐT"}</div>
                  <div className="truncate text-xs text-slate-400">
                    {customer.customer_code} {customer.customer_type ? `• ${customer.customer_type}` : ""}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerSelect;