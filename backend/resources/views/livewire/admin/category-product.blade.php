<div class="p-6 space-y-6" x-data="{ expanded: false }">
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-slate-800">Danh mục sản phẩm</h2>
            <button class="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold">+ Thêm danh mục</button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 transition-all duration-500 overflow-hidden"
             :class="expanded ? 'max-h-[2000px]' : 'max-h-[210px]'"> 
            
            <div wire:click="selectCategory(null)" 
                 class="cursor-pointer rounded-2xl border-2 p-4 text-center transition-all {{ is_null($activeCategoryId) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50' }}">
                <span class="text-sm font-bold block">Tất cả</span>
            </div>

            @foreach($categories as $cat)
                <div wire:click="selectCategory({{ $cat->id }})" 
                     class="cursor-pointer rounded-2xl border-2 p-4 text-center transition-all {{ $activeCategoryId == $cat->id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:border-emerald-200' }}">
                    <span class="text-sm font-bold block truncate">{{ $cat->name }}</span>
                    <span class="text-[11px] text-slate-400">{{ $cat->products_count }} SP</span>
                </div>
            @endforeach
        </div>

        @if($categories->count() > 11)
        <div class="mt-4 text-center">
            <button @click="expanded = !expanded" class="text-emerald-600 font-semibold text-sm hover:underline">
                <span x-show="!expanded">Xem thêm danh mục...</span>
                <span x-show="expanded">Thu gọn bớt</span>
            </button>
        </div>
        @endif
    </div>
    
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 class="font-bold text-slate-800 italic">
                 {{ $activeCategoryId ? $categories->find($activeCategoryId)->name : 'Tất cả sản phẩm' }}
            </h3>
            <input type="text" wire:model.live="search" class="border rounded-xl px-4 py-2 text-sm w-64" placeholder="Tìm tên sản phẩm...">
        </div>

        <table class="w-full text-sm text-left text-slate-600">
            <thead class="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                    <th class="px-6 py-4">Mã SP</th>
                    <th class="px-6 py-4">Tên sản phẩm</th>
                    <th class="px-6 py-4">Danh mục</th> {{-- CỘT MỚI --}}
                    <th class="px-6 py-4 text-emerald-600">Giá bán</th>
                    <th class="px-6 py-4 text-right">Hành động</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @forelse($products as $product)
                    <tr class="hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4 font-mono">{{ $product->product_code }}</td>
                        <td class="px-6 py-4 font-semibold text-slate-800">{{ $product->name }}</td>
                        <td class="px-6 py-4">
                            @if($product->category)
                                <span class="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">
                                    {{ $product->category->name }}
                                </span>
                            @else
                                <span class="bg-rose-50 text-rose-600 px-2 py-1 rounded-md text-xs font-medium italic">
                                    Chưa phân loại
                                </span>
                            @endif
                        </td>
                        <td class="px-6 py-4 font-bold">{{ number_format($product->price) }}đ</td>
                        <td class="px-6 py-4 text-right space-x-3">
                            <button wire:click="editProduct({{ $product->id }})" class="text-blue-600 font-semibold hover:underline">
                                Sửa
                            </button>
                            <button wire:click="deleteProduct({{ $product->id }})" 
                                    onclick="confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?') || event.stopImmediatePropagation()"
                                    class="text-rose-400 font-semibold hover:text-rose-600">
                                Xóa
                            </button>
                        </td>
                    </tr>
                @empty
                    <tr><td colspan="5" class="p-10 text-center text-slate-400 font-italic">Không tìm thấy sản phẩm nào...</td></tr>
                @endforelse
            </tbody>
        </table>
        <div class="p-4 border-t">{{ $products->links() }}</div>
    </div>
    @if($isEditModalOpen)
<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold mb-4">Sửa thông tin sản phẩm</h3>
        
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-slate-700">Tên sản phẩm</label>
                <input type="text" wire:model="name" class="w-full border rounded-xl px-4 py-2 mt-1">
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-700">Giá bán</label>
                <input type="number" wire:model="price" class="w-full border rounded-xl px-4 py-2 mt-1">
            </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
            <button wire:click="$set('isEditModalOpen', false)" class="px-4 py-2 text-slate-500 font-medium">Hủy</button>
            <button wire:click="saveProduct" class="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-600">
                Lưu cập nhật
            </button>
        </div>
    </div>
</div>
@endif

@if (session()->has('message'))
    <div x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 3000)" 
         class="fixed bottom-5 right-5 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg transition-all">
        {{ session('message') }}
    </div>
@endif
</div>