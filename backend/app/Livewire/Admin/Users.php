<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\User;

class Users extends Component
{
    use WithPagination;

    protected $paginationTheme = 'tailwind';

    public $sortField = 'id';
    public $sortDirection = 'asc';
    // form fields
    public $name;
    public $email;
    public $phone;

    // update id
    public $user_id;

    // UI state
    public $isEdit = false;

    // pagination
    public $perPage = 5;

    protected $rules = [
        'name' => 'required|min:2',
        'email' => 'required|email',
        'phone' => 'nullable'
    ];

    public function render()
    {
        $users = User::orderBy($this->sortField, $this->sortDirection)
            ->paginate($this->perPage);

        return view('livewire.admin.users', [
            'users' => $users
        ]);
    }

    // reset form
    public function resetInput()
    {
        $this->name = '';
        $this->email = '';
        $this->phone = '';
        $this->user_id = null;
        $this->isEdit = false;
    }

    // create
    public function store()
    {
        $this->validate();

        User::create([
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'password' => bcrypt('123456')
        ]);

        session()->flash('message', 'Thêm nhân sự thành công');

        $this->resetInput();
    }

    // edit
    public function edit($id)
    {
        $user = User::findOrFail($id);

        $this->user_id = $id;
        $this->name = $user->name;
        $this->email = $user->email;
        $this->phone = $user->phone;

        $this->isEdit = true;
    }

    // update
    public function update()
    {
        $this->validate();

        $user = User::find($this->user_id);

        $user->update([
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone
        ]);

        session()->flash('message', 'Cập nhật thành công');

        $this->resetInput();
    }

    // delete
    public function delete($id)
    {
        User::find($id)->delete();

        session()->flash('message', 'Đã xoá nhân sự');
    }

    public function sortBy($field)
    {
        if ($this->sortField === $field) {
            $this->sortDirection = $this->sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            $this->sortField = $field;
            $this->sortDirection = 'asc';
        }
    }
}