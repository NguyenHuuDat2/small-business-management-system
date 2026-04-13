@php
    $currentRoute = Route::currentRouteName();

    $pageTitle = match (true) {
        request()->routeIs('admin.dashboard') => 'Dashboard',

        request()->routeIs('admin.users*') => 'Tài khoản',
        request()->routeIs('admin.roles*') => 'Vai trò',
        request()->routeIs('admin.menus*') => 'Menu',
        request()->routeIs('admin.role-permissions*') => 'Phân quyền',

        request()->routeIs('admin.employees*') => 'Nhân sự',
        request()->routeIs('admin.departments*') => 'Phòng ban',

        request()->routeIs('admin.customers*') => 'Khách hàng',
        request()->routeIs('admin.sales-orders*') => 'Đơn bán hàng',

        request()->routeIs('admin.goods-receipts*') => 'Phiếu nhập',
        request()->routeIs('admin.deliveries*') => 'Giao hàng',
        request()->routeIs('admin.inventory*') => 'Tồn kho',

        request()->routeIs('admin.invoices*') => 'Hóa đơn',
        request()->routeIs('admin.payments*') => 'Thanh toán',
        request()->routeIs('admin.receivables*') => 'Công nợ',

        request()->routeIs('admin.asset-inventory*') => 'Tồn tài sản',
        request()->routeIs('admin.customer-assets*') => 'Tài sản khách giữ',
        request()->routeIs('admin.asset-transactions*') => 'Giao dịch tài sản',

        default => 'ERP Admin',
    };

    $user = auth()->user();
    $userName = $user->name ?? 'Admin';
    $userInitial = mb_strtoupper(mb_substr($userName, 0, 1));

    $searchScope = 'global';
    $searchPlaceholder = 'Tìm kiếm...';

    if (request()->routeIs('admin.users*')) {
        $searchScope = 'users';
        $searchPlaceholder = 'Tìm tài khoản theo tên, email, SĐT...';
    } elseif (request()->routeIs('admin.roles*')) {
        $searchScope = 'roles';
        $searchPlaceholder = 'Tìm vai trò theo mã, tên...';
    } elseif (request()->routeIs('admin.menus*')) {
        $searchScope = 'menus';
        $searchPlaceholder = 'Tìm menu theo tên, path, permission key...';
    } elseif (request()->routeIs('admin.role-permissions*')) {
        $searchScope = 'role-permissions';
        $searchPlaceholder = 'Tìm quyền theo vai trò hoặc chức năng...';
    } elseif (request()->routeIs('admin.employees*')) {
        $searchScope = 'employees';
        $searchPlaceholder = 'Tìm nhân sự theo tên, mã NV, SĐT...';
    } elseif (request()->routeIs('admin.departments*')) {
        $searchScope = 'departments';
        $searchPlaceholder = 'Tìm phòng ban...';
    } elseif (request()->routeIs('admin.customers*')) {
        $searchScope = 'customers';
        $searchPlaceholder = 'Tìm khách hàng...';
    } elseif (request()->routeIs('admin.sales-orders*')) {
        $searchScope = 'sales-orders';
        $searchPlaceholder = 'Tìm đơn bán hàng theo mã đơn, khách hàng...';
    } elseif (request()->routeIs('admin.goods-receipts*')) {
        $searchScope = 'goods-receipts';
        $searchPlaceholder = 'Tìm phiếu nhập...';
    } elseif (request()->routeIs('admin.deliveries*')) {
        $searchScope = 'deliveries';
        $searchPlaceholder = 'Tìm lệnh giao hàng...';
    } elseif (request()->routeIs('admin.inventory*')) {
        $searchScope = 'inventory';
        $searchPlaceholder = 'Tìm tồn kho...';
    } elseif (request()->routeIs('admin.invoices*')) {
        $searchScope = 'invoices';
        $searchPlaceholder = 'Tìm hóa đơn...';
    } elseif (request()->routeIs('admin.payments*')) {
        $searchScope = 'payments';
        $searchPlaceholder = 'Tìm thanh toán...';
    } elseif (request()->routeIs('admin.receivables*')) {
        $searchScope = 'receivables';
        $searchPlaceholder = 'Tìm công nợ...';
    } elseif (request()->routeIs('admin.asset-inventory*')) {
        $searchScope = 'asset-inventory';
        $searchPlaceholder = 'Tìm tồn tài sản...';
    } elseif (request()->routeIs('admin.customer-assets*')) {
        $searchScope = 'customer-assets';
        $searchPlaceholder = 'Tìm tài sản khách giữ...';
    } elseif (request()->routeIs('admin.asset-transactions*')) {
        $searchScope = 'asset-transactions';
        $searchPlaceholder = 'Tìm giao dịch tài sản...';
    } elseif (request()->routeIs('admin.dashboard')) {
        $searchScope = 'dashboard';
        $searchPlaceholder = 'Tìm nhanh trong dashboard...';
    }
