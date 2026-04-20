<div>
    <div class="bg-white p-6 rounded-xl shadow">

        <div class="flex justify-between items-center mb-5">
            <h2 class="text-xl font-semibold text-slate-700">
                DANH SÁCH CÔNG NỢ
            </h2>

            <select wire:model.live="perPage"
                class="border px-3 py-2 rounded-lg text-sm">
                <option value="10">10 dòng</option>
                <option value="20">20 dòng</option>
                <option value="50">50 dòng</option>
            </select>
        </div>

        <div class="overflow-x-auto rounded-xl border">
            <table class="w-full min-w-[900px]">

                <thead class="bg-slate-50 text-sm text-slate-700">
                    <tr>
                        <th class="px-4 py-3 text-left">Khách hàng</th>
                        <th class="px-4 py-3 text-left">SĐT</th>
                        <th class="px-4 py-3 text-right">Tổng hóa đơn</th>
                        <th class="px-4 py-3 text-right">Đã thanh toán</th>
                        <th class="px-4 py-3 text-right">Còn nợ</th>
                        <th class="px-4 py-3 text-center">Trạng thái</th>
                    </tr>
                </thead>

                <tbody>

                @forelse($rows as $row)

                    <tr class="hover:bg-slate-50">

                        <td class="p-3 border-t">
                            {{ $row->name }}
                        </td>

                        <td class="p-3 border-t">
                            {{ $row->phone }}
                        </td>

                        <td class="p-3 border-t text-right">
                            {{ number_format($row->total_invoice) }}
                        </td>

                        <td class="p-3 border-t text-right text-emerald-600 font-semibold">
                            {{ number_format($row->total_paid) }}
                        </td>

                        <td class="p-3 border-t text-right font-bold text-rose-600">
                            {{ number_format($row->debt) }}
                        </td>

                        <td class="p-3 border-t text-center">

                            @if($row->debt <= 0)
                                <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    Đã thanh toán
                                </span>
                            @else
                                <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                    Còn nợ
                                </span>
                            @endif

                        </td>

                    </tr>

                @empty

                    <tr>
                        <td colspan="6"
                            class="text-center p-4 text-gray-500 border-t">
                            Không có dữ liệu
                        </td>
                    </tr>

                @endforelse

                </tbody>

            </table>
        </div>

        <div class="mt-4">
            {{ $rows->links() }}
        </div>

    </div>
</div>