import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Chart as ChartJS } from "chart.js/auto";
import { Doughnut, Bar } from "react-chartjs-2";
import { useEffect, useState } from 'react';
import axios from 'axios';

ChartJS.register();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [statusData, setStatusData] = useState<{ [key: string]: number }>({
        Open: 0,
        'in-progress': 0,
        Closed: 0,
    });
    const [taskCategoryData, setTaskCategoryData] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        axios.get('/leads/status-summary')
            .then(res => setStatusData(res.data))
            .catch(() => setStatusData({ New: 0, 'in-progress': 0, Closed: 0 }));
    
        axios.get('/leads/by-task-category')
            .then(res => setTaskCategoryData(res.data))
            .catch(() => setTaskCategoryData({}));
        }, []);

    const taskLabels = Object.keys(taskCategoryData);
    const taskCounts = Object.values(taskCategoryData).map(v => parseInt(v as any, 10));

    const statusChartData = [
        parseInt(statusData.New as any, 10) || 0,
        parseInt(statusData['in-progress'] as any, 10) || 0,
        parseInt(statusData.Closed as any, 10) || 0,
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-1">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative px-2 aspect-video overflow-visible rounded-xl border">
                    <strong>All leads Status</strong>
                        <Doughnut
                            data={{
                                labels: ['New', 'In-progress', 'Closed'],
                                datasets: [
                                    {
                                        label: 'Leads',
                                        data: statusChartData,
                                        backgroundColor: [
                                            'rgba(75, 192, 192, 0.6)',
                                            'rgba(255, 206, 86, 0.6)',
                                            'rgba(255, 99, 132, 0.6)',
                                        ],
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
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video px-2 overflow-visible rounded-xl border">
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
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
