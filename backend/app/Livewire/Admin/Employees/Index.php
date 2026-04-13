<?php

namespace App\Livewire\Admin\Employees;

use App\Models\Employee;
use Livewire\Component;
use Livewire\Attributes\Layout;

#[Layout('layouts.admin')]
class Index extends Component
{
    public function render()
    {
        return view('livewire.admin.employees.index');
    }
}