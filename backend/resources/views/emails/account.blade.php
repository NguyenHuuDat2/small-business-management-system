<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông tin tài khoản</title>
</head>
<body style="margin:0; padding:0; background:#f6f8fb; font-family:Arial, Helvetica, sans-serif; color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f8fb; padding:32px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="680" cellpadding="0" cellspacing="0" border="0" style="width:680px; max-width:680px; background:#ffffff; border-radius:18px; padding:40px 44px;">
                    <tr>
                        <td>
                            <div style="font-size:12px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:#16a34a; margin-bottom:18px;">
                                ERP SYSTEM
                            </div>

                            <h1 style="margin:0 0 20px; font-size:32px; line-height:1.3; color:#111827; font-weight:800;">
                                Tài khoản của bạn đã được tạo
                            </h1>

                            <p style="margin:0 0 18px; font-size:16px; line-height:1.9; color:#374151;">
                                Xin chào
                                <strong>{{ $user->name ?: ($user->employee->name ?? 'Bạn') }}</strong>,
                            </p>

                            <p style="margin:0 0 18px; font-size:16px; line-height:1.9; color:#374151;">
                                Quản trị viên đã tạo tài khoản đăng nhập cho bạn trên hệ thống ERP.
                                Bạn có thể sử dụng thông tin dưới đây để truy cập hệ thống:
                            </p>

                            <p style="margin:0 0 10px; font-size:16px; line-height:1.9; color:#374151;">
                                <strong>Email đăng nhập:</strong>
                                <span style="color:#2563eb;">{{ $user->email }}</span>
                            </p>

                            <p style="margin:0 0 24px; font-size:16px; line-height:1.9; color:#374151;">
                                <strong>Mật khẩu tạm:</strong>
                                <span style="display:inline-block; background:#ecfdf5; color:#15803d; font-weight:800; letter-spacing:1.5px; padding:6px 12px; border-radius:10px;">
                                    {{ $password }}
                                </span>
                            </p>

                            <p style="margin:0 0 26px; font-size:15px; line-height:1.9; color:#b91c1c; font-weight:700;">
                                Vui lòng đổi mật khẩu ngay sau lần đăng nhập đầu tiên để đảm bảo an toàn tài khoản.
                            </p>

                            <p style="margin:0 0 28px;">
                                <a href="{{ config('app.url') }}/admin/login"
                                   style="display:inline-block; background:#111827; color:#ffffff; text-decoration:none; font-size:15px; font-weight:700; padding:13px 22px; border-radius:12px;">
                                    Đăng nhập hệ thống
                                </a>
                            </p>

                            @if($roleCode === 'EMPLOYEE')
                                <p style="margin:0 0 16px; font-size:15px; line-height:1.9; color:#475569;">
                                    Nếu bạn là nhân viên, vui lòng thực hiện các bước tiếp theo để kích hoạt tài khoản và thay đổi mật khẩu của mình.
                                </p>
                            @endif

                            <p style="margin:0 0 16px; font-size:15px; line-height:1.9; color:#475569;">
                                Nếu bạn không nhận ra yêu cầu này hoặc gặp vấn đề khi đăng nhập, vui lòng liên hệ quản trị viên để được hỗ trợ.
                            </p>

                            <hr style="border:none; border-top:1px solid #e5e7eb; margin:28px 0;">

                            <p style="margin:0 0 8px; font-size:12px; line-height:1.8; color:#94a3b8;">
                                Đây là email tự động từ hệ thống ERP. Vui lòng không trả lời email này.
                            </p>

                            <p style="margin:0; font-size:12px; color:#94a3b8;">
                                © {{ date('Y') }} ERP System
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>