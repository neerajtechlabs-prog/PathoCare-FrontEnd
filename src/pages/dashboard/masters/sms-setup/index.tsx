import { useState } from 'react';
import { Plus, Edit2, Trash2, MessageSquare, Copy, Check } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface SMSTemplate {
  id: string;
  name: string;
  trigger: string;
  message: string;
  variables: string[];
  status: 'active' | 'inactive';
  smsCount: number;
}

interface SMSConfig {
  provider: string;
  accountSID: string;
  authToken: string;
  senderID: string;
  dailyQuota: number;
  monthlyUsage: number;
}

const mockTemplates: SMSTemplate[] = [
  {
    id: '1',
    name: 'Booking Confirmation',
    trigger: 'After booking created',
    message: 'Hi {{PATIENT_NAME}}, your booking is confirmed for {{TEST_NAME}} on {{DATE}} at {{CENTER}}. Ref: {{BOOKING_ID}}',
    variables: ['PATIENT_NAME', 'TEST_NAME', 'DATE', 'CENTER', 'BOOKING_ID'],
    status: 'active',
    smsCount: 324,
  },
  {
    id: '2',
    name: 'Sample Collection Reminder',
    trigger: 'Day before collection',
    message: 'Reminder: Please visit {{CENTER}} tomorrow at {{TIME}} for sample collection. Bring your ID proof.',
    variables: ['CENTER', 'TIME'],
    status: 'active',
    smsCount: 156,
  },
  {
    id: '3',
    name: 'Results Ready',
    trigger: 'When results are generated',
    message: 'Hello {{PATIENT_NAME}}, your test results are ready! Download from {{PORTAL_LINK}}',
    variables: ['PATIENT_NAME', 'PORTAL_LINK'],
    status: 'active',
    smsCount: 89,
  },
  {
    id: '4',
    name: 'Payment Reminder',
    trigger: 'When payment pending',
    message: 'Hi {{PATIENT_NAME}}, pending amount: {{AMOUNT}}. Pay now: {{PAYMENT_LINK}}',
    variables: ['PATIENT_NAME', 'AMOUNT', 'PAYMENT_LINK'],
    status: 'inactive',
    smsCount: 0,
  },
];

export default function SMSSetupPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'config'>('templates');
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [config, setConfig] = useState<SMSConfig>({
    provider: 'Twilio',
    accountSID: 'AC123456789',
    authToken: '••••••••••••••••',
    senderID: 'PATHOCARE',
    dailyQuota: 5000,
    monthlyUsage: 45230,
  });

  const handleCopyTemplate = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">SMS Setup</h2>
          <p className="mt-2 text-sm text-slate-500">Configure SMS templates, providers, and communication preferences.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 bg-white">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'templates'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          SMS Templates ({mockTemplates.length})
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'config'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Provider Configuration
        </button>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Active Templates</h3>
              <p className="mt-1 text-sm text-slate-500">{mockTemplates.filter(t => t.status === 'active').length} active templates configured</p>
            </div>
            <Button onClick={() => setShowModal(true)} className="gap-2">
              <Plus size={16} />
              New Template
            </Button>
          </div>

          {mockTemplates.map((template) => (
            <Card key={template.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <MessageSquare size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{template.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{template.trigger}</p>
                  </div>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${template.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                  {template.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm text-slate-700">{template.message}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Variables</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {template.variables.map((v, idx) => (
                        <span key={idx} className="inline-flex rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
                          {`{{${v}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <p className="text-xs text-slate-500">SMS Sent</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{template.smsCount}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCopyTemplate(template.id)}
                    className="gap-1"
                  >
                    {copiedId === template.id ? (
                      <>
                        <Check size={14} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </Button>
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
      )}

      {/* Config Tab */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <Card title="SMS Service Provider" subtitle="Configure your SMS gateway">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Provider</label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Twilio</option>
                  <option>AWS SNS</option>
                  <option>Msg91</option>
                  <option>Route Mobile</option>
                </select>
              </div>

              <Input
                label="Sender ID"
                value={config.senderID}
                onChange={(e) => setConfig({ ...config, senderID: e.target.value })}
                placeholder="PATHOCARE"
              />

              <Input
                label="Account SID"
                value={config.accountSID}
                onChange={(e) => setConfig({ ...config, accountSID: e.target.value })}
                placeholder="Your account ID"
              />

              <Input
                label="Auth Token"
                type="password"
                value={config.authToken}
                onChange={(e) => setConfig({ ...config, authToken: e.target.value })}
                placeholder="Your auth token"
              />

              <Input
                label="Daily Quota"
                type="number"
                value={config.dailyQuota}
                onChange={(e) => setConfig({ ...config, dailyQuota: parseInt(e.target.value) })}
                placeholder="5000"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary">Test Connection</Button>
              <Button>Save Configuration</Button>
            </div>
          </Card>

          <Card title="SMS Usage Statistics" subtitle="Track your SMS consumption">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-600">Daily Quota</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{config.dailyQuota.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-600">Monthly Usage</p>
                <p className="mt-2 text-3xl font-bold text-indigo-600">{config.monthlyUsage.toLocaleString()}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {((config.monthlyUsage / (config.dailyQuota * 30)) * 100).toFixed(1)}% of capacity
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
                <p className="text-sm text-slate-600">Status</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <p className="font-semibold text-slate-900">Connected</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Webhook Configuration" subtitle="Receive delivery and response notifications">
            <div className="space-y-4">
              <Input
                label="Delivery Notification URL"
                value="https://pathocare.com/webhooks/sms/delivery"
                readOnly
                className="bg-slate-50"
              />
              <Input
                label="Response Callback URL"
                value="https://pathocare.com/webhooks/sms/response"
                readOnly
                className="bg-slate-50"
              />
              <div className="text-sm text-slate-600">
                <p className="mb-2 font-medium">Webhook Events:</p>
                <ul className="list-inside list-disc space-y-1 text-xs">
                  <li>Message delivery confirmations</li>
                  <li>Bounce and failure reports</li>
                  <li>Incoming SMS replies (if enabled)</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
