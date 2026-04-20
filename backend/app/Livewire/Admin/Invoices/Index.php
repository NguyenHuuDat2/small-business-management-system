<?php

namespace App\Livewire\Admin\Invoices;

use Livewire\Component;
use Livewire\Attributes\Layout;

#[Layout('layouts.admin')]
class Index extends Component
{
    public function render()
    {
        return view('livewire.admin.invoices.index');
    }
}