// PMS-116: the client's view of one invoice - invoice-backend's one template,
// the same document as the email attachment, Download and Print. Shown in a
// sandboxed iframe (InvoiceDocumentFrame).
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import InvoiceDocumentFrame from "../../components/InvoiceDocumentFrame";
import { invoiceAPI } from "../../services/api";

const InvoiceViewDialog = ({ invoiceId, invoiceNumber, onClose, onDownload, onPrint }) => {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setHtml("");
    setError("");
    invoiceAPI
      .getInvoiceViewHtml(invoiceId)
      .then((res) => {
        if (!cancelled) setHtml(typeof res.data === "string" ? res.data : "");
      })
      .catch(() => {
        if (!cancelled) setError("This invoice could not be loaded. Please try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [invoiceId]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label={`Invoice #${invoiceNumber ?? ""}`}>
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[900px] bg-background border-l border-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">Invoice #{invoiceNumber}</h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-muted" onClick={onPrint}>
              Print
            </button>
            <button className="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-muted" onClick={onDownload}>
              Download
            </button>
            <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-muted/30 p-3">
          {error ? (
            <p className="text-sm text-destructive p-4">{error}</p>
          ) : html ? (
            <InvoiceDocumentFrame html={html} title={`Invoice #${invoiceNumber ?? ""}`} height="100%" />
          ) : (
            <p className="text-sm text-muted-foreground p-4">Loading invoice…</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewDialog;
