import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SplineScene } from "./ui/spline";
import { Card } from "./ui/card";
import { Shield, ChevronDown, ArrowRight, Factory } from 'lucide-react';

const roles = [
  { id: 'ceo', label: 'CEO' },
  { id: 'operations', label: 'Operations Head' },
  { id: 'accounts', label: 'Accounts Head' },
  { id: 'sales', label: 'Sales & Marketing Head' }
];

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState(roles[0].id);
  const navigate = useNavigate();

  const handleEntry = (e) => {
    e.preventDefault();
    navigate(`/${selectedRole}-dashboard`);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-8">
      {/* The parent Card receives the mouse movements for the Spotlight */}
      <Card className="w-full max-w-6xl min-h-[600px] bg-black/[0.96] border-slate-800 relative overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-black/50">
        
        <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center border-r border-slate-800/50 bg-slate-950/40 backdrop-blur-sm pointer-events-auto">
          
          <div className="mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
              <Factory className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              FERROUS<span className="text-amber-500">CORE</span>
            </h1>
            <p className="mt-2 text-neutral-400 max-w-sm text-sm leading-relaxed">
              Secure authentication gateway. Select your clearance level to access departmental workflows and encrypted project data.
            </p>
          </div>

          <form onSubmit={handleEntry} className="space-y-5 max-w-sm w-full">
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" />
                Authorization Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full appearance-none bg-black/50 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all cursor-pointer"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id} className="bg-slate-900">
                      {role.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              Initialize Workspace
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Added explicit sizing (min-h, min-w) to prevent WebGPU Texture Size Error */}
        <div className="hidden md:block flex-1 relative pointer-events-none min-h-[500px] min-w-[300px]">
          <div className="absolute inset-0 bg-gradient-to-r from-black/[0.96] via-transparent to-transparent z-10 w-24" />
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full pointer-events-auto"
          />
        </div>
      </Card>
    </div>
  );
}