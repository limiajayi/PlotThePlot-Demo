import { useState } from "react";
import Modal from "react-modal";
import { useAuth } from "../../context/useAuth";
import styles from "../../styles/PasswordConfirmModal.module.css";

type PasswordConfirmModalProps = {
    isOpen: boolean;
    onConfirmed: () => Promise<void>;
    onClose: () => void;
};

const PasswordConfirmModal = ({
    isOpen,
    onConfirmed,
    onClose,
}: PasswordConfirmModalProps) => {
    const { user, login } = useAuth();
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setPassword("");
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
            setError("Incorrect password. Please try again.");
            setLoading(false);
            return;
        }

        try {
            await onConfirmed();
            handleClose();
        } catch {
            setError("Something went wrong. Please try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Confirm Password"
            appElement={document.getElementById("root") as HTMLElement}
            className={styles.modalContent}
            overlayClassName={styles.modalOverlay}
        >
            <div className={styles.container}>
                <h3 className={styles.title}>Confirm your password</h3>
                <p className={styles.description}>
                    Enter your current password to continue.
                </p>
                <input
                    type="password"
                    value={password}
                    className={styles.input}
                    onChange={({ target }) => setPassword(target.value)}
                    placeholder="••••••••"
                />
                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.buttonGroup}>
                    {/* if user's change their mind */}
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={handleClose}
                    >
                        Cancel
                    </button>

                    {/* if the password has been changed */}
                    <button
                        type="button"
                        className={styles.confirmButton}
                        onClick={handleConfirm}
                        disabled={loading || !password.trim()}
                    >
                        {loading ? "Confirming..." : "Confirm"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default PasswordConfirmModal;
