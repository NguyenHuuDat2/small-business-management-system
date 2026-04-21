<div>
<div class="bg-white p-6 rounded-xl shadow">

<table class="w-full">

<thead class="bg-slate-50">
<tr>
<th class="p-3 text-left">Mã TT</th>
<th class="p-3 text-left">Hóa đơn</th>
<th class="p-3 text-left">Số tiền</th>
<th class="p-3 text-left">Phương thức</th>
<th class="p-3 text-left">Trạng thái</th>
<th class="p-3 text-right">Action</th>
</tr>
</thead>

<tbody>

@foreach($payments as $pay)

<tr class="border-t">
<td class="p-3">{{ $pay->payment_no }}</td>
<td class="p-3">{{ $pay->invoice->invoice_no ?? '' }}</td>
<td class="p-3 text-green-700 font-bold">{{ number_format($pay->amount) }}</td>
<td class="p-3">{{ $pay->payment_method }}</td>
<td class="p-3">{{ $pay->status }}</td>

<td class="p-3">
<div class="flex justify-end gap-2">

<button
wire:click="edit({{ $pay->id }})"
class="px-3 py-1 bg-slate-100 rounded"
>Sửa</button>

<button
wire:click="delete({{ $pay->id }})"
class="px-3 py-1 bg-red-100 text-red-600 rounded"
>Xóa</button>

</div>
</td>

</tr>

@endforeach

</tbody>

</table>

<div class="mt-4">
{{ $payments->links() }}
</div>

</div>
</div>