<?php

namespace App\Livewire\Admin\Customers;

use Livewire\Component;
use App\Models\Customer;

class Form extends Component
{
    public bool $open = false;
    public bool $isEdit = false;

    public $customer_id;
    public $customer_code;
    public $name;
    public $phone;
    public $address;

    protected $listeners = [
        'openCustomerFormModal' => 'openCreate',
        'editCustomer' => 'openEdit',
    ];

    public function render()
    {
        return view('livewire.admin.customers.form');
    }

    public function openCreate()
    {
        $this->resetForm();
        $this->open = true;
        $this->isEdit = false;
    }

    public function openEdit($id)
    {
        $customer = Customer::findOrFail($id);

        $this->resetForm();

        $this->customer_id = $customer->id;
        $this->customer_code = $customer->customer_code;
        $this->name = $customer->name;
        $this->phone = $customer->phone;
        $this->address = $customer->address;

        $this->isEdit = true;
        $this->open = true;
    }

    public function close()
    {
        $this->open = false;
    }

    public function resetForm()
    {
        $this->reset([
            'customer_id',
            'customer_code',
            'name',
            'phone',
            'address',
        ]);
    }

    public function save()
    {
        $data = $this->validate([
            'customer_code' => 'required',
            'name' => 'required',
            'phone' => 'required',
            'address' => 'nullable',
        ]);

        if ($this->isEdit) {
            Customer::findOrFail($this->customer_id)->update($data);

            $this->dispatch(
                'notify',
                title: 'Cập nhật thành công',
                message: 'Khách hàng đã được cập nhật.',
                type: 'success',
                duration: 2200
            );
        } else {
            Customer::create($data);

            $this->dispatch(
                'notify',
                title: 'Thêm thành công',
                message: 'Khách hàng mới đã được tạo.',
                type: 'success',
                duration: 2200
            );
        }

        $this->dispatch('refreshTable');

        $this->close();
    }
}