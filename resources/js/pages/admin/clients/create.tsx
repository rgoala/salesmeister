import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const breadcrumbs = [
    { title: 'Clients', href: '/clients' },
    { title: 'Add Client', href: '/admin/clients/create' },
];

export default function CreateClient() {
    const [countries, setCountries] = useState<any[]>([]);
    const [contacts, setContacts] = useState([{ name: '', email: '', phone: '' }]);

    const { data, setData, processing, post, reset, errors } = useForm({
        organization_name: '',
        email: '',
        phone: '',
        fax: '',
        address1: '',
        address2: '',
        city_id: '',
        state_id: '',
        country_id: '',
        zip: '',
        website: '',
        contacts: contacts,
    });

    useEffect(() => {
        axios.get('/countries/getcountries')
            .then((response) => {
                setCountries(response.data || []);
            })
            .catch(() => setCountries([]));
    }, []);

    // Keep contacts in sync with form data
    useEffect(() => {
        setData('contacts', contacts);
    }, [contacts]);

    const handleContactChange = (idx: number, field: string, value: string) => {
        const updated = [...contacts];
        updated[idx][field as keyof typeof updated[0]] = value;
        setContacts(updated);
    };

    const handleAddContact = () => {
        setContacts([...contacts, { name: '', email: '', phone: '' }]);
    };

    const handleRemoveContact = (idx: number) => {
        setContacts(contacts.filter((_, i) => i !== idx));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData(e.target.name, e.target.value);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/clients/store', {
            onSuccess: () => {
                reset();
                setContacts([{ name: '', email: '', phone: '' }]);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Client" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <form onSubmit={submit} className="justify-left relative flex h-full w-full flex-col items-center p-4">
                        <div className="mt-4 w-full max-w-2xl">
                            <h2 className="text-xl font-bold mb-4">Add New Client</h2>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-700 mb-1">Organization Name</label>
                                <input
                                    name="organization_name"
                                    value={data.organization_name}
                                    onChange={handleChange}
                                    className="w-full rounded border px-2 py-1 text-xs"
                                    required
                                />
                                {errors.organization_name && <p className="text-xs text-red-500 italic">{errors.organization_name}</p>}
                            </div>
                            <div className="mb-4 flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    />
                                    {errors.email && <p className="text-xs text-red-500 italic">{errors.email}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                                    <input
                                        name="phone"
                                        value={data.phone}
                                        onChange={handleChange}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    />
                                    {errors.phone && <p className="text-xs text-red-500 italic">{errors.phone}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Fax</label>
                                    <input
                                        name="fax"
                                        value={data.fax}
                                        onChange={handleChange}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    />
                                    {errors.fax && <p className="text-xs text-red-500 italic">{errors.fax}</p>}
                                </div>
                            </div>
                            <div className="mb-4 flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Address 1</label>
                                    <input
                                        name="address1"
                                        value={data.address1}
                                        onChange={handleChange}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    />
                                    {errors.address1 && <p className="text-xs text-red-500 italic">{errors.address1}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Address 2</label>
                                    <input
                                        name="address2"
                                        value={data.address2}
                                        onChange={handleChange}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    />
                                    {errors.address2 && <p className="text-xs text-red-500 italic">{errors.address2}</p>}
                                </div>
                            </div>
                            <div className="mb-4 flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                                    <input
                                        name="city_id"
                                        value={data.city_id}
                                        onChange={handleChange}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    />
                                    {errors.city_id && <p className="text-xs text-red-500 italic">{errors.city_id}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                                    <input
                                        name="state_id"
                                        value={data.state_id}
                                        onChange={handleChange}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    />
                                    {errors.state_id && <p className="text-xs text-red-500 italic">{errors.state_id}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Country</label>
                                    <select
                                        name="country_id"
                                        value={data.country_id}
                                        onChange={handleChange}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map((country: any) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.country_id && <p className="text-xs text-red-500 italic">{errors.country_id}</p>}
                                </div>
                            </div>
                            <div className="mb-4 flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Postal Code</label>
                                    <input
                                        name="postal_code"
                                        value={data.zip}
                                        onChange={handleChange}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    />
                                    {errors.zip && <p className="text-xs text-red-500 italic">{errors.zip}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Website</label>
                                    <input
                                        name="website"
                                        value={data.website}
                                        onChange={handleChange}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    />
                                    {errors.website && <p className="text-xs text-red-500 italic">{errors.website}</p>}
                                </div>
                            </div>
                            {/* --- Contacts Section --- */}
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-700 mb-2">
                                    Contacts
                                </label>
                                {contacts.map((contact, idx) => (
                                    <div key={idx} className="flex flex-row gap-2 mb-2 items-end">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Contact Name"
                                                value={contact.name}
                                                onChange={e => handleContactChange(idx, 'name', e.target.value)}
                                                className="w-full rounded border px-2 py-1 text-xs"
                                                required
                                            />
                                            {errors[`contacts.${idx}.name`] && (
                                                <p className="text-xs text-red-500 italic">{errors[`contacts.${idx}.name`]}</p>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="email"
                                                placeholder="Contact Email"
                                                value={contact.email}
                                                onChange={e => handleContactChange(idx, 'email', e.target.value)}
                                                className="w-full rounded border px-2 py-1 text-xs"
                                            />
                                            {errors[`contacts.${idx}.email`] && (
                                                <p className="text-xs text-red-500 italic">{errors[`contacts.${idx}.email`]}</p>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Contact Phone"
                                                value={contact.phone}
                                                onChange={e => handleContactChange(idx, 'phone', e.target.value)}
                                                className="w-full rounded border px-2 py-1 text-xs"
                                            />
                                            {errors[`contacts.${idx}.phone`] && (
                                                <p className="text-xs text-red-500 italic">{errors[`contacts.${idx}.phone`]}</p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded"
                                            onClick={() => handleRemoveContact(idx)}
                                            disabled={contacts.length === 1}
                                            title="Remove Contact"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="mt-2 px-4 py-1 bg-green-500 text-white text-xs rounded"
                                    onClick={handleAddContact}
                                >
                                    Add Contact
                                </button>
                            </div>
                            {/* --- End Contacts Section --- */}
                            <div className="mt-4 justify-end flex w-full">
                                <Link href="/clients" className="mt-4 mr-4 rounded text-xs bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                                    Back
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`mt-4 rounded bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 ${processing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                    Create Client
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}