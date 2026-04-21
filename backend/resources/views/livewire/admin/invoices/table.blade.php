<div>
<div class="bg-white p-6 rounded-xl shadow">

    <table class="w-full">

        <thead class="bg-slate-50">
            <tr>
                <th class="p-3 text-left">Mã HD</th>
                <th class="p-3 text-left">Khách hàng</th>
                <th class="p-3 text-left">Tổng tiền</th>
                <th class="p-3 text-left">Trạng thái</th>
                <th class="p-3 text-right">Hành động</th>
            </tr>
        </thead>

        <tbody>
        @foreach($invoices as $invoice)

            <tr class="border-t">
                <td class="p-3">{{ $invoice->invoice_no }}</td>
                <td class="p-3">{{ $invoice->customer->name ?? '' }}</td>
                <td class="p-3 text-green-700 font-bold">
                    {{ number_format($invoice->total_amount) }}
                </td>
                <td class="p-3">
                    {{ $invoice->status }}
                </td>

                <td class="p-3">
                    <div class="flex justify-end gap-2">

                        <button
                            wire:click="edit({{ $invoice->id }})"
                            class="px-3 py-1 bg-slate-100 rounded"
                        >
                            Sửa
                        </button>

                        <button
                            wire:click="delete({{ $invoice->id }})"
                            class="px-3 py-1 bg-red-100 text-red-600 rounded"
                        >
                            Xóa
                        </button>

                    </div>
                </td>
            </tr>

        @endforeach
        </tbody>

    </table>

    <div class="mt-4">
        {{ $invoices->links() }}
    </div>

</div>
</div>