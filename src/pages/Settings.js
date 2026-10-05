// import React, { useEffect, useState, useContext } from 'react';
// import { 
//   Container,
//   Card,
//   CardContent,
//   Typography,
//   Divider,
//   Box,
//   CircularProgress
// } from '@mui/material';
// import ProfilePictureUpload from './ProfilePictureUpload';
// import axios from 'axios';
// import { LoginContext } from '../context/Context';
// import { accountsAPI } from '../services/api';
// const UserProfile = () => {
//   const [selectedAccount, setSelectedAccount] = useState(sessionStorage.getItem("accountId"));
//   const [accountInfo, setAccountInfo] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//  const email = sessionStorage.getItem("email");
//   const fetchAccountInfo = async (accountIdToFetch) => {
//   try {
//     setLoading(true);

//     const res = await accountsAPI.getAccountById(accountIdToFetch);

//     setAccountInfo(res.data);
//     setError(null);
//   } catch (err) {
//     console.error("Error fetching account information:", err);
//     setError("Failed to fetch account information");
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     if (selectedAccount) {
//       fetchAccountInfo(selectedAccount);
//     }
//   }, [selectedAccount]);

//   const handleUploadSuccess = (newImageUrl) => {
//     setAccountInfo((prev) => ({
//       ...prev,
//       profilePicture: newImageUrl
//     }));
//     fetchAccountInfo(selectedAccount);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Typography color="error">{error}</Typography>;
//   if (!accountInfo) return null;

//   return (
//     <Container maxWidth="md" sx={{ my: 4 }}>
//       <Card>
//         <CardContent>
//           <Typography variant="h4" gutterBottom>
//             Account Profile
//           </Typography>
//           <Divider sx={{ my: 2 }} />

//           <Box sx={{ 
//             display: 'flex', 
//             flexDirection: { xs: 'column', md: 'row' },
//             gap: 4,
//             alignItems: 'center'
//           }}>
//             <Box sx={{ flex: 1 }}>
//               <ProfilePictureUpload 
//                 accountId={selectedAccount}
//                 currentImage={accountInfo.profilePicture}
//                 onUploadSuccess={handleUploadSuccess}
//               />
//             </Box>

//             <Box sx={{ flex: 2 }}>
//               <Typography variant="h6" gutterBottom color='primary.main'>
//                 {accountInfo.accountName || "No Name"}
//               </Typography>
//               <Typography variant="body1" color="text.secondary" gutterBottom>
//                 <strong>Email:</strong> {email || "N/A"}
//               </Typography>
//               <Typography variant="body1" color="text.secondary" gutterBottom>
//                 <strong>Client Type:</strong> {accountInfo.clientType || "N/A"}
//               </Typography>
//               <Typography variant="body1" color="text.secondary" gutterBottom>
//                 <strong>Member Since:</strong> {formatDate(accountInfo.createdAt)}
//               </Typography>
//             </Box>
//           </Box>
//         </CardContent>
//       </Card>
//     </Container>
//   );
// };

// export default UserProfile;


import React, { useEffect, useState } from 'react';
import ProfilePictureUpload from './ProfilePictureUpload';
import { Loader2, User, Building2, Pencil, Save, X } from 'lucide-react';
import { accountsAPI, contactsAPI } from '../services/api';
import { useToast } from '../hooks/useToast';

const UserProfile = () => {
  const [selectedAccount] = useState(sessionStorage.getItem("accountId"));
  const [accountInfo, setAccountInfo] = useState(null);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
  });

  const toast = useToast();
  const email = sessionStorage.getItem("email");

  // The signed-in person is a *contact*, not the account - login stores
  // their id/name on sessionStorage.user (see context/Context.js).
  const storedUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const fetchAccountInfo = async (accountIdToFetch) => {
    try {
      setLoading(true);

      const res = await accountsAPI.getAccountById(accountIdToFetch);

      setAccountInfo(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching account information:", err);
      setError("Failed to fetch account information");
    } finally {
      setLoading(false);
    }
  };

  const fetchContact = async (contactId) => {
    try {
      const res = await contactsAPI.getContactById(contactId);
      // getContactById answers { success, data: contact }. Reading .contact
      // missed it and fell through to res.data, so the whole envelope was
      // stored as the contact - every field came out undefined. The page
      // then fell back to the name cached at login and showed middle name
      // and phone as blank, which is why saving looked like it did nothing:
      // the write succeeded, the re-read just never surfaced it.
      const data = res?.data?.data || res?.data?.contact || res?.data || null;
      setContact(data);
    } catch (err) {
      // The account panel is still useful without this, so don't fail the page
      console.error("Error fetching contact details:", err);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      fetchAccountInfo(selectedAccount);
    }
    if (storedUser?.id) {
      fetchContact(storedUser.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccount]);

  const handleUploadSuccess = (newImageUrl) => {
    setAccountInfo((prev) => ({
      ...prev,
      profilePicture: newImageUrl
    }));
    fetchAccountInfo(selectedAccount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const startEditing = () => {
    setForm({
      firstName: contact?.firstName || storedUser?.firstName || "",
      middleName: contact?.middleName || "",
      lastName: contact?.lastName || storedUser?.lastName || "",
      phone: contact?.phoneNumbers?.[0] || "",
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!storedUser?.id) return;

    try {
      setIsSaving(true);

      const payload = {
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        phoneNumbers: form.phone ? [form.phone] : [],
      };

      await contactsAPI.updateContactWithoutPassword(storedUser.id, payload);
      await fetchContact(storedUser.id);

      // keep the cached name in sync so the rest of the portal matches
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          firstName: form.firstName,
          lastName: form.lastName,
        }),
      );

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Could not update your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const fullName =
    [contact?.firstName || storedUser?.firstName, contact?.lastName || storedUser?.lastName]
      .filter(Boolean)
      .join(" ") || "—";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md mt-8 rounded-lg border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!accountInfo) return null;

  // return (
  //   <div className="w-full max-w-2xl mx-auto p-4">
  //     <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
  //       {/* Card header */}
  //       <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-muted/40">
  //         <User size={18} className="text-primary shrink-0" />
  //         <h1 className="text-lg font-semibold text-foreground">Account Profile</h1>
  //       </div>

  //       {/* Card body */}
  //       <div className="p-6">
  //         <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
  //           {/* Avatar column */}
  //           <div className="shrink-0">
  //             <ProfilePictureUpload
  //               accountId={selectedAccount}
  //               currentImage={accountInfo.profilePicture}
  //               onUploadSuccess={handleUploadSuccess}
  //             />
  //           </div>

  //           {/* Info column */}
  //           <div className="flex-1 space-y-3 w-full">
  //             <h2 className="text-xl font-bold text-primary">
  //               {accountInfo.accountName || 'No Name'}
  //             </h2>
  //             <hr className="border-border" />
  //             <div className="space-y-2 text-sm">
  //               <div className="flex gap-2">
  //                 <span className="font-semibold text-foreground min-w-[110px]">Email</span>
  //                 <span className="text-muted-foreground">{email || 'N/A'}</span>
  //               </div>
  //               <div className="flex gap-2">
  //                 <span className="font-semibold text-foreground min-w-[110px]">Client Type</span>
  //                 <span className="text-muted-foreground">{accountInfo.clientType || 'N/A'}</span>
  //               </div>
  //               <div className="flex gap-2">
  //                 <span className="font-semibold text-foreground min-w-[110px]">Member Since</span>
  //                 <span className="text-muted-foreground">{formatDate(accountInfo.createdAt)}</span>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );\\

  const Field = ({ label, value }) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-foreground break-words">
        {value || "—"}
      </span>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 space-y-6">
        {/* Page header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Your personal details and the account your firm manages for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ============ PERSONAL DETAILS (editable) ============ */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center justify-between gap-2 px-6 py-4 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2 min-w-0">
                <User size={18} className="text-primary shrink-0" />
                <h2 className="text-base font-semibold truncate">
                  Personal Details
                </h2>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={startEditing}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                >
                  <Pencil size={13} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors disabled:opacity-60"
                  >
                    <X size={13} />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {isSaving ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Save size={13} />
                    )}
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <ProfilePictureUpload
                    accountId={selectedAccount}
                    currentImage={accountInfo.profilePicture}
                    onUploadSuccess={handleUploadSuccess}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-primary truncate">
                    {fullName}
                  </p>
                  <p className="text-sm text-muted-foreground truncate" title={email || ""}>
                    {email || "—"}
                  </p>
                </div>
              </div>

              <div className="h-px w-full bg-border" />

              {!isEditing ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="First Name" value={contact?.firstName || storedUser?.firstName} />
                  <Field label="Middle Name" value={contact?.middleName} />
                  <Field label="Last Name" value={contact?.lastName || storedUser?.lastName} />
                  <Field label="Phone" value={contact?.phoneNumbers?.[0]} />
                  <div className="sm:col-span-2">
                    <Field label="Email" value={email} />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { key: "firstName", label: "First Name" },
                    { key: "middleName", label: "Middle Name" },
                    { key: "lastName", label: "Last Name" },
                    { key: "phone", label: "Phone" },
                  ].map((field) => (
                    <div key={field.key} className="flex flex-col gap-1.5">
                      <label
                        htmlFor={`profile-${field.key}`}
                        className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                      >
                        {field.label}
                      </label>
                      <input
                        id={`profile-${field.key}`}
                        type="text"
                        value={form[field.key]}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  ))}

                  {/* Email is the login identity - changing it is a firm action */}
                  <div className="sm:col-span-2">
                    <Field label="Email (contact your firm to change)" value={email} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============ ACCOUNT DETAILS (read-only) ============ */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-muted/40">
              <Building2 size={18} className="text-primary shrink-0" />
              <h2 className="text-base font-semibold truncate">
                Account Details
              </h2>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Account Name" value={accountInfo.accountName} />
                </div>
                <Field label="Client Type" value={accountInfo.clientType} />
                <Field label="Company" value={accountInfo.companyName} />
                <Field label="Member Since" value={formatDate(accountInfo.createdAt)} />
                <Field label="Country" value={accountInfo.country?.name} />
                <div className="sm:col-span-2">
                  <Field
                    label="Address"
                    value={[
                      accountInfo.streetAddress,
                      accountInfo.city,
                      accountInfo.state,
                      accountInfo.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                These details are maintained by your tax team. Contact them if
                anything here needs updating.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
