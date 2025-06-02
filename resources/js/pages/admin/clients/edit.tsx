import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const breadcrumbs = [
    { title: 'Clients', href: '/clients' },
    { title: 'Edit Client', href: '/admin/clients/edit' },
];

export default function EditClient({ client, countries: initialCountries }: { client: any, countries: any[] }) {
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [contacts, setContacts] = useState(
        client.contacts && client.contacts.length > 0
            ? client.contacts.map((c: any) => ({
                id: c.id,
                salutation: c.salutation || '',
                first_name: c.first_name || '', 
                last_name: c.last_name || '',
                email: c.email || '',
                phone: c.phone || '',
                mobile: c.mobile || '',
                address1: c.address1 || '',
                position: c.position || '',
                department: c.department || '',
            }))
            : [{ salutation: '', first_name: '', last_name: '', email: '', phone: '', mobile: '', address1: '', 
        position: '', department: '' }]
    );

    const { data, setData, processing, put, reset, errors } = useForm({
        organization_name: client.organization_name || '',
        email: client.email || '',
        phone: client.phone || '',
        fax: client.fax || '',
        address1: client.address1 || '',
        address2: client.address2 || '',
        city_id: client.city_id || '',
        state_id: client.state_id || '',
        country_id: client.country_id || '',
        zip: client.zip || '',
        website: client.website || '',
        industry: client.industry || '',
        status: client.status || 'active',
        tax_id: client.tax_id || '',
        currency: client.currency || '',
        contacts: contacts,
    });

    useEffect(() => {
        axios.get('/countries/getcountries')
            .then((response) => {
                setCountries(response.data || []);
            })
            .catch(() => setCountries([]));
    }, []);

    // Fetch states when country changes
    useEffect(() => {
        axios.get(`/states/by-country/${data.country_id}`)
                .then((response) => {
                    setStates(response.data || []);
                })
                .catch(() => setStates([]));
            setData('state_id', data.state_id);
            setCities([]);
    }, [data.country_id]);

    // Fetch cities when state changes
    useEffect(() => {
            axios.get(`/cities/by-state/${data.state_id}`)
                .then((response) => {
                    setCities(response.data || []);
                })
                .catch(() => setCities([]));
            setData('city_id', data.city_id);
    }, [data.state_id]);

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
        setContacts([...contacts, { salutation: '', first_name: '', last_name: '', email: '', phone: '', mobile: '', address1: '', 
        position: '', department: '' }]);
    };

    const handleRemoveContact = (idx: number) => {
        setContacts(contacts.filter((_, i) => i !== idx));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData(e.target.name, e.target.value);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/clients/${client.id}/update`, {
            onSuccess: () => {
                reset();
                setContacts([{ salutation: '', first_name: '', last_name: '', email: '', phone: '', mobile: '', address1: '', 
        position: '', department: '' }]);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Client" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-gray-100 border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <form onSubmit={submit} className="justify-left relative flex h-full w-full flex-col items-center p-4">
                        <div className="mt-4 w-full">
                            <h2 className="text-xl font-bold mb-4">Edit Client</h2>
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
                                    <select
                                        name="city_id"
                                        value={data.city_id}
                                        onChange={handleChange}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                        disabled={!cities.length}
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((city: any) => (
                                            <option key={city.id} value={city.id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.city_id && <p className="text-xs text-red-500 italic">{errors.city_id}</p>}
                                </div>
                                {/* State */}
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                                    <select
                                        name="state_id"
                                        value={data.state_id}
                                        onChange={handleChange}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                        disabled={!states.length}
                                    >
                                        <option value="">Select State</option>
                                        {states.map((state: any) => (
                                            <option key={state.id} value={state.id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
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
                                        name="zip"
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
                                                placeholder="Salutation"
                                                value={contact.salutation}
                                                onChange={e => handleContactChange(idx, 'salutation', e.target.value)}
                                                className="w-full rounded border px-2 py-1 text-xs"
                                                required
                                            />
                                            {errors[`contacts.${idx}.salutation`] && (
                                                <p className="text-xs text-red-500 italic">{errors[`contacts.${idx}.salutation`]}</p>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                value={contact.first_name}
                                                onChange={e => handleContactChange(idx, 'first_name', e.target.value)}
                                                className="w-full rounded border px-2 py-1 text-xs"
                                                required
                                            />
                                            {errors[`contacts.${idx}.first_name`] && (
                                                <p className="text-xs text-red-500 italic">{errors[`contacts.${idx}.first_name`]}</p>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                value={contact.last_name}
                                                onChange={e => handleContactChange(idx, 'last_name', e.target.value)}
                                                className="w-full rounded border px-2 py-1 text-xs"
                                                required
                                            />
                                            {errors[`contacts.${idx}.last_name`] && (
                                                <p className="text-xs text-red-500 italic">{errors[`contacts.${idx}.last_name`]}</p>
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
                                    Update Client
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}