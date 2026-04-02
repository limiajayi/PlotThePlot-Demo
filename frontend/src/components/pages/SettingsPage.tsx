import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import PasswordConfirmModal from "../common/PasswordConfirmModal";
import useApi from "../../hooks/useApi";

type SectionState = {
    error: string | null;
    success: boolean;
    loading: boolean;
}

const defaultSectionState = {
    error: null,
    success: false,
    loading: false
}


const SettingsPage = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const api = useApi();

    // --- input values ---
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');

    // --- section states ---
    const [usernameState, setUsernameState] = useState<SectionState>(defaultSectionState);
    const [passwordState, setPasswordState] = useState<SectionState>(defaultSectionState);
    const [emailState, setEmailState] = useState<SectionState>(defaultSectionState);
    const [deleteState, setDeleteState] = useState<SectionState>(defaultSectionState);
    
    // --- modal states ---
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [showEmailConfirm, setShowEmailConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (!user) return null;

    // --- username ---
    const isValidUsername = (username: string) => /^[a-zA-Z0-9_-]{7,50}$/.test(username);

    const handleUsernameChange = async () => {
        setUsernameState(defaultSectionState);

        // if the user's username isnt valid
        if (!isValidUsername(newUsername)) {
            setUsernameState(prev => ({...prev, error: 'Username must be 7-50 characters and only contain letters, numbers, underscores or hyphens.'}));
            return;
        }

        // if the user just picked the same username as before
        if (newUsername === user.username) {
            setUsernameState(prev => ({...prev, error: 'This is already your username.'}));
            return;
        }

        setUsernameState(prev => ({...prev, loading: true}));

        const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', newUsername)
        .single();

        if (existing) {
            setUsernameState({ error: 'This username is already taken.', success: false, loading: false });
            return;
        }

        const { error } = await supabase
        .from('users')
        .update({ username: newUsername })
        .eq('id', user.id);

        if (error) {
            setUsernameState({ error: 'Failed to update username. Please try again.', success: false, loading: false });
            return;
        }

        updateUser({ username: newUsername });
        setUsernameState({ error: null, success: true, loading: false });
        setNewUsername('');
        navigate(`/users/${newUsername}/settings`, { replace: true });

    }

    return (
        <div>
            <div>
                <button onClick={() => navigate(`users/${user?.username}/profile`)}>
                    Back to profile
                </button>
                <h1>Settings</h1>

            </div>

            {/* ---- username section ---- */}
            <section>
                <h2>Change Username</h2>
                <p>Current username: {user?.username}</p>

                <input 
                    type="text" 
                    value={newUsername}
                    onChange={({ target }) => {
                        setNewUsername(target.value);
                        setUsernameState(defaultSectionState);
                    }}
                    placeholder="New Username"
                    minLength={7}
                    maxLength={50}
                />

                {usernameState.error && <p>{usernameState.error}</p>}
                {usernameState.success && <p>Username updated successfully.</p>}

                <button
                    onClick={handleUsernameChange}
                    disabled={usernameState.loading || !newUsername.trim()}
                >
                    {usernameState.loading ? 'Updating...' : 'Update Username'}
                </button>

            </section>

            {/* ---- password section ---- */}
            <section>

            </section>

        </div>
    );
};

export default SettingsPage;