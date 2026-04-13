<div class="space-y-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 class="text-2xl font-bold text-slate-800">Phân quyền vai trò</h1>
            <p class="text-sm text-slate-500">
                Gán quyền truy cập module, màn hình và action cho từng vai trò.
            </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
            <button
                type="button"
                wire:click="selectAll"
                class="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
                Chọn tất cả
            </button>

            <button
                type="button"
                wire:click="clearAll"
                class="rounded-lg bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-200"
            >
                Bỏ chọn
            </button>

            <button
                type="button"
                wire:click="save"
                class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
                Lưu phân quyền
            </button>
        </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        {{-- LEFT: ROLES --}}
        <div class="rounded-xl bg-white p-4 shadow sm:p-5">
            <div class="mb-4">
                <h2 class="text-lg font-semibold text-slate-800">Danh sách vai trò</h2>
                <p class="mt-1 text-sm text-slate-500">
                    Chọn một vai trò để cấu hình quyền.
                </p>
            </div>

            <div class="space-y-2">
                @foreach($roles as $role)
                    <button
                        type="button"
                        wire:click="$set('selectedRoleId', {{ $role->id }})"
                        class="w-full rounded-xl border px-4 py-3 text-left transition
                        {{ (int) $selectedRoleId === (int) $role->id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }}"
                    >
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0">
                                <div class="flex items-center gap-2">
                                    <span class="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">
                                        {{ $role->role_code }}
                                    </span>
                                </div>

                                <div class="mt-2 truncate text-sm font-semibold text-slate-800">
                                    {{ $role->name }}
                                </div>

                                <div class="mt-1 line-clamp-2 text-xs text-slate-500">
                                    {{ $role->description ?: 'Không có mô tả' }}
                                </div>
                            </div>
                        </div>
                    </button>
                @endforeach
            </div>
        </div>

        {{-- RIGHT: PERMISSIONS --}}
        <div class="rounded-xl bg-white shadow">
            <div class="border-b border-slate-100 p-4 sm:p-5">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 class="text-lg font-semibold text-slate-800">
                            Cây quyền
                        </h2>

                        @if($currentRole)
                            <p class="mt-1 text-sm text-slate-500">
                                Đang cấu hình cho:
                                <span class="font-semibold text-slate-700">
                                    {{ $currentRole->name }}
                                </span>
                                <span class="text-slate-400">({{ $currentRole->role_code }})</span>
                            </p>
                        @endif
                    </div>

                    <div class="flex flex-wrap items-center gap-2 text-sm">
                        <span class="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                            Tổng menu/quyền: <strong>{{ $totalMenus }}</strong>
                        </span>

                        <span class="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                            Đang chọn: <strong>{{ $selectedCount }}</strong>
                        </span>
                    </div>
                </div>

                <div class="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
                    <div><strong>Nguyên tắc sử dụng:</strong></div>
                    <ul class="ml-5 mt-2 list-disc space-y-1">
                        <li><strong>Sidebar</strong> là module/page hiển thị lên menu.</li>
                        <li><strong>Action</strong> là quyền thao tác bên trong màn hình.</li>
                        <li>Dùng nút <strong>Chọn nhánh</strong> để tick nhanh toàn bộ quyền con.</li>
                    </ul>
                </div>
            </div>

            <div class="p-4 sm:p-5">
                @if(!$currentRole)
                    <div class="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                        Vui lòng chọn một vai trò để cấu hình quyền.
                    </div>
                @else
                    <div class="space-y-3">
                        @forelse($menuTree as $node)
                            @include('livewire.admin.role-permissions.partials.tree-item', [
                                'node' => $node,
                                'level' => 0,
                            ])
                        @empty
                            <div class="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                                Chưa có dữ liệu menu.
                            </div>
                        @endforelse
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>