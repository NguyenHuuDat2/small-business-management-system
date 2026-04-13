<div>
    <div class="bg-white p-4 sm:p-6 rounded-xl shadow">
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
            <h2 class="text-lg sm:text-xl font-semibold text-slate-700">
                DANH SÁCH MENU
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
                <table class="min-w-[1200px] w-full overflow-hidden">
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

                            <th class="px-4 py-3 text-left whitespace-nowrap">Tên</th>
                            <th class="px-4 py-3 text-left whitespace-nowrap">Loại</th>
                            <th class="px-4 py-3 text-left whitespace-nowrap">Permission Key</th>
                            <th class="px-4 py-3 text-left whitespace-nowrap">Path</th>
                            <th class="px-4 py-3 text-left whitespace-nowrap">Icon</th>
                            <th class="px-4 py-3 text-left whitespace-nowrap">Menu cha</th>
                            <th class="px-4 py-3 text-center whitespace-nowrap">
                                <button wire:click.prevent="sortBy('order_index')" class="flex items-center gap-1 hover:text-green-600 mx-auto">
                                    Thứ tự
                                    @if($sortField === 'order_index')
                                        <span class="text-xs">{{ $sortDirection === 'asc' ? '▲' : '▼' }}</span>
                                    @endif
                                </button>
                            </th>
                            <th class="px-4 py-3 text-center whitespace-nowrap">Trạng thái</th>
                            <th class="px-4 py-3 text-center whitespace-nowrap">Con</th>
                            <th class="px-4 py-3 text-center whitespace-nowrap">Role dùng</th>
                            <th class="px-4 py-3 text-right whitespace-nowrap">Hành động</th>
                        </tr>
                    </thead>

                    <tbody class="text-sm sm:text-[15px]">
                        @forelse($menus as $menu)
                            <tr class="hover:bg-slate-50 transition">
                                <td class="p-4 border-t whitespace-nowrap">{{ $menu->id }}</td>

                                <td class="p-4 border-t whitespace-nowrap">
                                    {{ $menu->name }}
                                </td>

                                <td class="p-4 border-t whitespace-nowrap">
                                    @if($menu->menu_type === 'sidebar')
                                        <span class="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                                            Sidebar
                                        </span>
                                    @else
                                        <span class="inline-flex px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">
                                            Action
                                        </span>
                                    @endif
                                </td>

                                <td class="p-4 border-t whitespace-nowrap">
                                    <span class="inline-flex rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
                                        {{ $menu->permission_key }}
                                    </span>
                                </td>

                                <td class="p-4 border-t whitespace-nowrap">
                                    {{ $menu->path ?: '---' }}
                                </td>

                                <td class="p-4 border-t whitespace-nowrap">
                                    {{ $menu->icon ?: '---' }}
                                </td>

                                <td class="p-4 border-t whitespace-nowrap">
                                    {{ $menu->parent?->name ?: '---' }}
                                </td>

                                <td class="p-4 border-t text-center whitespace-nowrap">
                                    {{ $menu->order_index }}
                                </td>

                                <td class="p-4 border-t text-center whitespace-nowrap">
                                    @if($menu->status)
                                        <span class="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                            Active
                                        </span>
                                    @else
                                        <span class="inline-flex px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                                            Inactive
                                        </span>
                                    @endif
                                </td>

                                <td class="p-4 border-t text-center whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">
                                        {{ $menu->children_count }}
                                    </span>
                                </td>

                                <td class="p-4 border-t text-center whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
                                        {{ $menu->roles_count }}
                                    </span>
                                </td>

                                <td class="p-4 border-t">
                                    <div class="flex justify-end gap-2">
                                        <button
                                            wire:click="edit({{ $menu->id }})"
                                            type="button"
                                            title="Sửa menu"
                                            class="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L8.5 18.79 4 20l1.21-4.5L16.862 4.487Z"/>
                                            </svg>
                                        </button>

                                        <button
                                            wire:click="confirmDelete({{ $menu->id }})"
                                            type="button"
                                            title="Xóa menu"
                                            class="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-rose-100 text-rose-600 hover:bg-rose-200 transition"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="12" class="text-center p-4 text-gray-500 border-t">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <div class="mt-4 overflow-x-auto">
            {{ $menus->links() }}
        </div>
    </div>
</div>