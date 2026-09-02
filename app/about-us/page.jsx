export default function About() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">Home / About Us</div>
          <h1>About Drago Pharma</h1>
        </div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <p>
            Drago Pharma is a peptide company dedicated to precision synthesis and supply for
            the peptide and biotechnology fields. We work with laboratories and research teams
            to provide custom peptide solutions, bulk supply, and rigorously tested compounds.
          </p>
          <p>
            Every batch is produced with an emphasis on purity and consistency, and all products
            are intended strictly for laboratory research and are not approved for human or
            veterinary use.
          </p>
          <h3>What we offer</h3>
          <ul>
            <li>Third-party verified purity on every batch</li>
            <li>Custom peptide synthesis tailored to research requirements</li>
            <li>Bulk supply for ongoing research programs</li>
            <li>Responsive support for research and logistics questions</li>
          </ul>
        </div>
      </section>
    </>
  );
}
