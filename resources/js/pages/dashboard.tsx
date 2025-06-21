import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Chart as ChartJS } from 'chart.js/auto';
import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register();

type Step = {
    id: number;
    lead_name: string;
    step_description: string;
    assigned_at: string;
    assigned_by: string;
    status: string;
};

type Props = {
    steps: Step[];
    currentPage: number;
    lastPage: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ steps: initialSteps, currentPage, lastPage }: Props) {
    const [statusData, setStatusData] = useState<{ [key: string]: number }>({
        Open: 0,
        'in-progress': 0,
        Closed: 0,
    });
    const [taskCategoryData, setTaskCategoryData] = useState<{ [key: string]: number }>({});
    const [steps, setSteps] = useState<Step[]>(initialSteps);
    const [page, setPage] = useState(currentPage);

    // Fetch steps for a page
    const fetchPage = (pageNum: number) => {
        router.get(
            `/dashboard?page=${pageNum}`,
            {},
            {
                preserveState: true,
                onSuccess: (page) => {
                    setSteps(page.props.steps);
                    setPage(page.props.currentPage);
                },
            },
        );
    };

    const handleProcess = (step: Step) => {
        router.get(`/workflows/${step.id}/edit`);
    };

    const handleSkip = (step: Step) => {
        router.get(`/workflows/${step.id}/skip`);
    };

    useEffect(() => {
        axios
            .get('/leads/status-summary')
            .then((res) => setStatusData(res.data))
            .catch(() => setStatusData({ New: 0, 'In-progress': 0, Closed: 0 }));

        axios
            .get('/leads/by-task-category')
            .then((res) => setTaskCategoryData(res.data))
            .catch(() => setTaskCategoryData({}));
    }, []);

    const taskLabels = Object.keys(taskCategoryData);
    const taskCounts = Object.values(taskCategoryData).map((v) => parseInt(v as any, 10));

    const statusChartData = [
        parseInt(statusData.New as any, 10) || 0,
        parseInt(statusData['in-progress'] as any, 10) || 0,
        parseInt(statusData.Closed as any, 10) || 0,
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-1">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-visible rounded-xl border px-2">
                        <strong>All leads Status</strong>
                        <Doughnut
                            data={{
                                labels: ['New', 'In-progress', 'Closed'],
                                datasets: [
                                    {
                                        label: 'Leads',
                                        data: statusChartData,
                                        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                                    },
                                ],
                            }}
                            options={{
                                maintainAspectRatio: true,
                                responsive: true,
                                layout: {
                                    padding: 0,
                                },
                                plugins: {
                                    legend: {
                                        position: 'right',
                                    },
                                },
                            }}
                            className="h-full w-full"
                            title={'Leads Status'}
                        />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-visible rounded-xl border px-2">
                        <strong>Leads by Task</strong>
                        <Bar
                            data={{
                                labels: taskLabels,
                                datasets: [
                                    {
                                        label: 'Leads',
                                        data: taskCounts,
                                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                                    },
                                ],
                            }}
                            options={{
                                indexAxis: 'y',
                                maintainAspectRatio: true,
                                responsive: true,
                                layout: {
                                    padding: 0,
                                },
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 1,
                                        },
                                    },
                                },
                            }}
                            className="h-full w-full"
                            title={'Leads by Task Category'}
                        />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative p-2 col-span-2 min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                        <h2 className="mb-4 text-xl font-bold">Steps Assigned to Me</h2>
                        <table className="mb-4 min-w-full divide-y divide-gray-200 border">
                            <thead>
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-bold">Lead</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold">Step</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold">Assigned Date</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold">Assigned By</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold">Status</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {steps.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-4 text-center text-gray-500">
                                            No steps assigned.
                                        </td>
                                    </tr>
                                ) : (
                                    steps.map((step) => (
                                        <tr key={step.id}>
                                            <td className="px-3 py-2">{step.lead_name}</td>
                                            <td className="px-3 py-2">{step.step_description}</td>
                                            <td className="px-3 py-2">{step.assigned_at}</td>
                                            <td className="px-3 py-2">{step.assigned_by}</td>
                                            <td className="px-3 py-2">{step.status}</td>
                                            <td className="px-3 py-2">
                                                <button
                                                    className="mr-2 rounded bg-green-500 px-3 py-1 text-xs text-white"
                                                    onClick={() => handleProcess(step)}
                                                >
                                                    Process
                                                </button>
                                                <button className="rounded bg-red-500 px-3 py-1 text-xs text-white" onClick={() => handleSkip(step)}>
                                                    Skip
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="flex justify-center gap-2">
                            <button className="rounded bg-gray-300 px-3 py-1 text-xs" disabled={page <= 1} onClick={() => fetchPage(page - 1)}>
                                Previous
                            </button>
                            <span className="px-2 py-1 text-xs">
                                Page {page} of {lastPage}
                            </span>
                            <button className="rounded bg-gray-300 px-3 py-1 text-xs" disabled={page >= lastPage} onClick={() => fetchPage(page + 1)}>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
