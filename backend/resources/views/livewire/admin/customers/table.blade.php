<div>
    <div class="bg-white p-4 sm:p-6 rounded-xl shadow">

        {{-- HEADER --}}
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">

            <h2 class="text-lg sm:text-xl font-semibold text-slate-700">
                DANH SÁCH KHÁCH HÀNG
            </h2>

            <div class="flex items-center gap-2">

                <select wire:model.live="perPage" class="border px-3 py-2 rounded-lg text-sm">
                    <option value="5">5 dòng</option>
                    <option value="10">10 dòng</option>
                    <option value="20">20 dòng</option>
                </select>

            </div>

        </div>

        {{-- LOADING --}}
        <div wire:loading.delay class="text-sm text-slate-500 mb-3">
            Đang tải dữ liệu...
        </div>

        <div wire:loading.class="opacity-60">

            <div class="overflow-x-auto rounded-xl border">

                <table class="min-w-[900px] w-full">

                    <thead class="bg-slate-50 text-sm text-slate-700">
                        <tr>
                            <th class="px-4 py-3 text-left">ID</th>
                            <th class="px-4 py-3 text-left">Mã KH</th>
                            <th class="px-4 py-3 text-left">Tên</th>
                            <th class="px-4 py-3 text-left">SĐT</th>
                            <th class="px-4 py-3 text-left">Địa chỉ</th>
                            <th class="px-4 py-3 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>

                        @forelse($customers as $customer)

                            <tr class="hover:bg-slate-50">

                                <td class="p-3 border-t text-center">
                                    {{ $customer->id }}
                                </td>

                                <td class="p-3 border-t">
                                    {{ $customer->customer_code }}
                                </td>

                                <td class="p-3 border-t">
                                    {{ $customer->name }}
                                </td>

                                <td class="p-3 border-t">
                                    {{ $customer->phone }}
                                </td>

                                <td class="p-3 border-t">
                                    {{ $customer->address }}
                                </td>

                                <td class="p-3 border-t">

                                    <div class="flex justify-end gap-2">

                                        {{-- EDIT --}}
                                        <button
                                            wire:click="edit({{ $customer->id }})"
                                            class="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200"
                                        >
                                            ✏️
                                        </button>

                                        {{-- DELETE --}}
                                        <button
                                            wire:click="confirmDelete({{ $customer->id }})"
                                            class="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-100 hover:bg-rose-200"
                                        >
                                            🗑️
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        @empty

                            <tr>
                                <td colspan="6" class="text-center p-4 text-gray-500 border-t">
                                    Không có dữ liệu
                                </td>
                            </tr>

                        @endforelse

                    </tbody>

                </table>

            </div>

        </div>

        {{-- PAGINATION --}}
        <div class="mt-4">
            {{ $customers->links() }}
        </div>

    </div>
</div>