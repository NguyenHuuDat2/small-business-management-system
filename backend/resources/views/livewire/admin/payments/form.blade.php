<div>
@if($open)

<div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div class="bg-white w-full max-w-xl rounded-xl p-6">

<h2 class="text-xl font-bold mb-4">
{{ $isEdit ? 'Sửa phiếu thu' : 'Tạo phiếu thu' }}
</h2>

<div class="space-y-4">

<select wire:model="invoice_id" class="w-full border p-2 rounded">
<option value="">Chọn hóa đơn</option>
@foreach($invoices as $i)
<option value="{{ $i->id }}">{{ $i->invoice_no }}</option>
@endforeach
</select>

<input wire:model="amount" type="number" class="w-full border p-2 rounded" placeholder="Số tiền">

<select wire:model="payment_method" class="w-full border p-2 rounded">
<option value="cash">Tiền mặt</option>
<option value="bank">Chuyển khoản</option>
<option value="momo">Momo</option>
<option value="zalopay">ZaloPay</option>
</select>

<select wire:model="status" class="w-full border p-2 rounded">
<option value="paid">Đã thanh toán</option>
<option value="pending">Đang chờ</option>
<option value="failed">Thất bại</option>
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