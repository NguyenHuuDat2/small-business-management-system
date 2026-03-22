<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đăng nhập Admin</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen relative">

  <!-- Background full màn hình -->
  <div class="absolute inset-0 z-0">
    <img 
      src="{{ $backgroundUrl }}" 
      alt="ERP Admin Background"
      class="w-full h-full object-cover"
    >
    <div class="absolute inset-0 bg-gray-100 bg-opacity-30"></div>
  </div>

  <!-- Nút bật/tắt form -->
  <button id="toggleFormBtn" 
          class="fixed top-5 right-5 z-20 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-emerald-700 transition">
    -> ADMIN TẠI ĐÂY
  </button>

  <!-- Container form login -->
  <div id="loginForm" class="relative z-10 flex items-center justify-center min-h-screen px-4 transition-opacity duration-500">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
      
      <!-- Logo & tiêu đề -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
          A
        </div>
        <h1 class="mt-4 text-3xl font-bold text-slate-800">Admin Login</h1>
        <p class="mt-2 text-sm text-slate-500">Đăng nhập vào khu vực quản trị hệ thống</p>
      </div>

      <!-- Form login -->
      <form method="POST" action="{{ route('admin.login.submit') }}" class="space-y-6">
        @csrf
        <div>
          <label class="block mb-2 text-sm font-medium text-slate-700">Email</label>
          <input type="email" name="email" value="{{ old('email') }}" required autofocus
                 placeholder="admin@example.com"
                 class="w-full rounded-xl border border-slate-300 px-5 py-3 outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition">
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-slate-700">Mật khẩu</label>
          <input type="password" name="password" required
                 placeholder="••••••••"
                 class="w-full rounded-xl border border-slate-300 px-5 py-3 outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition">
        </div>

        <button type="submit" class="w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 transition-shadow shadow-lg">
          Đăng nhập
        </button>
      </form>

    </div>
  </div>

  <!-- JS bật/tắt form -->
  <script>
    const toggleBtn = document.getElementById('toggleFormBtn');
    const loginForm = document.getElementById('loginForm');

    toggleBtn.addEventListener('click', () => {
      if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        loginForm.classList.add('flex');
      } else {
        loginForm.classList.remove('flex');
        loginForm.classList.add('hidden');
      }
    });
  </script>

</body>
</html>