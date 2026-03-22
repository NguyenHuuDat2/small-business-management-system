<div class="space-y-6">
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-slate-800">Quản lý tài khoản</h1>

        <button
            wire:click="$dispatch('openUserFormModal')"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
            + Thêm tài khoản
        </button>
    </div>

    <livewire:admin.users.form />
    <livewire:admin.users.table />
</div>