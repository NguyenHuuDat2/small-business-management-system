<div class="space-y-6">
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-slate-800">Quản lý phòng ban</h1>

        <button
            wire:click="$dispatch('openDepartmentFormModal')"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
            + Thêm phòng ban
        </button>
    </div>

    <livewire:admin.departments.form />
    <livewire:admin.departments.table />
</div>