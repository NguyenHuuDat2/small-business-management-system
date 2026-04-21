<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use App\Models\Category;
use App\Models\Product;
use Livewire\WithPagination;

class CategoryProduct extends Component
{
    use WithPagination;

    public $search = '';
    public $activeCategoryId = null;

    public $productId, $name, $price, $product_code;
    public $isEditModalOpen = false;

    public function selectCategory($id) {
        $this->activeCategoryId = $id;
        $this->resetPage();
    }

    public function deleteProduct($id) {
        Product::find($id)->delete();
        session()->flash('message', 'Đã xóa sản phẩm thành công!');
    }

    public function editProduct($id) {
        $product = Product::find($id);
        $this->productId = $id;
        $this->name = $product->name;
        $this->price = $product->price;
        $this->product_code = $product->product_code;
        $this->isEditModalOpen = true;
    }

    public function saveProduct() {
        $this->validate([
            'name' => 'required',
            'price' => 'required|numeric',
        ]);

        $product = Product::find($this->productId);
        $product->update([
            'name' => $this->name,
            'price' => $this->price,
        ]);

        $this->isEditModalOpen = false;
        session()->flash('message', 'Cập nhật sản phẩm thành công!');
    }

    public function render()
    {
        $categories = \App\Models\Category::withCount('products')
            ->orderBy('products_count', 'desc')
            ->get();

        $products = \App\Models\Product::query()
            ->when($this->activeCategoryId, function($query) {
                $query->where('category_id', $this->activeCategoryId);
            })
            ->where('name', 'like', '%' . $this->search . '%')
            ->with('category') 
            ->paginate(10);

        return view('livewire.admin.category-product', [
            'categories' => $categories,
            'products' => $products
        ])->layout('layouts.admin');
    }
public $category_name, $category_code;
public $isAddCategoryModalOpen = false;

public function openAddModal() { $this->isAddCategoryModalOpen = true; }
public function closeAddModal() { $this->isAddCategoryModalOpen = false; }

public function saveCategory()
{
    $this->validate(['category_name' => 'required|min:3']);
    
    \App\Models\Category::create([
        'name' => $this->category_name,
        'category_code' => $this->category_code ?? strtoupper(str_replace(' ', '_', $this->category_name)),
    ]);

    $this->reset(['category_name', 'category_code', 'isAddCategoryModalOpen']);
    session()->flash('message', 'Thêm danh mục thành công!');
}
}