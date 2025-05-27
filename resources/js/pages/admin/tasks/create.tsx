import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs = [
    { title: "Master Tasks", href: "admin/tasks" },
    { title: "Add Master Task", href: "admin/tasks/create" },
];

export default function CreateMasterTask() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
        task_order: ""
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/tasks/store", {
            onSuccess: () => reset(),
        });
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Master Task" />
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <form onSubmit={submit} className="w-full max-w-lg bg-white p-8 rounded shadow">
                    <h2 className="text-xl font-bold mb-6">Add New Task</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={e => setData("title", e.target.value)}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.title ? "border-red-500" : ""}`}
                            required
                        />
                        {errors.title && <p className="text-red-500 text-xs italic">{errors.title}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={e => setData("description", e.target.value)}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.description ? "border-red-500" : ""}`}
                        />
                        {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="due_date">
                            Task Order
                        </label>
                        <input
                            id="task_order"
                            type="stepper"
                            value={data.task_order}
                            onChange={e => setData("task_order", e.target.value)}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.due_date ? "border-red-500" : ""}`}
                        />
                        {errors.task_order && <p className="text-red-500 text-xs italic">{errors.task_order}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <Link href="/admin/tasks" className="rounded bg-gray-400 px-4 py-2 text-white mr-2">
                            Back
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {processing ? "Saving..." : "Add Master Task"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}