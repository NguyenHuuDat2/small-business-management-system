<div>
@if($open)

<div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div class="bg-white w-full max-w-xl rounded-xl p-6">

<h2 class="text-xl font-bold mb-4">
{{ $isEdit ? 'Sửa hóa đơn' : 'Tạo hóa đơn' }}
</h2>

<div class="space-y-4">

<select wire:model="customer_id" class="w-full border p-2 rounded">
<option value="">Chọn khách hàng</option>
@foreach($customers as $c)
<option value="{{ $c->id }}">{{ $c->name }}</option>
@endforeach
</select>

<select wire:model="sales_order_id" class="w-full border p-2 rounded">
<option value="">Chọn đơn hàng</option>
@foreach($orders as $o)
<option value="{{ $o->id }}">{{ $o->order_no }}</option>
@endforeach
</select>

<input wire:model="total_amount" type="number" class="w-full border p-2 rounded" placeholder="Tổng tiền">

<select wire:model="status" class="w-full border p-2 rounded">
<option value="draft">Draft</option>
<option value="unpaid">Chưa thanh toán</option>
<option value="partial">Thanh toán 1 phần</option>
<option value="paid">Đã thanh toán</option>
</select>

<div class="flex justify-end gap-2">
<button wire:click="$set('open',false)" class="px-4 py-2 bg-slate-100 rounded">Đóng</button>
<button wire:click="save" class="px-4 py-2 bg-green-600 text-white rounded">Lưu</button>
</div>

</div>
</div>
</div>

@endif
</div>