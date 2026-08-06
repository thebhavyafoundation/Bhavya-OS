"use client";

import { useState } from "react";

export function DonationForm() {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const presetAmounts = [100, 500, 1000, 5000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="donation-success">
        <h3>Thank you for your donation!</h3>
        <p>Your support helps us restore nature, empower communities, and build institutions for future generations.</p>
        <button onClick={() => setIsSubmitted(false)} className="btn btn-secondary">
          Make Another Donation
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="donation-form">
      <div className="form-group">
        <label htmlFor="amount">Donation Amount (₹)</label>
        <div className="preset-amounts">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`preset-btn ${amount === preset.toString() ? "active" : ""}`}
              onClick={() => setAmount(preset.toString())}
            >
              ₹{preset}
            </button>
          ))}
        </div>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter custom amount"
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="name">Your Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">Message (Optional)</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a message"
          rows={3}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Donate Now"}
      </button>

      <p className="donation-note">
        Your donation is tax-deductible under Section 80G of the Income Tax Act.
      </p>
    </form>
  );
}
