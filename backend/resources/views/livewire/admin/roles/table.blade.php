<div>
    <div class="rounded-xl bg-white p-4 shadow sm:p-6">
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-lg font-semibold text-slate-700 sm:text-xl">
                DANH SÁCH VAI TRÒ
            </h2>

            <div class="flex items-center gap-2 self-start sm:self-auto">
                <select wire:model.change="perPage" class="rounded-lg border px-3 py-2 text-sm">
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
                            <th class="px-4 py-3 text-left whitespace-nowrap">
                                <button wire:click.prevent="sortBy('id')" class="flex items-center gap-1 hover:text-green-600">
                                    ID
                                    @if($sortField === 'id')
                                        <span class="text-xs">{{ $sortDirection === 'asc' ? '▲' : '▼' }}</span>
                                    @endif
                                </button>
                            </th>

                            <th class="px-4 py-3 text-left whitespace-nowrap">
                                <button wire:click.prevent="sortBy('role_code')" class="flex items-center gap-1 hover:text-green-600">
                                    Mã vai trò
                                    @if($sortField === 'role_code')
                                        <span class="text-xs">{{ $sortDirection === 'asc' ? '▲' : '▼' }}</span>
                                    @endif
                                </button>
                            </th>

                            <th class="px-4 py-3 text-left whitespace-nowrap">Tên</th>
                            <th class="px-4 py-3 text-left whitespace-nowrap">Mô tả</th>
                            <th class="px-4 py-3 text-center whitespace-nowrap">Số tài khoản</th>
                            <th class="px-4 py-3 text-right whitespace-nowrap">Hành động</th>
                        </tr>
                    </thead>

                    <tbody class="text-sm sm:text-[15px]">
                        @forelse($roles as $role)
                            <tr class="transition hover:bg-slate-50">
                                <td class="border-t p-4 whitespace-nowrap">{{ $role->id }}</td>

                                <td class="border-t p-4 whitespace-nowrap">
                                    <span class="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                        {{ $role->role_code }}
                                    </span>
                                </td>

                                <td class="border-t p-4 whitespace-nowrap">
                                    {{ $role->name }}
                                </td>

                                <td class="border-t p-4">
                                    <div class="max-w-[320px] truncate text-slate-600">
                                        {{ $role->description ?: '---' }}
                                    </div>
                                </td>

                                <td class="border-t p-4 text-center whitespace-nowrap">
                                    <span class="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                                        {{ $role->users_count }}
                                    </span>
                                </td>

                                <td class="border-t p-4">
                                    <div class="flex justify-end gap-2">
                                        <button
                                            wire:click="edit({{ $role->id }})"
                                            type="button"
                                            title="Sửa vai trò"
                                            class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L8.5 18.79 4 20l1.21-4.5L16.862 4.487Z"/>
                                            </svg>
                                        </button>

                                        <button
                                            wire:click="confirmDelete({{ $role->id }})"
                                            type="button"
                                            title="Xóa vai trò"
                                            class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 transition hover:bg-rose-200"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="border-t p-4 text-center text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <div class="mt-4 overflow-x-auto">
            {{ $roles->links() }}
        </div>
    </div>
</div>