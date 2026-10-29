// SignatureDialog.jsx
import React from "react";
import { DocusealForm } from "@docuseal/react";
import {
  X,
  CheckCircle2,
  Clock,
  Eye,
  XCircle,
  PenTool,
  Users,
  ExternalLink,
} from "lucide-react";

// A signer counts as done when DocuSeal marks them completed or stamps completed_at.
// (Note: `completed_at !== null` is true for undefined, so check truthiness instead.)
export const isSignerDone = (s) =>
  s?.status === "completed" || Boolean(s?.completed_at);

const formatDateTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return "";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getSignerState = (s) => {
  if (isSignerDone(s))
    return {
      label: "Signed",
      Icon: CheckCircle2,
      badge: "bg-green-50 text-green-700 border-green-200",
      icon: "text-green-600",
    };
  if (s.status === "declined")
    return {
      label: "Declined",
      Icon: XCircle,
      badge: "bg-red-50 text-red-700 border-red-200",
      icon: "text-red-600",
    };
  if (s.isCurrentUser)
    return {
      label: "Your signature needed",
      Icon: PenTool,
      badge: "bg-blue-50 text-blue-700 border-blue-200",
      icon: "text-blue-600",
    };
  if (s.status === "opened")
    return {
      label: "Opened, not signed",
      Icon: Eye,
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      icon: "text-amber-600",
    };
  return {
    label: "Not signed yet",
    Icon: Clock,
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    icon: "text-orange-600",
  };
};

const SignerRow = ({ signer }) => {
  const state = getSignerState(signer);
  const displayName = signer.name || signer.email || "Signer";
  return (
    <li className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3">
      <div className="h-9 w-9 shrink-0 rounded-full bg-slate-100 flex items-center justify-center">
        <state.Icon className={`w-4 h-4 ${state.icon}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800 truncate">
          {displayName}
          {signer.isCurrentUser && (
            <span className="ml-1 font-normal text-slate-500">(you)</span>
          )}
        </p>
        {signer.name && signer.email && (
          <p className="text-xs text-slate-500 truncate">{signer.email}</p>
        )}
        {signer.role && (
          <p className="text-xs text-slate-400 truncate">{signer.role}</p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium ${state.badge}`}
          >
            {state.label}
          </span>
          {isSignerDone(signer) && signer.completed_at && (
            <span className="text-[11px] text-slate-500">
              {formatDateTime(signer.completed_at)}
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

const SignatureDialog = ({
  open,
  slug, // null => current user has nothing left to sign (status-only view)
  email,
  documentName,
  signers = [],
  onClose,
  onComplete,
  onOpenDocument, // optional
}) => {
  if (!open) return null;

  const signed = signers.filter(isSignerDone);
  const pending = signers.filter((s) => !isSignerDone(s));
  const total = signers.length;
  const percent = total ? Math.round((signed.length / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
      <div className="w-full max-w-7xl bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50">
          <div className="min-w-0">
            <h3 className="text-2xl font-bold text-slate-800">
              Digital Signature
            </h3>
            <p className="text-sm text-slate-500 mt-1 truncate">
              {documentName || "Complete your signature process securely"}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-11 w-11 shrink-0 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Body */}
        <div className="h-[82vh] grid grid-cols-1 lg:grid-cols-[1fr_340px] overflow-hidden">
          {/* Left: form or "already signed" state */}
          <div className="h-full overflow-auto bg-slate-100">
            {slug ? (
              <div className="w-full h-full bg-white">
                <DocusealForm
                  src={`https://docuseal.com/s/${slug}`}
                  email={email}
                  onComplete={onComplete}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-slate-800">
                  You've signed this document
                </h4>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">
                  {pending.length > 0
                    ? `Waiting for ${pending.length} more signer${
                        pending.length > 1 ? "s" : ""
                      } to sign.`
                    : "All signers have signed."}
                </p>
                {onOpenDocument && (
                  <button
                    onClick={onOpenDocument}
                    className="mt-5 h-11 px-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open document
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: signer status panel */}
          <aside className="h-full overflow-auto border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-slate-600" />
              <h4 className="font-semibold text-slate-800">Signers</h4>
            </div>
            <p className="text-sm text-slate-500">
              {signed.length} of {total} signed
            </p>
            <div
              className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>

            {pending.length > 0 && (
              <section className="mt-6">
                <h5 className="text-sm font-semibold text-slate-700 mb-2">
                  Still waiting on ({pending.length})
                </h5>
                <ul className="space-y-2">
                  {pending.map((s, i) => (
                    <SignerRow key={s.slug || s.email || i} signer={s} />
                  ))}
                </ul>
              </section>
            )}

            {signed.length > 0 && (
              <section className="mt-6">
                <h5 className="text-sm font-semibold text-slate-700 mb-2">
                  Signed ({signed.length})
                </h5>
                <ul className="space-y-2">
                  {signed.map((s, i) => (
                    <SignerRow key={s.slug || s.email || i} signer={s} />
                  ))}
                </ul>
              </section>
            )}

            {total === 0 && (
              <p className="mt-6 text-sm text-slate-500">
                No signer details were returned for this document.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SignatureDialog;