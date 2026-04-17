import { useState } from 'react';
import { MdAdd, MdAccountBalanceWallet, MdOutlineWorkspacePremium } from 'react-icons/md';
import { StatCard } from '../components/ui/Cards';
import { Modal, Button, Input } from '../components/ui/FormElements';
import toast from 'react-hot-toast';

const MOCK_ACQUISITIONS = [
  { id: '1', name: 'Porsche 911 Carrera', target: 120000, saved: 45000, image: 'https://images.unsplash.com/photo-1506015391300-415ea7fa780d?auto=format&fit=crop&q=80&w=800' },
  { id: '2', name: 'Swiss Alp Chalet Downpayment', target: 250000, saved: 200000, image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800' },
  { id: '3', name: 'Patek Philippe Nautilus', target: 35000, saved: 12000, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800' }
];

export default function Acquisitions() {
  const [acquisitions, setAcquisitions] = useState(MOCK_ACQUISITIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', target: '', image: '' });
  const [fundAmount, setFundAmount] = useState('');

  const totalTarget = acquisitions.reduce((sum, item) => sum + item.target, 0);
  const totalSaved = acquisitions.reduce((sum, item) => sum + item.saved, 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.target) {
      toast.error('Please fill required fields');
      return;
    }
    const newItem = {
      id: Date.now().toString(),
      name: formData.name,
      target: parseFloat(formData.target),
      saved: 0,
      image: formData.image || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800'
    };
    setAcquisitions([...acquisitions, newItem]);
    toast.success('Acquisition goal created');
    setShowAddModal(false);
    setFormData({ name: '', target: '', image: '' });
  };

  const handleFund = (e) => {
    e.preventDefault();
    if (!fundAmount || !selectedItem) return;
    
    const amount = parseFloat(fundAmount);
    setAcquisitions(acquisitions.map(item => 
      item.id === selectedItem.id 
        ? { ...item, saved: Math.min(item.saved + amount, item.target) }
        : item
    ));
    toast.success('Funds allocated successfully');
    setShowFundModal(false);
    setFundAmount('');
    setSelectedItem(null);
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
        <Button onClick={() => setShowAddModal(true)} className="hidden md:flex">
          <MdAdd className="text-lg" />
          New Goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <StatCard
          title="Total Allocated Funds"
          value={`$${totalSaved.toLocaleString()}`}
          icon={<MdAccountBalanceWallet />}
        />
        <StatCard
          title="Portfolio Target"
          value={`$${totalTarget.toLocaleString()}`}
          icon={<MdOutlineWorkspacePremium />}
        />
      </div>

      {/* Acquisitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {acquisitions.map(item => {
          const progress = Math.min((item.saved / item.target) * 100, 100);
          return (
            <div key={item.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-malachite group transition-smooth hover:shadow-malachite-lg flex flex-col">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-lg font-bold text-tracking-tight truncate">{item.name}</h3>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-on-surface font-semibold text-lg">${item.saved.toLocaleString()}</p>
                    <p className="text-on-surface-variant text-xs">of ${item.target.toLocaleString()}</p>
                  </div>
                  <div className="h-2 bg-surface-container-low rounded-full overflow-hidden mb-6">
                    <div 
                      className="h-full gradient-primary rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowFundModal(true);
                  }}
                >
                  Allocate Funds
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 rounded-2xl gradient-primary text-on-primary shadow-malachite-lg flex items-center justify-center z-40 transition-smooth hover:scale-105 active:scale-95 cursor-pointer"
      >
        <MdAdd className="text-2xl" />
      </button>

      {/* Add Goal Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Acquisition Goal">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Item Name"
            placeholder="e.g., Porsche 911 Carrera"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <Input
            label="Target Amount"
            type="number"
            placeholder="120000"
            value={formData.target}
            onChange={e => setFormData({...formData, target: e.target.value})}
          />
          <Input
            label="Image URL (Optional)"
            placeholder="https://..."
            value={formData.image}
            onChange={e => setFormData({...formData, image: e.target.value})}
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Create Goal</Button>
          </div>
        </form>
      </Modal>

      {/* Allocate Funds Modal */}
      <Modal isOpen={showFundModal} onClose={() => setShowFundModal(false)} title="Allocate Funds">
        <form onSubmit={handleFund} className="space-y-4">
          <p className="text-on-surface-variant text-sm">
            Allocating liquidity towards <span className="font-semibold text-on-surface">{selectedItem?.name}</span>
          </p>
          <Input
            label="Amount to Allocate"
            type="number"
            placeholder="0.00"
            value={fundAmount}
            onChange={e => setFundAmount(e.target.value)}
            autoFocus
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowFundModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Confirm Allocation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
