import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, User, Mail, Key, Sliders, CheckCircle2 } from 'lucide-react';

const settingsSchema = z.object({
  name: z.string().min(2, { message: "Full Name must be at least 2 characters" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  openaiKey: z.string().optional().or(z.literal("")).superRefine((val, ctx) => {
    if (val && val.length > 0) {
      if (!val.startsWith("sk-")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "OpenAI API Key must start with 'sk-'"
        });
      }
      if (val.length < 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "OpenAI API Key must be at least 20 characters"
        });
      }
    }
  }),
  anthropicKey: z.string().optional().or(z.literal("")).superRefine((val, ctx) => {
    if (val && val.length > 0) {
      if (!val.startsWith("sk-ant-")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Anthropic API Key must start with 'sk-ant-'"
        });
      }
      if (val.length < 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Anthropic API Key must be at least 20 characters"
        });
      }
    }
  }),
  defaultModel: z.enum(['gemini-2-flash', 'gemini-1-5-pro', 'claude-3-5-sonnet', 'gpt-4o']),
  temperature: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Temperature must be between 0.0 and 2.0" })
      .min(0.0, { message: "Temperature must be between 0.0 and 2.0" })
      .max(2.0, { message: "Temperature must be between 0.0 and 2.0" })
  ),
  maxTokens: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Max Tokens must be between 1 and 8192" })
      .int({ message: "Max Tokens must be an integer" })
      .min(1, { message: "Max Tokens must be between 1 and 8192" })
      .max(8192, { message: "Max Tokens must be between 1 and 8192" })
  ),
});

export default function App() {
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
      email: '',
      openaiKey: '',
      anthropicKey: '',
      defaultModel: 'gemini-2-flash',
      temperature: 0.7,
      maxTokens: 2048,
    },
  });

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Developer Profile & Settings
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Configure your environment, model parameters, and provider API keys securely.
          </p>
        </header>

        {isSaved && (
          <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-200 rounded-xl flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="text-emerald-400 h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">Settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
          {/* Section 1: Developer Profile */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <User className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-slate-200">Developer Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={`p-2.5 rounded-lg bg-slate-950 border text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    errors.name ? 'border-red-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                  placeholder="e.g. John Doe"
                />
                {errors.name && (
                  <span id="name-error" className="text-red-400 text-xs mt-1 block">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`p-2.5 rounded-lg bg-slate-950 border text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    errors.email ? 'border-red-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                  placeholder="e.g. john@example.com"
                />
                {errors.email && (
                  <span id="email-error" className="text-red-400 text-xs mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: API Keys */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Key className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-slate-200">API Provider Credentials</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="openaiKey" className="text-sm font-medium text-slate-300 mb-1">
                  OpenAI API Key
                </label>
                <div className="relative">
                  <input
                    id="openaiKey"
                    type={showOpenaiKey ? 'text' : 'password'}
                    {...register('openaiKey')}
                    aria-invalid={errors.openaiKey ? 'true' : 'false'}
                    aria-describedby={errors.openaiKey ? 'openaiKey-error' : undefined}
                    className={`w-full p-2.5 pr-10 rounded-lg bg-slate-950 border text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                      errors.openaiKey ? 'border-red-500' : 'border-slate-800 focus:border-indigo-500'
                    }`}
                    placeholder="sk-..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none"
                    aria-label={showOpenaiKey ? 'Hide key' : 'Show key'}
                  >
                    {showOpenaiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.openaiKey && (
                  <span id="openaiKey-error" className="text-red-400 text-xs mt-1 block">
                    {errors.openaiKey.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="anthropicKey" className="text-sm font-medium text-slate-300 mb-1">
                  Anthropic API Key
                </label>
                <div className="relative">
                  <input
                    id="anthropicKey"
                    type={showAnthropicKey ? 'text' : 'password'}
                    {...register('anthropicKey')}
                    aria-invalid={errors.anthropicKey ? 'true' : 'false'}
                    aria-describedby={errors.anthropicKey ? 'anthropicKey-error' : undefined}
                    className={`w-full p-2.5 pr-10 rounded-lg bg-slate-950 border text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                      errors.anthropicKey ? 'border-red-500' : 'border-slate-800 focus:border-indigo-500'
                    }`}
                    placeholder="sk-ant-..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none"
                    aria-label={showAnthropicKey ? 'Hide key' : 'Show key'}
                  >
                    {showAnthropicKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.anthropicKey && (
                  <span id="anthropicKey-error" className="text-red-400 text-xs mt-1 block">
                    {errors.anthropicKey.message}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Section 3: Model Parameters */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sliders className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-slate-200">Model Preferences</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label htmlFor="defaultModel" className="text-sm font-medium text-slate-300 mb-1">
                  Default Model
                </label>
                <select
                  id="defaultModel"
                  {...register('defaultModel')}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                >
                  <option value="gemini-2-flash">Gemini 2 Flash</option>
                  <option value="gemini-1-5-pro">Gemini 1.5 Pro</option>
                  <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                  <option value="gpt-4o">GPT-4o</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="temperature" className="text-sm font-medium text-slate-300 mb-1">
                  Temperature
                </label>
                <input
                  id="temperature"
                  type="number"
                  step="0.1"
                  {...register('temperature')}
                  aria-invalid={errors.temperature ? 'true' : 'false'}
                  aria-describedby={errors.temperature ? 'temperature-error' : undefined}
                  className={`p-2.5 rounded-lg bg-slate-950 border text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    errors.temperature ? 'border-red-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                  placeholder="0.7"
                />
                {errors.temperature && (
                  <span id="temperature-error" className="text-red-400 text-xs mt-1 block">
                    {errors.temperature.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="maxTokens" className="text-sm font-medium text-slate-300 mb-1">
                  Max Tokens
                </label>
                <input
                  id="maxTokens"
                  type="number"
                  {...register('maxTokens')}
                  aria-invalid={errors.maxTokens ? 'true' : 'false'}
                  aria-describedby={errors.maxTokens ? 'maxTokens-error' : undefined}
                  className={`p-2.5 rounded-lg bg-slate-950 border text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    errors.maxTokens ? 'border-red-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                  placeholder="2048"
                />
                {errors.maxTokens && (
                  <span id="maxTokens-error" className="text-red-400 text-xs mt-1 block">
                    {errors.maxTokens.message}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-950/50 hover:shadow-indigo-900/50 active:scale-[0.98] transition-all"
          >
            {isSubmitting ? 'Saving Settings...' : 'Save Settings'}
          </button>
        </form>
      </main>
    </div>
  );
}
