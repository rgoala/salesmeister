import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import React, { useState } from 'react';

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
    assigned_to?: number;
};

type Lead = {
    id: number;
    name: string;
    client_name?: string;
    status?: string;
    expected_close_date?: string;
    assigned_to?: string;
    lead_type?: { name: string };
    workflows: WorkflowStep[];
};

export default function Leads({ leads = [] }: { leads?: Lead[] }) {
    const [expanded, setExpanded] = useState<number[]>([]);
    const [taskPanels, setTaskPanels] = useState<{ [leadId: number]: string[] }>({});
    const [skipModal, setSkipModal] = useState<{
        open: boolean;
        workflowId?: number;
        leadId?: number;
        currentTaskTitle?: string;
        nextTaskTitle?: string;
        comment: string;
        assignTo: string;
        assignToOptions: { id: number; name: string }[];
    }>({
        open: false,
        workflowId: undefined,
        leadId: undefined,
        currentTaskTitle: '',
        nextTaskTitle: '',
        comment: '',
        assignTo: '',
        assignToOptions: [],
    });

    const handleToggleExpand = (leadId: number) => {
        setExpanded((prev) => (prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]));
    };

    const handleToggleTaskPanel = (leadId: number, taskTitle: string) => {
        setTaskPanels((prev) => {
            const openPanels = prev[leadId] || [];
            return {
                ...prev,
                [leadId]: openPanels.includes(taskTitle) ? openPanels.filter((t) => t !== taskTitle) : [...openPanels, taskTitle],
            };
        });
    };

    // Open skip modal and fetch next task and assign options
    const handleSkipClick = async (workflow: WorkflowStep, lead: Lead) => {
        const res = await axios.get(`/workflows/${workflow.id}/next-task-info`);
        setSkipModal({
            open: true,
            workflowId: workflow.id,
            leadId: lead.id,
            currentTaskTitle: workflow.step_description,
            nextTaskTitle: res.data.nextTaskTitle,
            comment: '',
            assignTo: '',
            assignToOptions: res.data.assignToOptions || [],
        });
    };

    // Handle skip submit
    const handleSkipSubmit = async () => {
        if (!skipModal.comment.trim()) {
            alert('Please enter a comment for skipping.');
            return;
        }
        await axios.post(`/workflows/${skipModal.workflowId}/skip`, {
            comment: skipModal.comment,
            assign_to: skipModal.assignTo,
        });
        setSkipModal({ ...skipModal, open: false });
        window.location.reload();
    };

    // Handler for Proceed button
    const handleProceed = (wf: WorkflowStep, lead: Lead) => {
    router.get(`/workflows/${wf.id}/edit`);
    };

    // Group workflows by task title
    const groupByTask = (workflows: WorkflowStep[]) => {
        const grouped: { [task: string]: WorkflowStep[] } = {};
        workflows.forEach((wf) => {
            if (!grouped[wf.task_title]) grouped[wf.task_title] = [];
            grouped[wf.task_title].push(wf);
        });
        return grouped;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leads" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden bg-white md:min-h-min">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Leads</h2>
                        <Link href="leads/create" className="rounded bg-blue-500 px-4 py-2 text-xs text-white hover:bg-blue-600">
                            Add Lead
                        </Link>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th></th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project Name</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submit By Date</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead Type</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                        No leads found.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => {
                                    const grouped = groupByTask(lead.workflows);
                                    return (
                                        <React.Fragment key={lead.id}>
                                            <tr>
                                                <td className="px-2 py-2 text-center align-top">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleExpand(lead.id)}
                                                        title={expanded.includes(lead.id) ? 'Collapse' : 'Expand'}
                                                        className="focus:outline-none"
                                                    >
                                                        {expanded.includes(lead.id) ? '▼' : '▶'}
                                                    </button>
                                                </td>
                                                <td className="px-2 py-2 text-sm whitespace-nowrap text-gray-900">{lead.client_name || '-'}</td>
                                                <td className="px-2 py-2 text-sm whitespace-nowrap text-gray-900">{lead.name || '-'}</td>
                                                <td className="px-2 py-2 text-sm whitespace-nowrap text-gray-900">{lead.status || '-'}</td>
                                                <td className="px-2 py-2 text-sm whitespace-nowrap text-gray-900">
                                                    {lead.expected_close_date || '-'}
                                                </td>
                                                <td className="px-2 py-2 text-sm whitespace-nowrap text-gray-900">{lead.assigned_to || '-'}</td>
                                                <td className="px-2 py-2 text-sm whitespace-nowrap text-gray-900">{lead.lead_type?.name || '-'}</td>
                                                <td className="px-2 py-2 text-sm whitespace-nowrap text-gray-900"></td>
                                            </tr>
                                            {expanded.includes(lead.id) && (
                                                <tr>
                                                    <td></td>
                                                    <td colSpan={7} className="bg-gray-50 px-4 py-2">
                                                        <div>
                                                            <strong>Workflow Steps:</strong>
                                                            {Object.keys(grouped).length > 0 ? (
                                                                <div>
                                                                    {Object.entries(grouped).map(([taskTitle, steps]) => {
                                                                        const isPanelOpen = (taskPanels[lead.id] || []).includes(taskTitle);
                                                                        return (
                                                                            <div key={taskTitle} className="mb-2 rounded border">
                                                                                <button
                                                                                    type="button"
                                                                                    className="w-full rounded-t bg-blue-100 px-3 py-2 text-left font-semibold hover:bg-blue-200"
                                                                                    onClick={() => handleToggleTaskPanel(lead.id, taskTitle)}
                                                                                >
                                                                                    {isPanelOpen ? '▼' : '▶'} {taskTitle}
                                                                                </button>
                                                                                {isPanelOpen && (
                                                                                    <table className="min-w-full border-t text-xs">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th className="border px-2 py-1 text-left text-xs">
                                                                                                    Step
                                                                                                </th>
                                                                                                <th className="border px-2 py-1 text-left text-xs">
                                                                                                    Status
                                                                                                </th>
                                                                                                <th className="border px-2 py-1 text-left text-xs">
                                                                                                    Assigned To
                                                                                                </th>
                                                                                                <th className="border px-2 py-1 text-left text-xs">
                                                                                                    Actions
                                                                                                </th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {steps.map((wf, idx) => {
                                                                                                const isCompleted =
                                                                                                    wf.status &&
                                                                                                    wf.status.toLowerCase() === 'complete';
                                                                                                // Find the index of the first incomplete step
                                                                                                const firstIncompleteIdx = steps.findIndex(
                                                                                                    (step) =>
                                                                                                        !step.status ||
                                                                                                        step.status.toLowerCase() !== 'complete',
                                                                                                );
                                                                                                // Only enable action buttons for the first incomplete step
                                                                                                const isActionEnabled =
                                                                                                    idx === firstIncompleteIdx && !isCompleted;

                                                                                                return (
                                                                                                    <tr
                                                                                                        key={wf.id}
                                                                                                        className={isCompleted ? 'bg-green-100' : ''}
                                                                                                    >
                                                                                                        <td className="border px-2 py-1">
                                                                                                            {wf.step_description}
                                                                                                        </td>
                                                                                                        <td className="border px-2 py-1">
                                                                                                            {wf.status || '-'}
                                                                                                        </td>
                                                                                                        <td className="border px-2 py-1">
                                                                                                            {wf.assigned_to ? (
                                                                                                                <span>{wf.assigned_to}</span>
                                                                                                            ) : (
                                                                                                                '-'
                                                                                                            )}
                                                                                                        </td>
                                                                                                        <td className="border px-2 py-1">
                                                                                                            {!isCompleted && (
                                                                                                                <>
                                                                                                                    <button
                                                                                                                        className={`rounded px-4 py-1 text-xs ${
                                                                                                                            isActionEnabled
                                                                                                                                ? 'bg-green-400'
                                                                                                                                : 'cursor-not-allowed bg-gray-300 text-gray-500'
                                                                                                                        }`}
                                                                                                                        disabled={!isActionEnabled}
                                                                                                                        onClick={() =>
                                                                                                                            handleProceed(wf, lead)
                                                                                                                        }
                                                                                                                    >
                                                                                                                        Proceed
                                                                                                                    </button>
                                                                                                                    <button
                                                                                                                        className={`mx-2 rounded px-4 py-1 text-xs ${
                                                                                                                            isActionEnabled
                                                                                                                                ? 'bg-red-500 text-white'
                                                                                                                                : 'cursor-not-allowed bg-gray-300 text-gray-500'
                                                                                                                        }`}
                                                                                                                        disabled={!isActionEnabled}
                                                                                                                        onClick={() =>
                                                                                                                            handleSkipClick(wf, lead)
                                                                                                                        }
                                                                                                                    >
                                                                                                                        Skip
                                                                                                                    </button>
                                                                                                                </>
                                                                                                            )}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                                    </table>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 italic">No workflow steps.</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Skip Modal */}
            {skipModal.open && (
                <div className="bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="mb-2 text-lg font-bold">Skip Step: {skipModal.currentTaskTitle}</h3>
                        <div className="mb-2">
                            <label className="mb-1 block text-xs font-bold">
                                Comment <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                className="w-full rounded border px-2 py-1 text-xs"
                                rows={3}
                                value={skipModal.comment}
                                onChange={(e) => setSkipModal({ ...skipModal, comment: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="mb-1 block text-xs font-bold">Assign Next Task To</label>
                            <select
                                className="w-full rounded border px-2 py-1 text-xs"
                                value={skipModal.assignTo}
                                onChange={(e) => setSkipModal({ ...skipModal, assignTo: e.target.value })}
                            >
                                <option value="">Select User</option>
                                {skipModal.assignToOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-2 text-xs">
                            <strong>Next Task/Step:</strong> {skipModal.nextTaskTitle || 'N/A'}
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button className="rounded bg-gray-300 px-4 py-1 text-xs" onClick={() => setSkipModal({ ...skipModal, open: false })}>
                                Cancel
                            </button>
                            <button className="rounded bg-red-500 px-4 py-1 text-xs text-white" onClick={handleSkipSubmit}>
                                Confirm Skip
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
