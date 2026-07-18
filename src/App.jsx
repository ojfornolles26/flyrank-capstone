import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';

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
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  const inputBaseClass = "w-full p-2.5 rounded bg-slate-900 border text-slate-100 text-sm focus:outline-none transition-colors";
  const labelClass = "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <main className="w-full max-w-xl bg-slate-900/40 border border-slate-800 rounded-lg p-6 md:p-8">
        <header className="mb-6">
          <h1 className="text-xl font-medium text-slate-100">
            AI Developer Profile & Settings
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Configure your environment, model parameters, and provider API keys.
          </p>
        </header>

        {isSaved && (
          <div className="mb-6 p-3 bg-slate-800/80 border border-slate-700 text-slate-200 rounded flex items-center gap-2.5 text-xs animate-fadeIn">
            <CheckCircle2 className="text-emerald-500 h-4 w-4 flex-shrink-0" />
            <span>Settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {/* Section 1: Developer Profile */}
          <section className="space-y-4">
            <div className="border-b border-slate-800 pb-1.5">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Developer Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <label htmlFor="name" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={`${inputBaseClass} ${
                    errors.name ? 'border-red-500/80 focus:border-red-500' : 'border-slate-800 focus:border-slate-600'
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
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`${inputBaseClass} ${
                    errors.email ? 'border-red-500/80 focus:border-red-500' : 'border-slate-800 focus:border-slate-600'
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
            <div className="border-b border-slate-800 pb-1.5">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">API Provider Credentials</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <label htmlFor="openaiKey" className={labelClass}>
                  OpenAI API Key
                </label>
                <div className="relative">
                  <input
                    id="openaiKey"
                    type={showOpenaiKey ? 'text' : 'password'}
                    {...register('openaiKey')}
                    aria-invalid={errors.openaiKey ? 'true' : 'false'}
                    aria-describedby={errors.openaiKey ? 'openaiKey-error' : undefined}
                    className={`${inputBaseClass} pr-10 ${
                      errors.openaiKey ? 'border-red-500/80 focus:border-red-500' : 'border-slate-800 focus:border-slate-600'
                    }`}
                    placeholder="sk-..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 focus:outline-none"
                    aria-label={showOpenaiKey ? 'Hide key' : 'Show key'}
                  >
                    {showOpenaiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.openaiKey && (
                  <span id="openaiKey-error" className="text-red-400 text-xs mt-1 block">
                    {errors.openaiKey.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="anthropicKey" className={labelClass}>
                  Anthropic API Key
                </label>
                <div className="relative">
                  <input
                    id="anthropicKey"
                    type={showAnthropicKey ? 'text' : 'password'}
                    {...register('anthropicKey')}
                    aria-invalid={errors.anthropicKey ? 'true' : 'false'}
                    aria-describedby={errors.anthropicKey ? 'anthropicKey-error' : undefined}
                    className={`${inputBaseClass} pr-10 ${
                      errors.anthropicKey ? 'border-red-500/80 focus:border-red-500' : 'border-slate-800 focus:border-slate-600'
                    }`}
                    placeholder="sk-ant-..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 focus:outline-none"
                    aria-label={showAnthropicKey ? 'Hide key' : 'Show key'}
                  >
                    {showAnthropicKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
            <div className="border-b border-slate-800 pb-1.5">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Model Preferences</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label htmlFor="defaultModel" className={labelClass}>
                  Default Model
                </label>
                <select
                  id="defaultModel"
                  {...register('defaultModel')}
                  className="w-full p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-slate-600 transition-colors"
                >
                  <option value="gemini-2-flash">Gemini 2 Flash</option>
                  <option value="gemini-1-5-pro">Gemini 1.5 Pro</option>
                  <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                  <option value="gpt-4o">GPT-4o</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="temperature" className={labelClass}>
                  Temperature
                </label>
                <input
                  id="temperature"
                  type="number"
                  step="0.1"
                  {...register('temperature')}
                  aria-invalid={errors.temperature ? 'true' : 'false'}
                  aria-describedby={errors.temperature ? 'temperature-error' : undefined}
                  className={`${inputBaseClass} ${
                    errors.temperature ? 'border-red-500/80 focus:border-red-500' : 'border-slate-800 focus:border-slate-600'
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
                <label htmlFor="maxTokens" className={labelClass}>
                  Max Tokens
                </label>
                <input
                  id="maxTokens"
                  type="number"
                  {...register('maxTokens')}
                  aria-invalid={errors.maxTokens ? 'true' : 'false'}
                  aria-describedby={errors.maxTokens ? 'maxTokens-error' : undefined}
                  className={`${inputBaseClass} ${
                    errors.maxTokens ? 'border-red-500/80 focus:border-red-500' : 'border-slate-800 focus:border-slate-600'
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
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 rounded text-sm font-semibold transition-colors mt-4"
          >
            {isSubmitting ? 'Saving Settings...' : 'Save Settings'}
          </button>
        </form>
      </main>
    </div>
  );
}
