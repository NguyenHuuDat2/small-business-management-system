<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;


class SendAccountMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $password;
    public $roleCode; 

    public function __construct($user, $password, $roleCode)
    {
        $this->user = $user;
        $this->password = $password;
        $this->roleCode = $roleCode; 
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Thông tin tài khoản'
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.account',
            with: [
                'user' => $this->user,
                'password' => $this->password,
                'roleCode' => $this->roleCode, 
            ]
        );
    }
}