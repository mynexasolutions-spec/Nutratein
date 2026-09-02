'use client';

import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hook this up to a Supabase table (e.g. `contact_messages`) or an email service as needed.
    setSent(true);
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">Home / Contact</div>
          <h1>Contact Us</h1>
        </div>
      </div>

      <section className="section">
        <div className="container grid-2">
          <form className="form-card" onSubmit={handleSubmit}>
            <h3>Send a message</h3>
            {sent && <div className="alert alert-success">Thanks — we'll get back to you shortly.</div>}
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <button className="btn btn-primary btn-block">Send Message</button>
          </form>

          <div className="form-card" style={{ alignSelf: 'flex-start' }}>
            <h3>Get in touch</h3>
            <p><strong>Email:</strong> info@dragopharma.com</p>
            <p><strong>Hours:</strong> Monday–Friday, 9am–5pm</p>
            <p className="helper-text">For quote requests on bulk or custom synthesis, please include the peptide, quantity, and timeline in your message.</p>
          </div>
        </div>
      </section>
    </>
  );
}
