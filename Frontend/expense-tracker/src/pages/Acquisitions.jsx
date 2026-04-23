import { useState } from 'react';
import { MdAdd, MdAccountBalanceWallet, MdOutlineWorkspacePremium, MdDelete } from 'react-icons/md';
import useTransactionStore from '../store/useTransactionStore';
import { StatCard } from '../components/ui/Cards';
import { Modal, Button, Input } from '../components/ui/FormElements';
import toast from 'react-hot-toast';

function getInitialColor(name) {
  const colors = [
    'bg-malachite-100 text-malachite-800',
    'bg-surface-container-high text-on-surface-variant',
    'bg-tertiary-container/30 text-tertiary',
    'bg-malachite-200/50 text-malachite-900',
  ];
  return colors[name.charCodeAt(0) % colors.length];
}

export default function Acquisitions() {
  const { acquisitions, addAcquisition, deleteAcquisition, loading } = useTransactionStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', target: '', saved: '' });

  const totalTarget = acquisitions.reduce((sum, item) => sum + (item.target || 0), 0);
  const totalSaved = acquisitions.reduce((sum, item) => sum + (item.saved || 0), 0);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.target) {
      toast.error('Name and target amount are required');
      return;
    }
    setSubmitting(true);
    try {
      await addAcquisition({
        name: formData.name,
        target: formData.target,
        saved: formData.saved || 0,
      });
      toast.success('Acquisition goal created');
      setShowAddModal(false);
      setFormData({ name: '', target: '', saved: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this acquisition goal?')) return;
    try {
      await deleteAcquisition(id);
      toast.success('Acquisition removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-on-surface text-2xl md:text-3xl font-bold text-tracking-tight">
            Acquisitions
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Curated milestones and luxury asset tracking
          </p>
        </div>
        <div className="hidden md:block">
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <StatCard
          title="Total Allocated Funds"
          value={`$${totalSaved.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={<MdAccountBalanceWallet />}
        />
        <StatCard
          title="Portfolio Target"
          value={`$${totalTarget.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={<MdOutlineWorkspacePremium />}
        />
      </div>

      {/* Empty state */}
      {!loading && acquisitions.length === 0 && (
        <div className="bg-surface-container-lowest rounded-2xl p-12 text-center shadow-malachite">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-4">
            <MdOutlineWorkspacePremium className="text-2xl text-on-surface-variant" />
          </div>
          <p className="text-on-surface-variant text-sm">No acquisition goals yet. Create your first milestone.</p>
        </div>
      )}

      {/* Acquisitions Grid */}
      {acquisitions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {acquisitions.map((item) => {
            const progress = Math.min(((item.saved || 0) / (item.target || 1)) * 100, 100);
            return (
              <div
                key={item.id || item._id}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-malachite group transition-smooth hover:shadow-malachite-lg flex flex-col"
              >
                {/* Header — Initial Avatar */}
                <div className={`h-32 flex items-center justify-center text-6xl font-extrabold ${getInitialColor(item.name)}`}>
                  {item.name.charAt(0).toUpperCase()}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-on-surface text-base font-bold truncate mb-3">{item.name}</h3>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-on-surface font-semibold text-lg">
                        ${(item.saved || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-on-surface-variant text-xs">
                        of ${(item.target || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="h-2 bg-surface-container-low rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full gradient-primary rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-on-surface-variant text-xs text-right mb-4">
                      {progress.toFixed(1)}% funded
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id || item._id)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-surface-container-low text-on-surface-variant hover:bg-error-container hover:text-error transition-smooth cursor-pointer border border-outline-variant/10"
                  >
                    <MdDelete className="text-base" />
                    Remove Goal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Global FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-20 right-4 md:bottom-12 md:right-12 w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-full gradient-primary text-on-primary shadow-malachite-lg flex items-center justify-center z-[90] transition-smooth hover:scale-105 active:scale-95 cursor-pointer"
        title="Add Goal"
      >
        <MdAdd className="text-2xl md:text-3xl" />
      </button>

      {/* Add Goal Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Acquisition Goal">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Goal Name"
            placeholder="e.g., Porsche 911 Carrera"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Target Amount ($)"
            type="number"
            placeholder="120000"
            min="1"
            value={formData.target}
            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
          />
          <Input
            label="Already Saved ($)"
            type="number"
            placeholder="0"
            min="0"
            value={formData.saved}
            onChange={(e) => setFormData({ ...formData, saved: e.target.value })}
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
