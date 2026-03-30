import { useState } from "react";
import Modal from "react-modal";
import { useAuth } from "../../context/useAuth";

type PasswordConfirmModalProps = {
    isOpen: boolean;
    onConfirmed: () => Promise<void>;
    onClose: () => void;
};

const PasswordConfirmModal = ({ isOpen, onConfirmed, onClose }: PasswordConfirmModalProps) => {
    
    const { user, login } = useAuth();
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setPassword('');
        setError(null);
        setLoading(false);
        onClose();
    };

    const handleConfirm = async () => {
        if (!password.trim() || !user) return;

        setLoading(true);
        setError(null);

        //re authenticate using their current username + password they just entered
        const { error: authError } = await login(user.username, password);

        if (authError) {
            setError('Incorrect password. Please try again.');
            setLoading(false);
            return;
        }

        try {
            await onConfirmed();
            handleClose();
        } catch {
            setError('Something went wrong. Please try again');
        } finally {
            setLoading(false)
        }

    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Confirm Password"
            appElement={document.getElementById('root') as HTMLElement}
            style={{
                content: {
                    width: '360px',
                    height: 'fit-content',
                    margin: 'auto',
                    borderRadius: '8px',
                    padding: '24px'
                }
            }}
        >
            <h3>Confirm your password</h3>
            <p>Enter your current password to continue.</p>

            <input 
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                placeholder="••••••••"
                autoFocus
            />

            {error && <p>{error}</p>}

            <div>
                {/* if user's change their mind */}
                <button type="button" onClick={handleClose} >
                    Cancel
                </button>

                {/* if the password has been changed */}
                <button type="button" onClick={handleConfirm} disabled={loading || !password.trim()}>
                    {loading ? 'Confirming...' : 'Confirm'}
                </button>
            </div>

        </Modal>
    );
};

export default PasswordConfirmModal