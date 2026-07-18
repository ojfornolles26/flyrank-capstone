import React, { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    apiKey: '',
    theme: 'dark',
    notifications: true,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.apiKey && formData.apiKey.length < 20) {
      newErrors.apiKey = 'API Key must be at least 20 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMessage('');
    } else {
      setErrors({});
      setSuccessMessage('Profile and settings saved successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 rounded-lg p-8 shadow-lg border border-slate-800">
        <h1 className="text-2xl font-bold mb-6 text-indigo-400">Profile & Settings</h1>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-900 border border-green-700 text-green-200 rounded">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:border-indigo-500"
            />
            {errors.name && (
              <span className="text-red-500 text-xs">{errors.name}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:border-indigo-500"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">API Key</label>
            <input
              type="password"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:border-indigo-500"
              placeholder="sk-..."
            />
            {errors.apiKey && (
              <span className="text-red-500 text-xs">{errors.apiKey}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Theme</label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:border-indigo-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
              id="notifications"
              className="mr-2"
            />
            <label htmlFor="notifications" className="text-sm font-medium">
              Enable Notifications
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
