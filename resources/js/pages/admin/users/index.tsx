import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/users/index',
    },
];

export default function Leads({ users = [] }: { users?: any[] }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [form, setForm] = useState({ email: '', phone: '', role: '' });

    const handleEditClick = (user: any) => {
        setSelectedUser(user);
         setForm({
            email: user.email,
            phone: user.phone,
            role: user.role,
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', );
        if (!selectedUser) return;
        router.post(`/users/${selectedUser.id}/update`, form, {
            onSuccess: () => {
                setShowModal(false);
                setSelectedUser(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users List" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="justify-left relative flex h-full w-full flex-col items-center p-4">
                        <div className="mt-4">
                            <h1 className="text-2xl font-bold">Users List</h1>
                        </div>
                        <div className="mt-4 w-full max-w-2xl">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">User Name</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Email</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Phone</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Role</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-2 py-2 text-sm whitespace-nowrap text-gray-900">{user.name}</td>
                                                <td className="px-2 py-2 text-sm whitespace-nowrap text-gray-900">{user.email}</td>
                                                <td className="px-2 py-2 text-sm whitespace-nowrap text-gray-900">{user.phone}</td>
                                                <td className="px-2 py-2 text-sm whitespace-nowrap text-gray-900">{user.role}</td>
                                                <td className="px-2 py-2 text-sm whitespace-nowrap text-gray-900">
                                                    <button
                                                        type="button"
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                        onClick={() => handleEditClick(user)}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                {/* Modal */}
                                {showModal && selectedUser && (
                                    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                                        <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
                                            <h2 className="mb-4 text-lg font-bold">Edit User</h2>
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-4">
                                                    <label className="mb-2 block text-sm font-bold text-gray-700">Name</label>
                                                    <input
                                                        type="text"
                                                        value={selectedUser.name}
                                                        className="w-full rounded border px-3 py-2"
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="mb-2 block text-sm font-bold text-gray-700">Email</label>
                                                    <input
                                                        type="email"
                                                        name='email'
                                                        value={form.email}
                                                        onChange={handleChange}
                                                        className="w-full rounded border px-3 py-2"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="mb-2 block text-sm font-bold text-gray-700">Phone</label>
                                                    <input
                                                        type="text"
                                                        name='phone'
                                                        value={form.phone}
                                                        onChange={handleChange}
                                                        className="w-full rounded border px-3 py-2"
                                                    />
                                                </div>
                                                <div className='mb-4'>
                                                    <label className="mb-2 block text-sm font-bold text-gray-700">Role</label>
                                                    <select
                                                        name="role"
                                                        value={form.role}
                                                        className="w-full rounded border px-3 py-2"
                                                        onChange={handleChange}
                                                    >
                                                        <option value="accounts">Accounts</option>
                                                        <option value="admin">Admin</option>
                                                        <option value="operations">Operations</option>
                                                        <option value="sales">Sales</option>
                                                        <option value="user">User</option>
                                                    </select>
                                                </div>
                                                <div className="flex justify-end">
                                                    <button type="button" className="mr-2 rounded bg-gray-300 px-4 py-2" onClick={handleCloseModal}>
                                                        Cancel
                                                    </button>
                                                    <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
                                                        Save
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
