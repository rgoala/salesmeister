import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: 'clients/index',
    },
];

export default function Clients({ clients = [] }: { clients?: any[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="relative flex h-full w-full flex-col justify-left p-3">
                        <div className="mt-4">
                            <Link href="/admin/clients/create" className="rounded bg-blue-500 px-4 py-2 text-xs text-white hover:bg-blue-600">
                                Add New Client
                            </Link>
                        </div>
                        <div className="mt-4 w-full">
                            <table className="w-full text-md bg-white shadow-md rounded mb-4 divide-y divide-blue-200">
                                <thead>
                                    <tr className='bg-gray-100'>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact(s)</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Leads</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">                                        
                                    {clients.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No clients found.</td>
                                        </tr>
                                    ) : (
                                        clients.map((client) => (
                                            <tr className='odd:bg-blue-100' key={client.id}>
                                                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{client.organization_name}</td>
                                                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{client.email || '-'}</td>
                                                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{client.phone || '-'}</td>
                                                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                                                    {client.contacts && client.contacts.length > 0
                                                        ? client.contacts.map((c: any) =>
                                                            <div key={c.id}>{c.first_name} {c.last_name}</div>
                                                        )
                                                        : <span className="text-gray-400 italic">No contacts</span>
                                                    }
                                                </td>
                                                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{client.leads_count ?? 0}</td>
                                                <td className="px-2 py-2 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link href={`admin/clients/${client.id}/edit`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}