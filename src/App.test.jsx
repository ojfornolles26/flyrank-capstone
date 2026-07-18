import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App - Profile & Settings Form (Round 2)', () => {
  it('renders all section headings and input fields', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /AI Developer Profile & Settings/i })).toBeInTheDocument();
    
    // User Profile fields
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    
    // API Keys fields
    expect(screen.getByLabelText(/OpenAI API Key/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Anthropic API Key/i)).toBeInTheDocument();
    
    // Model Settings fields
    expect(screen.getByLabelText(/Default Model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Temperature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Tokens/i)).toBeInTheDocument();
  });

  it('validates name and email as required fields', async () => {
    render(<App />);
    
    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));

    expect(await screen.findByText(/Full Name must be at least 2 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
  });

  it('validates name length correctly', async () => {
    render(<App />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'A' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));

    expect(await screen.findByText(/Full Name must be at least 2 characters/i)).toBeInTheDocument();
  });

  it('validates email format correctly', async () => {
    render(<App />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));

    expect(await screen.findByText(/Invalid email address/i)).toBeInTheDocument();
  });

  it('validates OpenAI API Key format if provided', async () => {
    render(<App />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } });
    
    // Invalid key (not starting with sk-)
    fireEvent.change(screen.getByLabelText(/OpenAI API Key/i), { target: { value: 'invalid-key-format-12345' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));

    expect(await screen.findByText(/OpenAI API Key must start with 'sk-'/i)).toBeInTheDocument();

    // Invalid key (too short)
    fireEvent.change(screen.getByLabelText(/OpenAI API Key/i), { target: { value: 'sk-short' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));

    expect(await screen.findByText(/OpenAI API Key must be at least 20 characters/i)).toBeInTheDocument();
  });

  it('validates Anthropic API Key format if provided', async () => {
    render(<App />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } });
    
    // Invalid key (not starting with sk-ant-)
    fireEvent.change(screen.getByLabelText(/Anthropic API Key/i), { target: { value: 'sk-invalid-key-format-12345' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));

    expect(await screen.findByText(/Anthropic API Key must start with 'sk-ant-'/i)).toBeInTheDocument();
  });

  it('validates Temperature constraints', async () => {
    render(<App />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } });
    
    // Out of range (too high)
    fireEvent.change(screen.getByLabelText(/Temperature/i), { target: { value: '2.5' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));

    expect(await screen.findByText(/Temperature must be between 0.0 and 2.0/i)).toBeInTheDocument();

    // Out of range (too low)
    fireEvent.change(screen.getByLabelText(/Temperature/i), { target: { value: '-0.1' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));

    expect(await screen.findByText(/Temperature must be between 0.0 and 2.0/i)).toBeInTheDocument();
  });

  it('validates Max Tokens constraints', async () => {
    render(<App />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } });
    
    // Out of range (too low)
    fireEvent.change(screen.getByLabelText(/Max Tokens/i), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));

    expect(await screen.findByText(/Max Tokens must be between 1 and 8192/i)).toBeInTheDocument();

    // Out of range (too high)
    fireEvent.change(screen.getByLabelText(/Max Tokens/i), { target: { value: '9000' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));

    expect(await screen.findByText(/Max Tokens must be between 1 and 8192/i)).toBeInTheDocument();
  });

  it('submits successfully with valid inputs and optional keys omitted', async () => {
    render(<App />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Temperature/i), { target: { value: '0.8' } });
    fireEvent.change(screen.getByLabelText(/Max Tokens/i), { target: { value: '4096' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));

    expect(await screen.findByText(/Settings saved successfully!/i)).toBeInTheDocument();
  });

  it('submits successfully with valid inputs and valid keys provided', async () => {
    render(<App />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/OpenAI API Key/i), { target: { value: 'sk-12345678901234567890' } });
    fireEvent.change(screen.getByLabelText(/Anthropic API Key/i), { target: { value: 'sk-ant-12345678901234567890' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));

    expect(await screen.findByText(/Settings saved successfully!/i)).toBeInTheDocument();
  });

  it('contains appropriate accessibility attributes for error states', async () => {
    render(<App />);
    
    const nameInput = screen.getByLabelText(/Full Name/i);
    expect(nameInput).toHaveAttribute('aria-invalid', 'false');

    // Submit to trigger error
    fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));

    await waitFor(() => {
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');
    });

    expect(screen.getByText(/Full Name must be at least 2 characters/i)).toHaveAttribute('id', 'name-error');
  });
});
