<div class="space-y-6">
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-slate-800">Quản lý nhân viên</h1>

        <button
            wire:click="$dispatch('openEmployeeFormModal')"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
            + Thêm nhân viên
        </button>
    </div>

    <livewire:admin.employees.form />
    <livewire:admin.employees.table />
</div>