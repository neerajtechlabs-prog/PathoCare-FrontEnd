import { useState } from 'react';
import { Formik, Form } from 'formik';
import { Save } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface OwnerProfile {
  crnId: string;
  labCode: string;
  firmName: string;
  ownerName: string;
  degree: string;
  address: string;
  state: string;
  city: string;
  phone: string;
  mobile: string;
  fax: string;
  operatingHours: string;
  web: string;
  tagLine: string;
}

// Simple validation function
const validateForm = (values: OwnerProfile) => {
  const errors: Partial<Record<keyof OwnerProfile, string>> = {};
  
  if (!values.crnId.trim()) errors.crnId = 'CRNID is required';
  if (!values.labCode.trim()) errors.labCode = 'Lab Code is required';
  if (!values.firmName.trim()) errors.firmName = 'Firm Name is required';
  if (!values.ownerName.trim()) errors.ownerName = 'Owner Name is required';
  if (!values.degree.trim()) errors.degree = 'Degree is required';
  if (!values.address.trim()) errors.address = 'Address is required';
  if (!values.state.trim()) errors.state = 'State is required';
  if (!values.city.trim()) errors.city = 'City is required';
  if (!values.mobile.trim()) errors.mobile = 'Mobile is required';
  
  return errors;
};

export default function OwnerProfilePage() {
  const [saved, setSaved] = useState(false);

  const initialValues: OwnerProfile = {
    crnId: '469',
    labCode: 'JPL',
    firmName: 'JERATH PATH LAB & ALLERGY TESTING CENTRE',
    ownerName: 'Dr Vikash',
    degree: 'B.Sc. M.L.T',
    address: '723/6 Jagrati Vihar Meerut Landmark - Mansadevmandir Road',
    state: 'Uttar Pradesh',
    city: 'Meerut',
    phone: '',
    mobile: '8077805674',
    fax: '',
    operatingHours: '11TO 10',
    web: '',
    tagLine: '',
  };

  const handleSubmit = async (values: OwnerProfile) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      console.log('Profile saved:', values);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Owner Profile</h2>
        <p className="mt-2 text-sm text-slate-500">Configure the laboratory's master identity record. This information appears on all reports, bills, and official documents.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          Profile updated successfully
        </div>
      )}

      <Formik initialValues={initialValues} validate={validateForm} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <Card title="Laboratory Information" subtitle="Core registration and identity details">
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="CRNID"
                  name="crnId"
                  placeholder="e.g., 469"
                />
                <Input
                  label="Lab Code"
                  name="labCode"
                  placeholder="e.g., JPL"
                />
              </div>
              <div className="mt-6">
                <Input
                  label="Firm Name"
                  name="firmName"
                  placeholder="Laboratory or diagnostic centre name"
                />
              </div>
            </Card>

            <Card title="Owner / Director Information" subtitle="Owner and qualification details">
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Owner's Name"
                  name="ownerName"
                  placeholder="Full name"
                />
                <Input
                  label="Degree"
                  name="degree"
                  placeholder="e.g., B.Sc. M.L.T"
                />
              </div>
            </Card>

            <Card title="Address Details" subtitle="Physical location and communication">
              <div className="space-y-6">
                <Input
                  label="Address"
                  name="address"
                  placeholder="Street address / landmark"
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="State"
                    name="state"
                    placeholder="State or province"
                  />
                  <Input
                    label="City"
                    name="city"
                    placeholder="City name"
                  />
                </div>
              </div>
            </Card>

            <Card title="Contact Information" subtitle="Phone, fax, and web details">
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  placeholder="Landline number"
                />
                <Input
                  label="Mobile"
                  name="mobile"
                  type="tel"
                  placeholder="Mobile number"
                />
                <Input
                  label="Fax"
                  name="fax"
                  placeholder="Fax number"
                />
                <Input
                  label="Web"
                  name="web"
                  type="url"
                  placeholder="Website URL"
                />
              </div>
            </Card>

            <Card title="Operating Details" subtitle="Hours and description">
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Operating Hours"
                  name="operatingHours"
                  placeholder="e.g., 11TO 10"
                />
                <Input
                  label="Tag Line"
                  name="tagLine"
                  placeholder="Laboratory tag line or motto"
                />
              </div>
            </Card>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" type="button">Exit</Button>
              <Button type="submit" isLoading={isSubmitting} className="gap-2">
                <Save size={16} />
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
