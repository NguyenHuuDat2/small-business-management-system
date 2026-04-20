<div class="space-y-6">

    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-slate-800">
            Quản lý khách hàng
        </h1>

        <button
            wire:click="$dispatch('openCustomerFormModal')"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
            + Thêm khách hàng
        </button>
    </div>

    <livewire:admin.customers.form />
    <livewire:admin.customers.table />

</div>