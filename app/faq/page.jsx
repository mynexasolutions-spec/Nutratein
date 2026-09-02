const FAQS = [
  {
    q: 'What are these peptides used for?',
    a: 'All peptides sold on this site are intended strictly for laboratory and investigational research use. They are not approved for human or veterinary use, and are not sold as drugs, supplements, or cosmetics.',
  },
  {
    q: 'How is purity verified?',
    a: 'Each batch is tested for purity, and certificates of analysis are available on request for research customers.',
  },
  {
    q: 'Do you offer custom synthesis?',
    a: 'Yes. Reach out via the Contact page with your target sequence, quantity, and timeline, and our team will follow up with a quote.',
  },
  {
    q: 'What is your shipping policy?',
    a: 'Orders are processed after confirmation and shipped via tracked courier. Shipping costs are calculated at checkout based on destination.',
  },
  {
    q: 'What is your refund policy?',
    a: 'Unopened products may be returned within 14 days of delivery. Contact our support team to start a return.',
  },
];

export default function FAQ() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">Home / FAQ</div>
          <h1>Frequently Asked Questions</h1>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          {FAQS.map((item) => (
            <div key={item.q} className="form-card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 18 }}>{item.q}</h3>
              <p style={{ marginBottom: 0 }}>{item.a}</p>
            </div>
          ))}

          <div className="disclaimer" style={{ marginTop: 40 }}>
            <h2>Laboratory Research Disclaimer</h2>
            <p>All products are intended strictly for research purposes and are not approved for human or veterinary use.</p>
          </div>
        </div>
      </section>
    </>
  );
}
