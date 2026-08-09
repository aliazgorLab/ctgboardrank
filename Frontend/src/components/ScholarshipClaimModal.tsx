import React, { useState, useEffect } from 'react';
import { 
  X, 
  Beaker, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Award, 
  Sparkles, 
  User, 
  Building 
} from 'lucide-react';

interface FormData {
  fullName: string;
  sscRoll: string;
  school: string;
  mobile: string;
}

export const ScholarshipClaimModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'card'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    sscRoll: '',
    school: '',
    mobile: '',
  });

  const [voucherCode, setVoucherCode] = useState('');

  // Global Event Listener to trigger modal from any "Claim Scholarship" button
  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
    };

    window.addEventListener('open-scholarship-modal', handleOpenModal);
    return () => {
      window.removeEventListener('open-scholarship-modal', handleOpenModal);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.sscRoll || !formData.school || !formData.mobile) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const code = `ZCC-SCH-${formData.sscRoll}-${Math.floor(1000 + Math.random() * 9000)}`;
      setVoucherCode(code);
      setIsSubmitting(false);
      setStep('card');
    }, 800);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset after transition
    setTimeout(() => {
      setStep('form');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // 1. Download as High-Resolution JPG via HTML5 Canvas
  // ---------------------------------------------------------------------------
  const downloadAsJPG = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 675;

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 675);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e1b4b');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 675);

    // Border Gold Accent
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 1160, 635);

    // Inner Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, 1136, 611);

    // Header Title
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText("ZAHID'S CHEM CLINIC • OFFICIAL SCHOLARSHIP VOUCHER", 60, 80);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 38px sans-serif';
    ctx.fillText("HSC'28 Chemistry 1st Paper Offline Course", 60, 135);

    // Discount Badge Box
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(870, 60, 260, 75, 16);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("25%+ OFF", 1000, 110);
    ctx.textAlign = 'left';

    // Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 170);
    ctx.lineTo(1140, 170);
    ctx.stroke();

    // Student Info Grid Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(60, 195, 1080, 250, 16);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText("STUDENT NAME", 90, 240);
    ctx.fillText("SSC ROLL NUMBER", 620, 240);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(formData.fullName.toUpperCase(), 90, 280);
    ctx.fillText(formData.sscRoll, 620, 280);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText("SCHOOL NAME", 90, 350);
    ctx.fillText("CONTACT MOBILE", 620, 350);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(formData.school, 90, 390);
    ctx.fillText(formData.mobile, 620, 390);

    // Footer Course Info & Disclaimer
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'italic 14px sans-serif';
    ctx.fillText("*শর্ত প্রযোজ্য | Terms & Conditions Apply", 60, 465);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText("Teacher: Zahid Sir   |   Hotline: 01841783983", 60, 500);
    ctx.fillText("Location: Gulzar Tower (4th Floor), Chawkbazar, Chattogram", 60, 535);

    // Voucher Code
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`Voucher Code: ${voucherCode || 'ZCC-SCH-2028-OFFICIAL'}`, 60, 590);

    const image = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.href = image;
    link.download = `Zahid_Chem_Clinic_Scholarship_${formData.sscRoll}.jpg`;
    link.click();
  };

  // ---------------------------------------------------------------------------
  // 2. Download as Print-Ready PDF
  // ---------------------------------------------------------------------------
  const downloadAsPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Scholarship Voucher - ${formData.fullName}</title>
          <style>
            @page { size: landscape; margin: 0; }
            body { margin: 0; font-family: sans-serif; background: #0f172a; color: white; padding: 40px; }
            .card { border: 4px solid #f59e0b; padding: 35px; border-radius: 24px; background: linear-gradient(135deg, #0f172a, #1e1b4b); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
            .badge { background: #f59e0b; color: #0f172a; font-weight: 900; padding: 12px 24px; border-radius: 12px; float: right; font-size: 26px; }
            h1 { color: #f59e0b; margin: 0 0 10px 0; font-size: 20px; text-transform: uppercase; tracking-wide: 2px; }
            h2 { margin: 0 0 20px 0; font-size: 32px; color: white; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; background: rgba(255,255,255,0.06); padding: 25px; border-radius: 16px; margin: 25px 0; border: 1px solid rgba(255,255,255,0.1); }
            .label { color: #94a3b8; font-size: 13px; text-transform: uppercase; font-weight: bold; }
            .val { color: white; font-size: 22px; font-weight: bold; margin-top: 6px; }
            .disclaimer { color: #f59e0b; font-size: 13px; font-style: italic; margin-bottom: 12px; font-weight: bold; }
            .footer { color: #cbd5e1; font-size: 16px; line-height: 1.7; }
            .code { color: #f59e0b; font-family: monospace; font-size: 16px; margin-top: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">25%+ OFF</div>
            <h1>Zahid's Chem Clinic • Official Scholarship Voucher</h1>
            <h2>HSC'28 Chemistry 1st Paper Offline Course</h2>
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.2); margin-bottom: 25px;">
            <div class="grid">
              <div>
                <div class="label">Student Name</div>
                <div class="val">${formData.fullName}</div>
              </div>
              <div>
                <div class="label">SSC Roll</div>
                <div class="val">${formData.sscRoll}</div>
              </div>
              <div>
                <div class="label">School Name</div>
                <div class="val">${formData.school}</div>
              </div>
              <div>
                <div class="label">Mobile Number</div>
                <div class="val">${formData.mobile}</div>
              </div>
            </div>
            <div class="disclaimer">*শর্ত প্রযোজ্য | Terms & Conditions Apply</div>
            <div class="footer">
              <strong>Teacher:</strong> Zahid Sir &nbsp;|&nbsp; <strong>Hotline:</strong> 01841783983<br>
              <strong>Location:</strong> Gulzar Tower (4th Floor), Chawkbazar, Chattogram
            </div>
            <div class="code">Voucher Code: ${voucherCode || 'ZCC-SCH-2028-OFFICIAL'}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-jakarta">
      
      <div 
        className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-6 sm:p-7 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md">
              <Beaker className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-outfit font-extrabold text-lg sm:text-xl text-white">
                {step === 'form' ? 'Claim 25%+ Scholarship' : 'Scholarship Card Issued'}
              </h3>
              <p className="text-xs text-indigo-200">Zahid's Chem Clinic • HSC '28 Batch</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          
          {step === 'form' ? (
            /* STEP 1: FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Student Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    SSC Roll <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="sscRoll"
                      required
                      placeholder="e.g. 109842"
                      value={formData.sscRoll}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      name="mobile"
                      required
                      placeholder="01XXXXXXXXX"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  School Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="school"
                    required
                    placeholder="Enter your school name"
                    value={formData.school}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-outfit py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Generating Scholarship Card...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Generate Scholarship Card</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: GENERATED SCHOLARSHIP CARD */
            <div className="space-y-6">
              
              {/* Official Card Preview Container */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-7 rounded-2xl border-2 border-amber-500/80 shadow-xl space-y-4 text-left relative overflow-hidden">
                
                {/* Header */}
                <div className="flex items-start justify-between border-b border-white/15 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                      Zahid's Chem Clinic • Official Voucher
                    </span>
                    <h4 className="font-outfit font-extrabold text-lg text-white">
                      HSC'28 Chemistry 1st Paper Offline Course
                    </h4>
                  </div>
                  <span className="px-3 py-1 bg-amber-500 text-slate-950 font-outfit font-black text-sm rounded-lg shrink-0 shadow">
                    25%+ OFF
                  </span>
                </div>

                {/* Grid Details */}
                <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl text-xs sm:text-sm border border-white/10">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">STUDENT NAME</span>
                    <span className="font-bold text-white block truncate">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">SSC ROLL</span>
                    <span className="font-mono font-bold text-white block">{formData.sscRoll}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">SCHOOL NAME</span>
                    <span className="font-semibold text-white block truncate">{formData.school}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">MOBILE</span>
                    <span className="font-mono font-semibold text-white block">{formData.mobile}</span>
                  </div>
                </div>

                {/* Terms Disclaimer Text */}
                <p className="text-[11px] italic font-semibold text-amber-400/90 tracking-wide">
                  *শর্ত প্রযোজ্য | Terms &amp; Conditions Apply
                </p>

                {/* Contact & Location */}
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span><strong>Teacher:</strong> Zahid Sir</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Hotline:</strong> 01841783983</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong>Location:</strong> Gulzar Tower (4th Floor), Chawkbazar, Chattogram</span>
                  </div>
                </div>

                {/* Voucher Code Footer */}
                <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-mono text-amber-400">
                  <span>Code: {voucherCode}</span>
                  <span className="text-emerald-400 font-sans font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>

              </div>

              {/* Download Buttons Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={downloadAsJPG}
                  className="font-outfit py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Download JPG</span>
                </button>

                <button
                  onClick={downloadAsPDF}
                  className="font-outfit py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>

              <div className="pt-1 text-center">
                <a
                  href="tel:01841783983"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Have questions? Call Zahid Sir directly at 01841783983</span>
                </a>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
