import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAuthErrorMessage } from "../../firebase/auth";
import GoogleButton from "./GoogleButton";

export default function LoginForm() {
  const { login, loginGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await loginGoogle();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-text-secondary">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={15} />
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field pl-10"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-text-secondary">
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={15} />
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field pl-10"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && <p className="rounded-md bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary mt-1 w-full justify-center">
        {loading && <Loader2 size={15} className="animate-spin" />}
        Log in
      </button>

      <div className="my-1 flex items-center gap-3 text-xs text-text-tertiary">
        <div className="h-px flex-1 bg-border-subtle" />
        or
        <div className="h-px flex-1 bg-border-subtle" />
      </div>

      <GoogleButton onClick={handleGoogle} disabled={loading} />

      <p className="mt-2 text-center text-xs text-text-tertiary">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-accent hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
