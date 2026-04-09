import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { isValidPassword, isValidUsername, isSusInput } from "../../utils/sanitise";
import { useState } from "react";


const SignUpPage = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '', username: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event:  React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        if (!isValidUsername(formData.username)) {
            setError('Username must be 7-20 characters...');
            setLoading(false);
            return;
        }

        if (!isValidPassword(formData.password)) {
            setError('Password must be at least 8 characters...');
            setLoading(false);
            return;
        }

        if (isSusInput(formData.username) || isSusInput(formData.email) || isSusInput(formData.password)) {
            setError('Invalid username, password or email.');
            setLoading(false);
            return;
        }

        const { error } = await signup(formData.email, formData.password, formData.username);

        if (error) {
            setError(error);
            setLoading(false);
            return;
        }

        // redirect them to their profile
        navigate(`/users/${formData.username}/profile`);
    };

    return (
        <div>
            <div>
                <div>
                    <h1>PlotThePlot</h1>
                    <p>start plotting</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>username</label>
                        <input 
                            type="text" 
                            value={formData.username}
                            onChange={({ target }) => {setFormData(prev => ({...prev, username: target.value}))}}
                            placeholder="bookenjoyer9000"
                            minLength={5}
                            maxLength={50}
                            required
                        />
                    </div>

                    <div>
                        <label>email</label>
                        <input 
                            type="email" 
                            value={formData.email}
                            onChange={({ target }) => {setFormData(prev => ({...prev, email: target.value}))}}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label>password</label>
                        <input 
                            type="password" 
                            value={formData.password}
                            onChange={({ target }) => {setFormData(prev => ({...prev, password: target.value}))}}
                            placeholder="••••••••"
                            minLength={7}
                            required
                        />
                    </div>

                    {error && <p>{error}</p>}
                    <button 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'creating account...' : 'create'}
                    </button>
                </form>

                <p>
                    already have an account? 
                    <Link to="/login">log in</Link>
                </p>

            </div>
        </div>
    );
}

export default SignUpPage;