import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sales Leads',
        href: '/leads/index',
    },
];

type WorkflowStep = {
    id: number;
    task_title: string;
    step_description: string;
    status?: string;
};

type Lead = {
    id: number;
    client?: { organization_name: string };
    lead_type?: { name: string };
    workflows: WorkflowStep[];
};

export default function Leads({ leads = [] }: { leads?: Lead[] }) {
    
    const [expanded, setExpanded] = useState<number[]>([]);

    const handleToggleExpand = (leadId: number) => {
        setExpanded(prev =>
            prev.includes(leadId)
                ? prev.filter(id => id !== leadId)
                : [...prev, leadId]
        );
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leads" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Leads</h2>
                        <Link href="leads/create" className="rounded bg-blue-500 px-4 py-2 text-white text-xs hover:bg-blue-600">
                            Add Lead
                        </Link>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th></th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead Type</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No leads found.</td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <React.Fragment key={lead.id}>
                                        <tr>
                                            <td className="px-2 py-2 text-center align-top">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleExpand(lead.id)}
                                                    title={expanded.includes(lead.id) ? "Collapse" : "Expand"}
                                                    className="focus:outline-none"
                                                >
                                                    {expanded.includes(lead.id) ? '▼' : '▶'}
                                                </button>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {lead.client?.organization_name || '-'}
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {lead.lead_type?.name || '-'}
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {/* Add actions if needed */}
                                            </td>
                                        </tr>
                                        {expanded.includes(lead.id) && (
                                            <tr>
                                                <td></td>
                                                <td colSpan={3} className="bg-gray-50 px-4 py-2">
                                                    <div>
                                                        <strong>Workflow Steps:</strong>
                                                        {lead.workflows && lead.workflows.length > 0 ? (
                                                            <ul className="ml-4 list-disc">
                                                                {lead.workflows.map((wf) => (
                                                                    <li key={wf.id} className="mb-1">
                                                                        <span className="font-semibold">{wf.task_title}:</span> {wf.step_description}
                                                                        {wf.status && (
                                                                            <span className="ml-2 text-xs text-gray-500">[{wf.status}]</span>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <span className="text-gray-400 italic">No workflow steps.</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}