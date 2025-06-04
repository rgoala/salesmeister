import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';

type WorkflowStep = {
    id: number;
    task_title: string;
    step_description: string;
    status?: string;
    assigned_to?: number;
    data?: string;
    attachments?: { id: number; filename: string; url: string }[];
};

type PageProps = {
    workflow: WorkflowStep;
    lead: {
        id: number;
        name: string;
    };
    users: { id: number; name: string }[];
};

const ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
];

export default function WorkflowEdit({ workflow, lead, users }: PageProps) {
    const [status, setStatus] = useState(workflow.status || '');
    const [assignedTo, setAssignedTo] = useState(workflow.assigned_to || '');
    const [data, setData] = useState(workflow.data || '');
    const [dataError, setDataError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);
        // Validate file types
        for (const file of selected) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                setFileError('Only PDF, XLSX, DOCX, JPG, PNG files are allowed.');
                return;
            }
        }
        setFileError(null);
        setFiles(selected);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setDataError(null);

    if (!data.trim()) {
        setDataError('Notes field is required.');
        setSaving(false);
        return;
    }

    setSaving(true);

    const formData = new FormData();
    formData.append('status', status);
    formData.append('assigned_to', assignedTo as any);
    formData.append('data', data);
    files.forEach((file, idx) => {
        formData.append('attachments[]', file);
    });

    await router.post(`/workflows/${workflow.id}/update`, formData, {
        forceFormData: true,
        onFinish: () => setSaving(false),
    });
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
                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
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
    <label className="block text-xs font-bold mb-1">
        Step Data / Notes <span className="text-red-500">*</span>
    </label>
    <textarea
        className="w-full border rounded px-2 py-1 text-xs"
        rows={3}
        value={data}
        onChange={e => setData(e.target.value)}
        required
    />
    {dataError && <div className="text-red-500 text-xs mt-1">{dataError}</div>}
</div>
                    <div>
                        <label className="block text-xs font-bold mb-1">Attach Files</label>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.xlsx,.docx,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="block w-full text-xs"
                        />
                        {fileError && <div className="text-red-500 text-xs mt-1">{fileError}</div>}
                        {files.length > 0 && (
                            <ul className="mt-2 text-xs">
                                {files.map((file, idx) => (
                                    <li key={idx}>{file.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* Show existing attachments if any */}
                    {workflow.attachments && workflow.attachments.length > 0 && (
                        <div>
                            <label className="block text-xs font-bold mb-1">Existing Attachments</label>
                            <ul className="text-xs">
                                {workflow.attachments.map(att => (
                                    <li key={att.id}>
                                        <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                            {att.filename}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
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