import React, { useState, useRef } from 'react';
import { setCompanyPageName } from '../actions';
import { Settings } from 'lucide-react';

interface SettingsModalProps {
    email?: string | null;
    pageName: string | null;
    onPageNameChange: (newPageName: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ email, pageName, onPageNameChange }) => {
    const [newPageName, setNewPageName] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const modalRef = useRef<HTMLDialogElement>(null);

    const handleSave = async () => {
        if (newPageName !== "") {
            setLoading(true);
            try {
                if (email) {
                    await setCompanyPageName(email, newPageName);
                    onPageNameChange(newPageName);
                    setNewPageName("");
                    setLoading(false);
                    modalRef.current?.close();
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
    };

    const openModal = () => {
        modalRef.current?.showModal();
    };

    return (
        <>
            <button className="btn btn-sm btn-accent btn-circle" onClick={openModal}>
                <Settings className="w-4 h-4" />
            </button>
            <dialog ref={modalRef} id="settings_modal" className="modal">
                <div className="modal-box rounded-lg shadow-lg p-6">
                    <form method="dialog" className="flex justify-end mb-4">
                        <button type="button" className="btn btn-sm btn-circle btn-ghost" onClick={() => modalRef.current?.close()}>✕</button>
                    </form>
                    <h3 className="font-bold text-lg mb-4">Paramètres</h3>
                    <label className="form-control w-full">
                        <div className="label mb-2">
                            <span className="label-text text-gray-600 font-medium">Le nom de votre page (Ce n&apos;est pas modifiable)</span>
                        </div>
                        {pageName ? (
                            <div className="badge badge-accent text-lg py-2 px-4 mb-4">
                                {pageName}
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nom de votre page"
                                    className="input input-bordered input-sm w-full"
                                    value={newPageName}
                                    onChange={(e) => setNewPageName(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    className="btn btn-sm btn-accent w-full"
                                    disabled={loading}
                                    onClick={handleSave}
                                >
                                    {loading ? (
                                        <svg
                                            className="animate-spin h-5 w-5 mr-3 text-white"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        "Enregistrer"
                                    )}
                                </button>
                            </div>
                        )}
                    </label>
                </div>
            </dialog>
        </>
    );
};

export default SettingsModal;