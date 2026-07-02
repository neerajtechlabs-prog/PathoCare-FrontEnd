import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface UserRateList {
  id: string;
  username: string;
  rateCard: string;
  discount: number;
  validFrom: string;
  validTill: string;
  status: 'active' | 'inactive';
}

const mockRates: UserRateList[] = [
  { id: '1', username: 'admin@pathocare', rateCard: 'Standard', discount: 0, validFrom: '2024-01-01', validTill: '2025-12-31', status: 'active' },
  { id: '2', username: 'manager1@pathocare', rateCard: 'Premium', discount: 10, validFrom: '2024-01-01', validTill: '2025-12-31', status: 'active' },
  { id: '3', username: 'operator1@pathocare', rateCard: 'Standard', discount: 5, validFrom: '2024-02-01', validTill: '2025-01-31', status: 'active' },
];

export default function UserRateListPage() {
  const [rates, setRates] = useState<UserRateList[]>(mockRates);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredRates = rates.filter((r) => r.username.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">User Rate List</h2>
          <p className="mt-2 text-sm text-slate-500">Assign rate cards and discounts to user accounts.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus size={16} />
          Add Rate
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-0" />
        </div>
      </Card>

      <Card title={`User Rates (${filteredRates.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Username</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Rate Card</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Discount</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Valid From</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Valid Till</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRates.map((rate) => (
                <tr key={rate.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{rate.username}</td>
                  <td className="px-4 py-3 text-slate-600">{rate.rateCard}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{rate.discount}%</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{rate.validFrom}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{rate.validTill}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${rate.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                      {rate.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary">
                        <Edit2 size={14} />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Add User Rate</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Select User</label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option>Select...</option>
                  <option>admin@pathocare</option>
                  <option>manager1@pathocare</option>
                  <option>operator1@pathocare</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Rate Card</label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Corporate</option>
                </select>
              </div>
              <Input label="Additional Discount %" type="number" placeholder="0" />
              <Input label="Valid From" type="date" />
              <Input label="Valid Till" type="date" />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button>Add Rate</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
