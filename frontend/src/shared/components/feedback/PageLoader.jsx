function PageLoader({ text = "Đang tải..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="text-sm text-slate-500">{text}</div>
    </div>
  );
}

export default PageLoader;