"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(null);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:4000/api/v1/admin/import/excel', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to parse Excel');
      setPreview(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    if (!preview || !preview.products) return;
    setImporting(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:4000/api/v1/admin/import/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: preview.batchId,
          products: preview.products,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to commit import');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-ds-emerald mb-2">Inventory Import</h1>
        <p className="text-ds-mutedText">Upload the Boutique Excel Inventory file to intelligently classify and import products.</p>
        <p className="text-ds-copper text-sm mt-2 font-medium">Note: Imported products will default to draft status and require images to be added later.</p>
      </div>

      {!result && (
        <div className="mb-8 p-6 bg-ds-warmWhite rounded-lg border border-ds-border shadow-sm">
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            onChange={handleFileChange}
            className="block w-full text-sm text-ds-mutedText file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-ds-softSage file:text-ds-emerald hover:file:bg-ds-mutedSage"
          />
          <button 
            onClick={handleUpload} 
            disabled={!file || loading}
            className="mt-4 px-4 py-2 bg-ds-emerald text-ds-ivory rounded disabled:opacity-50"
          >
            {loading ? 'Parsing...' : 'Preview Import'}
          </button>
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-ds-error rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {result && (
        <div className="mb-8 p-6 bg-ds-softSage text-ds-emerald rounded-lg border border-ds-mutedSage">
          <h2 className="text-lg font-serif mb-4">Import Complete!</h2>
          <ul className="space-y-2 mb-4">
            <li>Products imported: {result.importedProducts}</li>
            <li>Variants imported: {result.importedVariants}</li>
            <li>Skipped (duplicates): {result.skippedProducts}</li>
          </ul>
          {result.warnings && result.warnings.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2 text-ds-copper">Warnings:</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {result.warnings.map((w: string, i: number) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
          <button 
            onClick={() => router.push('/admin/products')}
            className="mt-6 px-4 py-2 bg-ds-emerald text-ds-ivory rounded"
          >
            Go to Products
          </button>
        </div>
      )}

      {preview && !result && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-ds-emerald">Preview ({preview.products.length} products found)</h2>
            <button 
              onClick={handleCommit} 
              disabled={importing}
              className="px-6 py-2 bg-ds-emerald text-ds-ivory rounded font-medium disabled:opacity-50 shadow-sm"
            >
              {importing ? 'Committing...' : 'Commit Import'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preview.products.map((p: any) => (
              <div key={p.temporaryId} className="bg-ds-warmWhite border border-ds-border rounded-lg p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-sans font-medium text-ds-charcoal">{p.title}</h3>
                  {p.needsReview && (
                    <span className="px-2 py-1 text-[10px] uppercase font-bold bg-ds-ivory text-ds-copper border border-ds-copper rounded">Needs Review</span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-ds-mutedText mb-4">
                  <p><span className="font-medium text-ds-charcoal">Source:</span> {p.sourceCode}</p>
                  <p>
                    <span className="font-medium text-ds-charcoal">Type:</span> {p.productType} 
                    <span className={[
                      'ml-2 text-xs px-2 py-0.5 rounded',
                      p.classificationConfidence === 'high' ? 'bg-ds-softSage text-ds-success' : 'bg-ds-ivory text-ds-copper'
                    ].join(' ')}>
                      {p.classificationConfidence} conf
                    </span>
                  </p>
                  <p><span className="font-medium text-ds-charcoal">Variants:</span> {p.variantCount}</p>
                  <p><span className="font-medium text-ds-charcoal">Total Stock:</span> {p.totalStock}</p>
                  <p><span className="font-medium text-ds-charcoal">Price:</span> ₹{p.priceRange.min}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
