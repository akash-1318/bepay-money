import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';
import { CURRENCY_OPTIONS, NETWORK_OPTIONS } from '@/constants/options';

const CreatePaymentLink: React.FC = () => {
    const navigate = useNavigate();

    // Form states
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState(CURRENCY_OPTIONS[0].value);
    const [network, setNetwork] = useState(NETWORK_OPTIONS[0].value);
    const [description, setDescription] = useState('');

    // Default expiry: 24 hours from now
    const getDefaultExpiry = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset());
        return tomorrow.toISOString().slice(0, 16);
    };
    const [expiresAt, setExpiresAt] = useState(getDefaultExpiry());
    const [externalReference, setExternalReference] = useState('');

    // Validation errors
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) {
            newErrors.title = 'Payment title is required';
        }

        const parsedAmount = parseFloat(amount);
        if (!amount) {
            newErrors.amount = 'Amount is required';
        } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
            newErrors.amount = 'Amount must be a positive number';
        }

        if (!expiresAt) {
            newErrors.expiresAt = 'Expiry date and time is required';
        } else {
            const expiryDate = new Date(expiresAt);
            if (expiryDate <= new Date()) {
                newErrors.expiresAt = 'Expiry time must be in the future';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const expiryISO = new Date(expiresAt).toISOString();

            const created = await api.createPaymentLink({
                title,
                amount: parseFloat(amount).toFixed(2),
                currency,
                network,
                description: description || undefined,
                expiresAt: expiryISO,
                externalReference: externalReference || undefined
            });

            navigate(`/payment-links/${created.id}`);
        } catch (err) {
            console.error('Failed to create payment link', err);
            setErrors({ submit: 'Failed to create payment link. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-200 mx-auto font-sans">
            {/* Back Header */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/payment-links')}
                    className="p-2 bg-bg-card hover:bg-border rounded-full size-9 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 text-black" />
                </Button>
                <h1 className="page-title">Create Payment Link</h1>
            </div>

            {/* Form Card Container */}
            <div className="card-container w-full p-6 md:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {errors.submit && (
                        <div className="p-3 bg-danger-bg border border-danger-border text-danger-icon rounded-lg text-sm font-medium">
                            {errors.submit}
                        </div>
                    )}

                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-black uppercase tracking-wider">
                            Payment Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            placeholder="e.g., Order #1024 or Coffee Purchase"
                            value={title}
                            onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
                            className={`form-input w-full ${errors.title ? 'border-red-500 focus-visible:ring-red-200' : ''
                                }`}
                        />
                        {errors.title && (
                            <span className="text-xs font-medium text-red-500">{errors.title}</span>
                        )}
                    </div>

                    {/* Amount & Currency Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-black uppercase tracking-wider">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                step="any"
                                placeholder="e.g., 49.99"
                                value={amount}
                                onChange={(e) => setAmount((e.target as HTMLInputElement).value)}
                                className={`form-input w-full ${errors.amount ? 'border-red-500 focus-visible:ring-red-200' : ''
                                    }`}
                            />
                            {errors.amount && (
                                <span className="text-xs font-medium text-red-500">{errors.amount}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-black uppercase tracking-wider">
                                Token/Currency
                            </label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.currentTarget.value)}
                                className="form-input w-full cursor-pointer"
                            >
                                {CURRENCY_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Network & Expiry Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-black uppercase tracking-wider">
                                Blockchain Network
                            </label>
                            <select
                                value={network}
                                onChange={(e) => setNetwork(e.currentTarget.value)}
                                className="form-input w-full cursor-pointer"
                            >
                                {NETWORK_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-black uppercase tracking-wider">
                                Expiry Date & Time <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="datetime-local"
                                value={expiresAt}
                                onChange={(e) => setExpiresAt((e.target as HTMLInputElement).value)}
                                className={`form-input w-full cursor-pointer ${errors.expiresAt ? 'border-red-500 focus-visible:ring-red-200' : ''
                                    }`}
                            />
                            {errors.expiresAt && (
                                <span className="text-xs font-medium text-red-500">{errors.expiresAt}</span>
                            )}
                        </div>
                    </div>

                    {/* Description (Optional) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-black uppercase tracking-wider">
                            Description <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            placeholder="Provide details about what this payment is for..."
                            value={description}
                            onChange={(e) => setDescription(e.currentTarget.value)}
                            rows={3}
                            className="form-input w-full py-3 h-24 resize-none"
                        />
                    </div>

                    {/* External Reference ID (Optional) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-black uppercase tracking-wider">
                            External Order/Reference ID <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <Input
                            type="text"
                            placeholder="e.g., ORD-1024-X"
                            value={externalReference}
                            onChange={(e) => setExternalReference((e.target as HTMLInputElement).value)}
                            className="form-input w-full"
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-3 mt-4 border-t border-gray-100 pt-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/payment-links')}
                            className="h-11 px-5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer rounded-lg text-sm font-semibold"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="btn-primary h-10"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                'Generate Link'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePaymentLink;
