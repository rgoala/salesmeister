import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sales Leads',
        href: '/leads/create',
    },
];

export default function CreateLead({ clients = [], leadTypes = [], users = [], leadStatuses = [], contacts = [] }: { clients?: any[]; leadTypes?: any[]; users?: any[]; leadStatuses?: any[]; contacts?: any[] }) {
    const { auth } = usePage().props as any; // Make sure your Inertia middleware provides auth.user

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        client_id: '',
        client_reference: '',
        description: '',
        lead_type_id: '',
        contact_id: '',
        lead_status: '',
        expected_close_date: '',
        actual_close_date: '',
        lastupdated_by: auth?.user?.id || '',
        assigned_to: '',
        conversion: 'YTS',
        conversion_notes: '',
        source: '',

    });

    // State to hold filtered contacts for selected client
    const [filteredContacts, setFilteredContacts] = useState<any[]>([]);

    // Update filtered contacts when client changes
    useEffect(() => {
        if (data.client_id) {
            setFilteredContacts(
                contacts.filter((c: any) => String(c.client_id) === String(data.client_id))
            );
        } else {
            setFilteredContacts([]);
        }
        // Reset contact_id if client changes
        setData('contact_id', '');
    }, [data.client_id, contacts]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/leads/store', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Lead" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <form onSubmit={submit} className="justify-left relative flex h-full w-full flex-col items-center p-4">
                        <div className="mt-4 w-full max-w-2xl">
                            <h2 className="mb-4 text-xl font-bold">Add New Lead</h2>
                            <div className="mb-4 flex gap-4">
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-gray-700">Project Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-red-500 italic">{errors.name}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-gray-700">Client</label>
                                    <select
                                        name="client_id"
                                        value={data.client_id}
                                        onChange={e => setData('client_id', e.target.value)}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                        required
                                    >
                                        <option value="">Select Client</option>
                                        {clients.map((client: any) => (
                                            <option key={client.id} value={client.id}>
                                                {client.organization_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.client_id && <p className="text-xs text-red-500 italic">{errors.client_id}</p>}
                                </div>
                            </div>
                            <div className="mb-4 flex gap-4">
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-gray-700">Client/Tender Reference</label>
                                    <input
                                        type="text"
                                        name="client_reference"
                                        value={data.client_reference}
                                        onChange={e => setData('client_reference', e.target.value)}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    />
                                    {errors.client_reference && <p className="text-xs text-red-500 italic">{errors.client_reference}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                        rows={3}
                                    ></textarea>
                                    {errors.description && <p className="text-xs text-red-500 italic">{errors.description}</p>}
                                </div>
                            </div>
                            <div className="mb-4 flex gap-4">
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-gray-700">Lead Type</label>
                                    <select
                                        name="lead_type_id"
                                        value={data.lead_type_id}
                                        onChange={e => setData('lead_type_id', e.target.value)}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                        required
                                    >
                                        <option value="">Select Lead Type</option>
                                        {leadTypes.map((type: any) => (
                                            <option key={type.id} value={type.id}>
                                                {type.title || type.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.lead_type_id && <p className="text-xs text-red-500 italic">{errors.lead_type_id}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-gray-700">Contact</label>
                                    <select
                                        name="contact_id"
                                        value={data.contact_id}
                                        onChange={e => setData('contact_id', e.target.value)}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                        // required={filteredContacts.length > 0}
                                    >
                                        <option value="">Select Contact</option>
                                        {filteredContacts.map((contact: any) => (
                                            <option key={contact.id} value={contact.id}>
                                                {contact.first_name} {contact.last_name} {contact.email ? `(${contact.email})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.contact_id && <p className="text-xs text-red-500 italic">{errors.contact_id}</p>}
                                </div>
                            </div>
                            <div className="mb-4 flex gap-4">
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-gray-700">Expected Close Date</label>
                                    <input
                                        type="date"
                                        name="expected_close_date"
                                        value={data.expected_close_date}
                                        onChange={e => setData('expected_close_date', e.target.value)}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    />
                                    {errors.expected_close_date && <p className="text-xs text-red-500 italic">{errors.expected_close_date}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-gray-700">Actual Close Date</label>
                                    <input
                                        type="date"
                                        name="actual_close_date"
                                        value={data.actual_close_date}
                                        onChange={e => setData('actual_close_date', e.target.value)}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    />
                                    {errors.actual_close_date && <p className="text-xs text-red-500 italic">{errors.actual_close_date}</p>}
                                </div>
                            </div>
                            <div className="mb-4 flex gap-4">
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-gray-700">Last Updated By</label>
                                    <input
                                        type="text"
                                        name="lastupdated_by_display"
                                        value={auth?.user?.name || ''}
                                        className="w-full rounded border px-2 py-1 text-xs bg-gray-100"
                                        disabled
                                        readOnly
                                    />
                                    <input
                                        type="hidden"
                                        name="lastupdated_by"
                                        value={auth?.user?.id || ''}
                                    />
                                    {errors.lastupdated_by && <p className="text-xs text-red-500 italic">{errors.lastupdated_by}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-gray-700">Assigned To</label>
                                    <select
                                        name="assigned_to"
                                        value={data.assigned_to}
                                        onChange={e => setData('assigned_to', e.target.value)}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    >
                                        <option value="">Select User</option>
                                        {users.map((user: any) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.assigned_to && <p className="text-xs text-red-500 italic">{errors.assigned_to}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-gray-700">Source</label>
                                    <input
                                        type="text"
                                        name="source"
                                        value={data.source}
                                        onChange={e => setData('source', e.target.value)}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    />
                                    {errors.source && <p className="text-xs text-red-500 italic">{errors.source}</p>}
                                </div>
                            </div>
                            <div className="mb-4 flex gap-4">
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-gray-700">Conversion</label>
                                    <select
                                        name="conversion"
                                        value={data.conversion}
                                        onChange={e => setData('conversion', e.target.value)}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    >
                                        <option value="YTS">YTS</option>
                                        <option value="Bid">Bid</option>
                                        <option value="DNB">DNB</option>
                                        <option value="Lost">Lost</option>
                                        <option value="Won">Won</option>
                                    </select>
                                    {errors.conversion && <p className="text-xs text-red-500 italic">{errors.conversion}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-gray-700">Conversion Notes</label>
                                    <input
                                        type="text"
                                        name="conversion_notes"
                                        value={data.conversion_notes}
                                        onChange={e => setData('conversion_notes', e.target.value)}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                    />
                                    {errors.conversion_notes && <p className="text-xs text-red-500 italic">{errors.conversion_notes}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-gray-700">Lead Status</label>
                                    <select
                                        name="lead_status"
                                        value={data.lead_status}
                                        onChange={e => setData('lead_status', e.target.value)}
                                        className="w-full rounded border px-2 py-1 text-xs"
                                        required
                                    >
                                        <option value="">Select Lead Status</option>
                                        {leadStatuses && leadStatuses.length > 0 ? (
                                            leadStatuses.map((status: any) => (
                                                <option key={status.id} value={status.id}>
                                                    {status.name}
                                                </option>
                                            ))
                                        ) : (
                                            <>
                                                <option value="1">Open</option>
                                                <option value="2">In Progress</option>
                                                <option value="3">Closed</option>
                                            </>
                                        )}
                                    </select>
                                    {errors.lead_status && <p className="text-xs text-red-500 italic">{errors.lead_status}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Link href="/leads" className="mr-4 rounded bg-blue-500 px-4 py-2 text-xs text-white hover:bg-blue-600">
                                Back
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                            >
                                Create Lead
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}