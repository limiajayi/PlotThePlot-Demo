import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useState } from "react";


const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const { error, userId } = await login(formData.username, formData.password);

        if (error) {
            setError(error);
            setLoading(false);
            return;
        }


        // redirect them to their profile
        navigate(`/users/${userId}/profile`);
    };

    return (
        <div>
            <div>
                <div>
                    <h1>PlotThePlot</h1>
                    <p>Welcome back</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>username</label>
                        <input 
                            type="text" 
                            value={formData.username}
                            onChange={({ target }) => setFormData(prev => ({ ...prev, username: target.value }))}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label>password</label>
                        <input 
                            type="password"
                            value={formData.password}
                            onChange={({ target }) => setFormData(prev => ({...prev, password: target.value}))} 
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    { error && <p>{error}</p> }

                    <button type="submit">
                        {loading ? 'logging in...' : 'log in'}
                    </button>
                </form>

                <p>
                    no account? <Link to="/signup">sign up</Link>
                </p>


            </div>
        </div>
    );
};

export default LoginPage;