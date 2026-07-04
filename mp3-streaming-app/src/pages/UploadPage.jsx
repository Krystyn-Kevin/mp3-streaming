import { useNavigate } from "react-router-dom";
import UploadForm from "../components/upload/UploadForm";

export default function UploadPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-xl">
      <div className="glass-panel rounded-lg p-6">
        <h2 className="mb-1 font-display text-lg font-semibold">Add a song</h2>
        <p className="mb-5 text-sm text-text-tertiary">
          Upload an audio file and it'll appear in everyone's library right away.
        </p>
        <UploadForm onUploaded={() => setTimeout(() => navigate("/library"), 1400)} />
      </div>
    </div>
  );
}
