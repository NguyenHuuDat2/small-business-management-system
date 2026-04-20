<div>
    @if($open)

        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            wire:key="customer-form-modal-{{ $isEdit ? 'edit-'.$customer_id : 'create' }}"
        >

            <div class="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6">

                {{-- HEADER --}}
                <div class="flex items-center justify-between mb-6">

                    <h2 class="text-xl font-bold text-slate-800">
                        {{ $isEdit ? 'Cập nhật khách hàng' : 'Thêm khách hàng' }}
                    </h2>

                    <button
                        type="button"
                        wire:click="close"
                        class="text-slate-400 hover:text-slate-600 text-2xl"
                    >
                        ×
                    </button>

                </div>

                <form wire:submit.prevent="save">

                    <div class="grid grid-cols-2 gap-4">

                        <div>
                            <label class="block mb-1 text-sm font-medium">Mã khách hàng</label>
                            <input wire:model.live="customer_code" class="w-full border rounded-lg px-3 py-2">
                            @error('customer_code')
                                <div class="text-red-500 text-sm">{{ $message }}</div>
                            @enderror
                        </div>

                        <div>
                            <label class="block mb-1 text-sm font-medium">Tên</label>
                            <input wire:model.live="name" class="w-full border rounded-lg px-3 py-2">
                        </div>

                        <div>
                            <label class="block mb-1 text-sm font-medium">SĐT</label>
                            <input wire:model.live="phone" class="w-full border rounded-lg px-3 py-2">
                        </div>

                        <div>
                            <label class="block mb-1 text-sm font-medium">Địa chỉ</label>
                            <input wire:model.live="address" class="w-full border rounded-lg px-3 py-2">
                        </div>

                    </div>

                    {{-- INFO --}}
                    <div class="mt-4 rounded-lg bg-blue-50 text-blue-700 px-4 py-3 text-sm">
                        {{ $isEdit ? 'Cập nhật thông tin khách hàng.' : 'Thêm khách hàng mới vào hệ thống.' }}
                    </div>

                    {{-- ACTION --}}
                    <div class="flex justify-end gap-2 mt-6">

                        <button
                            type="button"
                            wire:click="close"
                            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                        >
                            {{ $isEdit ? 'Cập nhật' : 'Lưu' }}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    @endif
</div>