<div>
    @if($open)
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 class="text-lg font-semibold mb-4">Xác nhận xóa</h2>
                <p class="mb-6">Bạn chắc chắn muốn xóa bản ghi này?</p>

                <div class="flex justify-end gap-2">
                    <button
                        wire:click="closeModal"
                        class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                    >
                        Hủy
                    </button>

                    <button
                        wire:click="confirm"
                        class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    @endif
</div>