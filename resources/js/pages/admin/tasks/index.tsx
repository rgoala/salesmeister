import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useState } from 'react';
import React from 'react';

const breadcrumbs = [
    { title: "Tasks", href: "/tasks" },
];

export default function Tasks({ tasks = [] }: { tasks?: any[] }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [form, setForm] = useState({ title: '', description: '', task_order: '' });
    
    // Track which tasks are expanded
    const [expandedTasks, setExpandedTasks] = useState<number[]>([]);
    
    // Steps state: an array of step objects
    const [steps, setSteps] = useState<{ description: string }[]>([]);

    const handleEditClick = (task: any) => {
        setSelectedTask(task);
        setForm({
            title: task.title || '',
            description: task.description || '',
            task_order: task.task_order || '',
        });
        // Optionally load steps for the task here if editing
        setSteps(task.steps || []); // assuming task.steps is an array
        setShowModal(true);
    };

    const handleToggleExpand = (taskId: number) => {
        setExpandedTasks((prev) =>
            prev.includes(taskId)
                ? prev.filter((id) => id !== taskId)
                : [...prev, taskId]
        );
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Step handlers
    const handleStepChange = (idx: number, value: string) => {
        const updated = [...steps];
        updated[idx].description = value;
        setSteps(updated);
    };

    const handleAddStep = () => {
        setSteps([...steps, { description: '' }]);
    };

    const handleRemoveStep = (idx: number) => {
        setSteps(steps.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTask) return;
        router.put(`/admin/tasks/${selectedTask.id}/update`, { ...form, steps }, {
            onSuccess: () => {
                setShowModal(false);
                setSelectedTask(null);
                setSteps([]);
            },
        });
    };

    // Handler to move task up or down
    const handleMoveTask = (taskId: number, direction: 'up' | 'down') => {
        router.put(`/admin/tasks/${taskId}/move`, { direction });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex flex-col p-4">
                        <div className="w-full max-w-2xl flex items-end mb-4">
                            <Link href="tasks/create" className="rounded bg-blue-500 px-4 py-2 text-white text-xs hover:bg-blue-600">
                                Add Task
                            </Link>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Order</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tasks.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No tasks found.</td>
                                    </tr>
                                ) : (
                                    tasks.map((task: any, idx: number) => (
                                        <React.Fragment key={task.id}>
                                            <tr>
                                                <td className="px-2 py-2 text-center align-top">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleExpand(task.id)}
                                                        title={expandedTasks.includes(task.id) ? "Collapse" : "Expand"}
                                                        className="focus:outline-none"
                                                    >
                                                        {expandedTasks.includes(task.id) ? '▼' : '▶'}
                                                    </button>
                                                </td>
                                                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{task.title}</td>
                                                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{task.description}</td>
                                                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                                                    {task.task_order}
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-gray-500 hover:text-blue-600"
                                                        onClick={() => handleMoveTask(task.id, 'up')}
                                                        disabled={idx === 0}
                                                        title="Move Up"
                                                    >
                                                        <FaArrowUp />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="ml-1 text-gray-500 hover:text-blue-600"
                                                        onClick={() => handleMoveTask(task.id, 'down')}
                                                        disabled={idx === tasks.length - 1}
                                                        title="Move Down"
                                                    >
                                                        <FaArrowDown />
                                                    </button>
                                                </td>
                                                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700"
                                                        onClick={() => handleEditClick(task)}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedTasks.includes(task.id) && task.steps && task.steps.length > 0 && (
                                                <tr>
                                                    <td></td>
                                                    <td colSpan={4} className="bg-gray-50 px-4 text-xs py-2">
                                                        <ol className="ml-4 list-decimal">
                                                            {task.steps.map((step: any, sidx: number) => (
                                                                <li key={sidx} className="text-gray-700">
                                                                    {step.description}
                                                                </li>
                                                            ))}
                                                        </ol>
                                                    </td>
                                                </tr>
                                            )}
                                            {expandedTasks.includes(task.id) && (!task.steps || task.steps.length === 0) && (
                                                <tr>
                                                    <td></td>
                                                    <td colSpan={4} className="bg-gray-50 px-4 py-2 text-gray-400 italic">
                                                        No steps for this task.
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {/* Modal */}
            {showModal && selectedTask && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Edit Task</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="border rounded w-full py-2 px-3"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="border rounded w-full py-2 px-3"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Task Order</label>
                                <input
                                    type="number"
                                    name="task_order"
                                    value={form.task_order}
                                    onChange={handleChange}
                                    className="border rounded w-full py-2 px-3"
                                    required
                                />
                            </div>
                            {/* Steps Section */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Steps</label>
                                {steps.map((step, idx) => (
                                    <div key={idx} className="flex items-center mb-2">
                                        <input
                                            type="text"
                                            value={step.description}
                                            onChange={e => handleStepChange(idx, e.target.value)}
                                            className="border rounded py-2 px-3 flex-1"
                                            placeholder={`Step ${idx + 1} description`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded"
                                            onClick={() => handleRemoveStep(idx)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="mt-2 px-4 py-2 bg-green-500 text-xs text-white rounded"
                                    onClick={handleAddStep}
                                >
                                    Add Step
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 px-4 py-2 bg-gray-300 text-xs rounded"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white text-xs rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}