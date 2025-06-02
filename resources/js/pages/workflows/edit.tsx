import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';

type WorkflowStep = {
    id: number;
    task_title: string;
    step_description: string;
    status?: string;
    assigned_to?: number;
    data?: string; // or whatever fields you store for step data
};

type PageProps = {
    workflow: WorkflowStep;
    lead: {
        id: number;
        name: string;
    };
    users: { id: number; name: string }[];
};

export default function WorkflowEdit({ workflow, lead, users }: PageProps) {
    const [status, setStatus] = useState(workflow.status || '');
    const [assignedTo, setAssignedTo] = useState(workflow.assigned_to || '');
    const [data, setData] = useState(workflow.data || '');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await router.post(`/workflows/${workflow.id}/update`, {
            status,
            assigned_to: assignedTo,
            data,
        });
        setSaving(false);
    };

    return (
        <AppLayout>
            <Head title={`Update Step - ${workflow.task_title}`} />
            <div className="max-w-xl mx-auto mt-8 bg-white rounded shadow p-6">
                <h2 className="text-xl font-bold mb-4">
                    Update Step for Lead: <span className="text-blue-600">{lead.name}</span>
                </h2>
                <div className="mb-4">
                    <div className="font-semibold">Task: {workflow.task_title}</div>
                    <div className="text-sm text-gray-600">Step: {workflow.step_description}</div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold mb-1">Status</label>
                        <select
                            className="w-full border rounded px-2 py-1 text-xs"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        >
                            <option value="">Select Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="complete">Complete</option>
                            <option value="skipped">Skipped</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold mb-1">Assigned To</label>
                        <select
                            className="w-full border rounded px-2 py-1 text-xs"
                            value={assignedTo}
                            onChange={e => setAssignedTo(e.target.value)}
                        >
                            <option value="">Select User</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold mb-1">Step Data / Notes</label>
                        <textarea
                            className="w-full border rounded px-2 py-1 text-xs"
                            rows={3}
                            value={data}
                            onChange={e => setData(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Link href="/leads" className="rounded bg-gray-300 px-4 py-1 text-xs">Cancel</Link>
                        <button
                            type="submit"
                            className="rounded bg-blue-500 px-4 py-1 text-xs text-white"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}