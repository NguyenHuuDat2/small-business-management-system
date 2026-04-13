function PlaceholderPage({ title = "Đang phát triển" }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h1 className="mb-2 text-2xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-500">
        Trang này đã được mở route từ menu động. Bạn có thể làm page thật sau.
      </p>
    </div>
  );
}

export default PlaceholderPage;