import { useState, useEffect } from 'react';

interface TaskFormProps {
  onSubmit: (task: { title: string; description: string }) => void;
  initialData?: { title: string; description: string };
  taskId?: string;
  onCancel?: () => void;
}

const TaskForm = ({ onSubmit, initialData, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 mb-4">
      <input
        className="w-full border px-3 py-2 rounded bg-grey-200"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full border px-3 py-2 rounded bg-grey-200"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={3}
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button type="button" className="text-gray-600" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {initialData ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
