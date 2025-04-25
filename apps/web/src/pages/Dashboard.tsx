/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import TaskForm from '../components/TaskForm';

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
}

const Dashboard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/task`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(res.data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to fetch tasks');
        }
    };

    const handleAdd = async (data: { title: string; description: string }) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/task`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('✅ Task added');
            fetchTasks();
        } catch {
            toast.error('❌ Failed to add task');
        }
    };

    const handleUpdate = async (data: { title: string; description: string }) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_URL}/task/${editingTask?.id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('✏️ Task updated');
            setEditingTask(null);
            fetchTasks();
        } catch {
            toast.error('❌ Failed to update task');
        }
    };


    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="p-6 bg-gray-100 h-screen w-screen flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-black">Your Tasks</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Add Task
                </button>
            </div>
            {tasks.length === 0 ? (
                <p className="text-gray-600">No tasks assigned yet.</p>
            ) : (
                <div className="flex-1 overflow-y-scroll space-y-4 pr-2">
                    {tasks.map(task => (
                        <div key={task.id} className="bg-white shadow p-4 rounded relative">
                            <button
                                className="absolute top-4 right-4 text-sm text-blue-600 hover:underline bg-white"
                                onClick={() => setEditingTask(task)}
                            >Edit
                            </button>
                            <h3 className="text-lg font-semibold text-gray-700 pr-10">{task.title}</h3>
                            <p className="text-sm text-gray-600">{task.description}</p>
                            <p className="text-xs mt-1 text-gray-500">Status: {task.status}</p>
                        </div>
                    ))}
                </div>
            )}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-black">Create Task</h2>
                        <TaskForm
                            onSubmit={(data) => {
                                handleAdd(data);
                                setShowAddModal(false);
                            }}
                            onCancel={() => setShowAddModal(false)}
                        />
                    </div>
                </div>
            )}
            {editingTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
                        <TaskForm
                            initialData={editingTask}
                            taskId={editingTask?.id}
                            onSubmit={(data) => handleUpdate(data)}
                            onCancel={() => setEditingTask(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
