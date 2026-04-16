import { useRef } from "react";
import { FiX, FiPrinter, FiDownload } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN").format(value || 0) + " đ";
};

function InvoiceDetailModal({ isOpen, onClose, invoice }) {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `HĐ_${invoice?.invoice_no}`,
  });

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Hoa_don_${invoice?.invoice_no}.pdf`);
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header - Thu gọn lại */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Chi tiết hóa đơn</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
            <FiX size={18} />
          </button>
        </div>

        {/* Vùng chứa cuộn được */}
        <div className="overflow-y-auto bg-slate-50 p-6">
          {/* Tờ hóa đơn chính - Tối ưu lại font và khung */}
          <div 
            ref={printRef} 
            className="bg-white mx-auto shadow-sm border border-slate-200 p-8 text-slate-800"
            style={{ fontFamily: "'Inter', system-ui, sans-serif", lineHeight: "1.5" }}
          >
            {/* Header hóa đơn */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-xl font-black text-teal-600 mb-1">ERP MINI SYSTEM</div>
                <div className="text-[10px] text-slate-400 uppercase font-medium tracking-tighter">Giải pháp quản lý thông minh</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold uppercase tracking-tight">Hóa đơn</div>
                <div className="text-sm font-semibold text-teal-600">#{invoice.invoice_no}</div>
              </div>
            </div>

            {/* Thông tin khách hàng - Sắp xếp lại cho gọn */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-sm border-t border-b border-slate-100 py-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Khách hàng</div>
                <div className="font-bold">{invoice.customer?.name}</div>
                <div className="text-xs text-slate-500">Mã ĐH: {invoice.sales_order?.order_no}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Ngày xuất</div>
                <div className="font-medium">{new Date(invoice.created_at).toLocaleDateString('vi-VN')}</div>
                <div className={`text-[10px] font-bold mt-1 uppercase ${invoice.status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                   • {invoice.status === 'Paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                </div>
              </div>
            </div>

            {/* Bảng hàng hóa - Làm mỏng dòng hơn */}
            <table className="w-full text-sm mb-8">
              <thead>
                <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                  <th className="pb-2 text-left">Diễn giải</th>
                  <th className="pb-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-50">
                  <td className="py-4 font-medium text-slate-600">
                    Thanh toán đơn hàng {invoice.sales_order?.order_no}
                  </td>
                  <td className="py-4 text-right font-bold text-slate-800">
                    {formatCurrency(invoice.total_amount)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Tổng cộng - Highlight đậm */}
            <div className="flex justify-end border-t-2 border-slate-800 pt-4">
              <div className="text-right w-full">
                <span className="text-xs font-bold text-slate-400 uppercase mr-4">Tổng cộng thanh toán</span>
                <span className="text-2xl font-black text-teal-600 tracking-tight">
                  {formatCurrency(invoice.total_amount)}
                </span>
              </div>
            </div>
          
          </div>
        </div>

        {/* Footer Actions - Cố định ở dưới */}
        <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <FiPrinter /> In
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-6 py-2 text-xs font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-md shadow-teal-100"
          >
            <FiDownload /> Tải PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetailModal;