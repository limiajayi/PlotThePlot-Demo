import { useState } from "react";
import PasswordConfirmModal from "../common/PasswordConfirmModal";


const SettingsPage = () => {

    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [showEmailConfirm, setShowEmailConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <>
            Everyone calling me an internet bot tell them n i fucking love it


            {/* //TODO: sensitive actions for passwords */}
            <div>
                Change your password:
                
                <PasswordConfirmModal />
            </div>

        </>
    );
};

export default SettingsPage;