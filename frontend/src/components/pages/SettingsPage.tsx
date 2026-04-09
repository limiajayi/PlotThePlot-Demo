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
    const isValidUsername = (username: string) => /^[a-zA-Z0-9_-]{7,20}$/.test(username);

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
            console.log(error);
            setUsernameState({ error: 'Failed to update username. Please try again.', success: false, loading: false });
            return;
        }

        updateUser({ username: newUsername });
        setUsernameState({ error: null, success: true, loading: false });
        setNewUsername('');
        navigate(`/users/${newUsername}/settings`, { replace: true });

    }

    // --- password ---

    const isValidPassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/.test(password);

    const handlePasswordConfirmOpen = () => {
        setPasswordState(defaultSectionState);

        if (!isValidPassword(newPassword)) {
            setPasswordState(prev => ({
                ...prev,
                error: 'Password must be at least 8 characters and include an uppercase letter, lowercase letter, number and special character.'
            }));
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordState(prev => ({ ...prev, error: 'Passwords do not match.' }));
            return;
        }

        setShowPasswordConfirm(true);
    }

    // --- email ---
    const handleEmailConfirmOpen = () => {
        setEmailState(defaultSectionState);

        if (!newEmail.trim()) {
            setEmailState(prev => ({...prev, error: 'Please enter a new email address.'}));
            return;
        }

        if (newEmail === user.email) {
            setEmailState(prev => ({ ...prev, error: 'This is already your email address.' }));
            return;
        }

        setShowEmailConfirm(true);

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
                <h2>Change Password</h2>

                <input 
                    type="password"
                    value={newPassword}
                    onChange={({ target }) => {
                        setNewPassword(target.value);
                        setPasswordState(defaultSectionState);
                    }}
                    placeholder="New password"
                    minLength={8}
                />

                <input 
                    type="password"
                    value={confirmPassword}
                    onChange={({ target }) => {
                        setConfirmPassword(target.value);
                        setPasswordState(defaultSectionState);
                    }}
                    placeholder="Confirm new password"
                    minLength={8}
                />

                {passwordState.error && <p>{passwordState.error}</p>}
                {passwordState.success && <p>Password updated successfully.</p>}

                <button
                    onClick={handlePasswordConfirmOpen}
                    disabled={!newPassword.trim() || !confirmPassword.trim() || passwordState.loading}
                >
                    Change Password
                </button>

            </section>

            {/* --- email section --- */}
            <section>
                <h2>Change Email</h2>
                <p>Current email: {user.email}</p>

                <input 
                    type="email" 
                    value={newEmail}
                    onChange={({ target }) => {
                        setNewEmail(target.value);
                        setEmailState(defaultSectionState);
                    }}
                    placeholder="New email address"
                />

                {emailState.error && <p>{emailState.error}</p>}
                {emailState.success && <p>Confirmation email sent to {newEmail}. Please check your inbox.</p>}

                <button
                    onClick={handleEmailConfirmOpen}
                    disabled={!newEmail.trim()}
                >
                    Change Email
                </button>

            </section>

            {/* --- appearance section --- */}
            <section>
                <h2>Appearance</h2>
                <p>Dark mode and accessibility settings coming soon.</p>
            </section>

            {/* --- delete account section --- */}
                <section>
                    <h2>Delete Account</h2>
                    <p>This will permanently delete your account and all you ratings. This cannot be undone.</p>

                    {deleteState.error && <p>{deleteState.error}</p>}

                    <button
                        onClick={() => {
                            setDeleteState(defaultSectionState);
                            setShowDeleteConfirm(true);
                        }}
                    >
                        Delete Account
                    </button>

                </section>

                {/* --- password confirm modals --- */}
                <PasswordConfirmModal
                    isOpen={showPasswordConfirm}
                    onClose={() => setShowPasswordConfirm(false)}
                    onConfirmed={async () => {
                        const { error } = await supabase.auth.updateUser({ password: newPassword });
                        if (error) throw new Error(error.message);
                        setPasswordState({ error: null, success: true, loading: false });
                        setNewPassword('');
                        setConfirmPassword('');
                    }}
                />

                <PasswordConfirmModal 
                    isOpen={showEmailConfirm}
                    onClose={() => setShowEmailConfirm(false)}
                    onConfirmed={async () => {
                        const { error: authError } = await supabase.auth.updateUser({ email: newEmail });
                        if (authError) throw new Error(authError.message);

                        const { error: dbError } = await supabase
                        .from('users')
                        .update({ email: newEmail })
                        .eq('id', user.id);

                        if (dbError) throw new Error(dbError.message);

                        updateUser({ email: newEmail });
                        setEmailState({ error: null, success: true, loading: false });
                        setNewEmail('');
                    }}
                />

                <PasswordConfirmModal 
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirmed={async () => {
                        await api.users.deleteAccount(user.id);
                        await logout();
                        navigate('/login', { replace: true });
                    }}
                />

        </div>
    );
};

export default SettingsPage;