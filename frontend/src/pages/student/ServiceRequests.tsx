import React, { useState } from 'react';
import { dataService } from '../../services/dataService';
import { GlassCard } from '../../components/ui/GlassCard';
import { RippleButton } from '../../components/ui/RippleButton';
import { Modal } from '../../components/ui/Modal';
import { Wrench, Plus, Clock, CheckCircle2, Calendar, MapPin } from 'lucide-react';

export const ServiceRequests: React.FC = () => {
  const [services, setServices] = useState(() => dataService.getServiceRequests());
  const [showModal, setShowModal] = useState(false);
  const [serviceType, setServiceType] = useState('Seminar Hall Audio-Visual Setup');
  const [location, setLocation] = useState('CS Block Auditorium');
  const [description, setDescription] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('2026-08-22 14:00 - 16:00');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = dataService.createServiceRequest({
      service_type: serviceType,
      location,
      description,
      preferred_slot: preferredSlot,
    });
    setServices(dataService.getServiceRequests());
    setShowModal(false);
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
            <Wrench className="w-7 h-7 text-indigo-400" />
            <span>Campus Service Requests</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Request non-complaint campus maintenance, venue bookings, and equipment setup.
          </p>
        </div>

        <RippleButton
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          Request Campus Service
        </RippleButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <GlassCard key={s.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{s.service_type}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border bg-amber-500/10 border-amber-500/30 text-amber-400">
                {s.status}
              </span>
            </div>

            <p className="text-sm font-semibold text-white">{s.description}</p>

            <div className="pt-3 border-t border-slate-800 flex flex-col space-y-1.5 text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Location: <strong className="text-slate-200">{s.location}</strong></span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Time Slot: <strong className="text-slate-200">{s.preferred_slot}</strong></span>
              </span>
            </div>
          </GlassCard>
        ))}
      </div>

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Campus Service Request">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Seminar Hall Audio-Visual Setup">Seminar Hall Audio-Visual Setup</option>
                <option value="Hostel Room Deep Sanitization">Hostel Room Deep Sanitization</option>
                <option value="Event Furniture & Seating Arrangement">Event Furniture & Seating Arrangement</option>
                <option value="Laboratory Special Apparatus Request">Laboratory Special Apparatus Request</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Campus Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Preferred Date & Time Slot</label>
              <input
                type="text"
                value={preferredSlot}
                onChange={(e) => setPreferredSlot(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Request Notes</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <RippleButton type="submit" variant="primary" className="w-full">
              Submit Service Order
            </RippleButton>
          </form>
        </Modal>
      )}
    </div>
  );
};
