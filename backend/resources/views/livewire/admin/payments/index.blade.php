<div class="space-y-6">

    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-slate-800">
            Quản lý thanh toán
        </h1>

        <button
            wire:click="$dispatch('openPaymentFormModal')"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
            + Tạo phiếu thu
        </button>
    </div>

    <livewire:admin.payments.form />
    <livewire:admin.payments.table />

</div>