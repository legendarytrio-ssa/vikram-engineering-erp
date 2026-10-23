// src/components/landing/CommissionFooter.jsx
import React, { useState, useRef } from "react";

const ERP_ROLES = [
  { id: "ceo", label: "CEO (All Departments & Tender Sanction)" },
  { id: "operations", label: "Operations Head (Purchase, Allocation & QC)" },
  { id: "accounts", label: "Accounts Head (Monthly Wages & Ops Finance)" },
  { id: "sales", label: "Sales & Marketing Head (Clients, Daily Ops & RM)" },
];

export default function CommissionFooter({
  isActive,
  onBackToTop,
  onStepUp,
  onRoleNavigate,
}) {
  const [status, setStatus] = useState("");
  const [selectedRole, setSelectedRole] = useState(ERP_ROLES[0].id);
  const scrollContainerRef = useRef(null);

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    setStatus(
      `Thank you, ${name}. Your tender/project enquiry has been logged into the Clients CRM queue for CEO & Sales review.`
    );
    e.currentTarget.reset();
  };

  const handleGatewaySubmit = (e) => {
    e.preventDefault();
    if (onRoleNavigate) {
      onRoleNavigate(selectedRole);
    }
  };

  // If the user scrolls up while at the very top of the footer, transition back to Chapter 08
  const handleFooterWheel = (e) => {
    if (!isActive) return;
    const el = scrollContainerRef.current;
    if (e.deltaY < -25 && (!el || el.scrollTop <= 0)) {
      e.stopPropagation();
      if (onStepUp) onStepUp();
    }
  };

  return (
    <footer
      onWheel={handleFooterWheel}
      aria-label="Submit a Tender Enquiry or Enter Vikram-Engineer Gateway"
      className={`fixed inset-0 z-30 bg-[#eae0cc] text-[#272219] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[0_-10px_30px_rgba(0,0,0,0.65)] ${
        isActive
          ? "translate-y-0 pointer-events-auto"
          : "translate-y-full pointer-events-none"
      }`}
    >
      {/* Torn Deckle Paper Top Edge */}
      <svg
        className="absolute left-0 right-0 bottom-full w-full h-[28px] text-[#eae0cc] fill-current pointer-events-none"
        viewBox="0 0 1200 28"
        preserveAspectRatio="none"
      >
        <path d="M0,28 L0,12 Q30,4 60,14 T120,10 T180,15 T240,8 T300,14 T360,9 T420,16 T480,10 T540,14 T600,7 T660,15 T720,11 T780,16 T840,8 T900,14 T960,10 T1020,15 T1080,9 T1140,14 L1200,10 L1200,28 Z" />
      </svg>

      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto px-6 md:px-14 py-12"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Tender / Client Commission Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-[#963c2f]">
              <span className="w-8 h-[1px] bg-[#a14636]" />
              <span>Tender & Client Desk</span>
            </div>

            <h2 className="font-serif text-[clamp(40px,5vw,72px)] leading-[0.94] tracking-[-0.016em]">
              Initiate a Tender
              <span className="font-mono text-[0.24em] tracking-[0.18em] uppercase text-[#8d392f] align-middle ml-3">
                TENDER REGISTRY
              </span>
            </h2>

            <p className="font-serif italic text-[19px] leading-[1.38] text-[#61513d] max-w-xl">
              Every sanctioned project begins with client discovery. Submit government or market tender specifications below to map with our Clients database.
            </p>

            <form onSubmit={handleEnquirySubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <label className="grid gap-1.5">
                <span className="text-[11px] tracking-[0.12em] uppercase text-[#5e4d37]">
                  Client / Organization
                </span>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Dept. of Defense / BuildCorp"
                  className="w-full bg-transparent border-b border-[#3c2c18]/35 py-2 text-[15px] text-[#2b2116] placeholder-[#6f5e47] focus:outline-none focus:border-[#993b2d]"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-[11px] tracking-[0.12em] uppercase text-[#5e4d37]">
                  Official Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="tenders@organization.org"
                  className="w-full bg-transparent border-b border-[#3c2c18]/35 py-2 text-[15px] text-[#2b2116] placeholder-[#6f5e47] focus:outline-none focus:border-[#993b2d]"
                />
              </label>

              <label className="sm:col-span-2 grid gap-1.5">
                <span className="text-[11px] tracking-[0.12em] uppercase text-[#5e4d37]">
                  Metallurgical Specification & Project Type (Gov / Market)
                </span>
                <input
                  name="note"
                  type="text"
                  required
                  placeholder="High-Grade Titanium Alloy Rods, Spec-7 Castings, Carbon Billets…"
                  className="w-full bg-transparent border-b border-[#3c2c18]/35 py-2 text-[15px] text-[#2b2116] placeholder-[#6f5e47] focus:outline-none focus:border-[#993b2d]"
                />
              </label>

              <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  className="bg-[#9d382c] hover:bg-[#812d23] text-[#faf2e3] px-6 py-3.5 text-[11px] tracking-[0.12em] uppercase flex items-center justify-center gap-4 transition-colors cursor-pointer"
                >
                  <span>Log Tender Request</span>
                  <span className="text-[16px]">↗</span>
                </button>
                {status && (
                  <p className="font-serif italic text-[14.5px] text-[#6b5637]">
                    {status}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: ERP Authorization Gateway Card */}
          <div className="lg:col-span-5 lg:border-l border-[#44311d]/20 lg:pl-9 space-y-6">
            <div className="p-6 bg-[#dfd3bc] border border-[#44311d]/20 rounded-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[0.18em] uppercase text-[#8d392f] font-semibold">
                  RBAC Authorization Gateway
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-[#9d382c] text-[#faf2e3]">
                  JWT Guarded
                </span>
              </div>

              <h3 className="font-serif text-2xl text-[#272219]">
                Enter Departmental Workspace
              </h3>
              <p className="text-[13px] leading-relaxed text-[#5b4c38]">
                Select your clearance role to initialize your encapsulated dashboard view.
              </p>

              <form onSubmit={handleGatewaySubmit} className="space-y-4">
                <label className="block space-y-1.5">
                  <span className="text-[11px] tracking-[0.12em] uppercase text-[#5e4d37]">
                    Select Clearance Level
                  </span>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-[#eae0cc] border border-[#3c2c18]/35 px-3 py-2.5 text-[14px] text-[#272219] focus:outline-none focus:border-[#9d382c] cursor-pointer"
                  >
                    {ERP_ROLES.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="submit"
                  className="w-full bg-[#272219] hover:bg-[#100c08] text-[#f2ece2] py-3.5 px-5 text-[11px] tracking-[0.14em] uppercase flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>Initialize Workspace</span>
                  <span>→</span>
                </button>
              </form>
            </div>

            {/* Architecture Specs Summary */}
            <div className="grid grid-cols-2 gap-4 text-[12.5px] leading-relaxed text-[#5b4c38] pt-2">
              <div>
                <b className="block text-[10.5px] tracking-[0.18em] uppercase text-[#6a5034] mb-1">
                  Stack & Storage
                </b>
                MongoDB Atlas · Express<br />
                React.js · Cloudflare R2
              </div>
              <div>
                <b className="block text-[10.5px] tracking-[0.18em] uppercase text-[#6a5034] mb-1">
                  Departments
                </b>
                Operations · Accounts<br />
                Sales & Marketing · CEO
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-6xl mx-auto mt-12 pt-5 border-t border-[#3c2c18]/20 flex flex-wrap items-center justify-between gap-4 text-[11px] tracking-[0.1em] text-[#65543f]">
          <span className="text-[#413425] font-medium">
            VIKRAM-ENGINEER · METALLURGY ERP SYSTEM
          </span>
          <div className="flex items-center gap-6">
            <button
              onClick={onStepUp}
              className="uppercase tracking-[0.12em] text-[#5c4a30] hover:text-[#9d382c] cursor-pointer"
            >
              ↑ Previous Module
            </button>
            <button
              onClick={onBackToTop}
              className="uppercase tracking-[0.12em] text-[#5c4a30] hover:text-[#9d382c] cursor-pointer"
            >
              Back to the Forge ↑↑
            </button>
          </div>
          <span>© 2026 VIKRAM-ENGINEER · ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </footer>
  );
}