<div>
    <div class="bg-white p-4 sm:p-6 rounded-xl shadow">

        <div class="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
            <h2 class="text-lg sm:text-xl font-semibold text-slate-700">
                DANH SÁCH TÀI KHOẢN
            </h2>

            <div class="flex items-center gap-2 self-start sm:self-auto">
                <select wire:model.change="perPage" class="border px-3 py-2 rounded-lg text-sm">
                    <option value="5">5 dòng</option>
                    <option value="10">10 dòng</option>
                    <option value="20">20 dòng</option>
                </select>
            </div>
        </div>

        <div wire:loading.delay class="mb-3 text-sm text-slate-500">
            Đang tải dữ liệu...
        </div>

        <div wire:loading.class="opacity-60">
            <div class="overflow-x-auto rounded-xl border">
                <table class="min-w-[900px] w-full overflow-hidden">
                    <thead class="bg-slate-50 text-sm text-slate-700">
                        <tr>
                            <th class="px-4 sm:px-5 py-3 text-left whitespace-nowrap">
                                <button wire:click.prevent="sortBy('id')" class="flex items-center gap-1 hover:text-green-600">
                                    ID
                                    @if($sortField === 'id')
                                        <span class="text-xs">{{ $sortDirection === 'asc' ? '▲' : '▼' }}</span>
                                    @endif
                                </button>
                            </th>

                            <th class="px-4 sm:px-5 py-3 text-left whitespace-nowrap">Tên</th>
                            <th class="px-4 sm:px-5 py-3 text-left whitespace-nowrap">Role</th>
                            <th class="px-4 sm:px-5 py-3 text-left whitespace-nowrap">Email</th>
                            <th class="px-4 sm:px-5 py-3 text-left whitespace-nowrap">SĐT</th>
                            <th class="px-4 sm:px-5 py-3 text-left whitespace-nowrap">Trạng thái</th>
                            <th class="px-4 sm:px-5 py-3 text-right whitespace-nowrap">Hành động</th>
                        </tr>
                    </thead>

                    <tbody class="text-sm sm:text-[15px]">
                        @forelse($users as $user)
                            <tr class="hover:bg-slate-50 transition">
                                <td class="p-3 sm:p-4 border-t text-center whitespace-nowrap">
                                    {{ $user->id }}
                                </td>

                                <td class="p-3 sm:p-4 border-t whitespace-nowrap">
                                    {{ $user->employee?->name ?? $user->name ?? '---' }}
                                </td>

                                <td class="p-3 sm:p-4 border-t whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">
                                        {{ $user->role?->name ?? '---' }}
                                    </span>
                                </td>

                                <td class="p-3 sm:p-4 border-t whitespace-nowrap">
                                    {{ $user->email }}
                                </td>

                                <td class="p-3 sm:p-4 border-t whitespace-nowrap">
                                    {{ $user->employee?->phone ?? $user->phone ?? '---' }}
                                </td>

                                <td class="p-3 sm:p-4 border-t whitespace-nowrap">
                                    @if($user->status)
                                        <span class="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                            Active
                                        </span>
                                    @else
                                        <span class="inline-flex px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                                            Inactive
                                        </span>
                                    @endif
                                </td>

                                <td class="p-3 sm:p-4 border-t">
                                    <div class="flex justify-end gap-1.5 sm:gap-2">
                                        {{-- Sửa --}}
                                        <button
                                            wire:click="edit({{ $user->id }})"
                                            type="button"
                                            title="Sửa tài khoản"
                                            class="h-9 w-9 sm:h-10 sm:w-10 inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L8.5 18.79 4 20l1.21-4.5L16.862 4.487Z"/>
                                            </svg>
                                        </button>

                                        {{-- Khóa / Mở khóa --}}
                                        <button
                                            wire:click="requestToggleStatus({{ $user->id }})"
                                            type="button"
                                            title="{{ $user->status ? 'Khóa tài khoản' : 'Mở khóa tài khoản' }}"
                                            class="h-9 w-9 sm:h-10 sm:w-10 inline-flex items-center justify-center rounded-lg sm:rounded-xl transition
                                            {{ $user->status
                                                ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                                : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                                            }}"
                                        >
                                            @if($user->status)
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                                    <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 11V8a4 4 0 1 1 8 0v3"></path>
                                                </svg>
                                            @else
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                                    <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 11V8a4 4 0 0 1 7.2-2.4"></path>
                                                </svg>
                                            @endif
                                        </button>

                                        {{-- Xóa --}}
                                        <button
                                            wire:click="confirmDelete({{ $user->id }})"
                                            type="button"
                                            title="Xóa tài khoản"
                                            class="h-9 w-9 sm:h-10 sm:w-10 inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-rose-100 text-rose-600 hover:bg-rose-200 transition"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="text-center p-4 text-gray-500 border-t">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <div class="mt-4 overflow-x-auto">
            {{ $users->links() }}
        </div>
    </div>

    @if($showAdminActionModal)
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div class="bg-white w-full max-w-lg rounded-2xl shadow-xl p-5 sm:p-6">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-base sm:text-lg font-bold text-slate-800">
                        Xác nhận thao tác Admin
                    </h3>

                    <button
                        type="button"
                        wire:click="closeAdminActionModal"
                        class="text-slate-400 hover:text-slate-600 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <p class="text-sm text-slate-600 mb-4 leading-7">
                    Đây là tài khoản có quyền Admin. Để tiếp tục thao tác này, vui lòng nhập mã xác nhận đặc biệt.
                </p>

                <div>
                    <label class="block mb-1 text-sm font-medium text-red-600">
                        Mã xác nhận Admin
                    </label>
                    <input
                        type="password"
                        wire:model.live="adminActionSecret"
                        class="w-full border rounded-lg px-3 py-2"
                        placeholder="Nhập mã xác nhận"
                    >
                    @error('adminActionSecret')
                        <div class="text-red-500 text-sm mt-1">{{ $message }}</div>
                    @enderror
                </div>

                <div class="mt-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
                    Tài khoản Admin chỉ được sửa, khóa hoặc xóa khi nhập đúng mã xác nhận bí mật.
                </div>

                <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
                    <button
                        type="button"
                        wire:click="closeAdminActionModal"
                        class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                    >
                        Hủy
                    </button>

                    <button
                        type="button"
                        wire:click="confirmAdminAction"
                        class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    @endif
</div>