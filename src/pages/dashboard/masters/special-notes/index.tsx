import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface SpecialNote {
  id: string;
  title: string;
  category: string;
  content: string;
  applyTo: string;
  status: 'active' | 'inactive';
}

const mockNotes: SpecialNote[] = [
  { id: '1', title: 'Fasting Required', category: 'General', content: 'Fast for 8-12 hours before collection', applyTo: 'Blood Sugar, Lipid Profile', status: 'active' },
  { id: '2', title: 'Morning Collection', category: 'Collection', content: 'Collect between 6 AM - 10 AM', applyTo: 'Hormonal Tests', status: 'active' },
  { id: '3', title: 'Medication Note', category: 'Important', content: 'Do not take any medications 24 hours before test', applyTo: 'Coagulation Profile', status: 'active' },
];

export default function SpecialNotesPage() {
  const [notes, setNotes] = useState<SpecialNote[]>(mockNotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredNotes = notes.filter((n) => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Special Notes</h2>
          <p className="mt-2 text-sm text-slate-500">Create and manage special instructions for tests.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus size={16} />
          Add Note
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <Input placeholder="Search notes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-0" />
        </div>
      </Card>

      <div className="space-y-3">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">{note.title}</h3>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{note.category}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{note.content}</p>
              <p className="mt-2 text-xs text-slate-500">Applies to: {note.applyTo}</p>
            </div>
            <div className="ml-4 flex items-center gap-3">
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${note.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                {note.status === 'active' ? 'Active' : 'Inactive'}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">
                  <Edit2 size={14} />
                </Button>
                <Button size="sm" variant="secondary">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Add Special Note</h3>
            <div className="space-y-3">
              <Input label="Title" placeholder="e.g., Fasting Required" />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option>General</option>
                  <option>Collection</option>
                  <option>Important</option>
                </select>
              </div>
              <Input label="Content" placeholder="Instruction details" />
              <Input label="Applies To" placeholder="e.g., Blood Sugar, Lipid Profile" />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button>Save Note</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