@endphp

<header class="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
    <div class="px-6 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4">

        {{-- Left --}}
        <div class="flex items-center gap-4 min-w-0">
            <button
                @click="sidebar = !sidebar"
                class="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition flex items-center justify-center shadow-sm"
                title="Thu gọn / mở rộng sidebar"
                type="button"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            </button>

            <div class="hidden md:flex items-center gap-2 text-sm text-slate-400 font-medium truncate">
                <span>ERP</span>
                <span>/</span>
                <span>Admin</span>
                <span>/</span>
                <span class="text-slate-600 font-semibold">{{ $pageTitle }}</span>
            </div>
        </div>

        {{-- Center Search --}}
        <div class="flex justify-center">
            <form
                method="GET"
                action="{{ url()->current() }}"
                class="hidden lg:flex items-center gap-2 h-10 w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-3 shadow-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="7"></circle>
                    <path stroke-linecap="round" stroke-linejoin="round" d="m20 20-3.5-3.5"></path>
                </svg>

                <input
                    type="text"
                    name="q"
                    value="{{ request('q') }}"
                    placeholder="{{ $searchPlaceholder ?? 'Tìm kiếm...' }}"
                    class="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                >

                <button
                    type="submit"
                    class="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition shrink-0"
                >
                    Tìm
                </button>
            </form>
        </div>

        {{-- Right --}}
        <div class="flex items-center gap-3 justify-end">
            <button
                type="button"
                class="relative h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition flex items-center justify-center shadow-sm"
                title="Thông báo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9"/>
                </svg>
                <span class="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            </button>

            <div x-data="{ openProfile: false }" class="relative">
                <button
                    type="button"
                    @click="openProfile = !openProfile"
                    @click.outside="openProfile = false"
                    class="flex items-center gap-3 h-11 pl-2 pr-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-sm"
                >
                    <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold shrink-0">
                        {{ $userInitial }}
                    </div>

                    <div class="hidden md:block text-left">
                        <div class="text-xs text-slate-400 leading-none mb-1">Chào,</div>
                        <div class="text-sm font-semibold text-slate-800 leading-none max-w-[140px] truncate">
                            {{ $userName }}
                        </div>
                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/>
                    </svg>
                </button>

                <div
                    x-show="openProfile"
                    x-cloak
                    x-transition
                    class="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden"
                >
                    <div class="px-4 py-4 border-b border-slate-100">
                        <div class="text-sm font-semibold text-slate-800">{{ $userName }}</div>
                        <div class="text-xs text-slate-500 mt-1 break-all">
                            {{ $user->email ?? 'admin@example.com' }}
                        </div>
                    </div>

                    <div class="p-2 space-y-1">
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
                            Hồ sơ cá nhân
                        </a>

                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
                            Đổi mật khẩu
                        </a>
                    </div>

                    <div class="p-2 border-t border-slate-100">
                        <form method="POST" action="{{ route('admin.logout') }}">
                            @csrf
                            <button
                                type="submit"
                                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition"
                            >
                                Đăng xuất
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>