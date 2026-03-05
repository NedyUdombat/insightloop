import { AlertTriangle } from "lucide-react";

export default function SecurityBestPractices() {
  return (
    <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
      <div className="flex gap-3">
        <AlertTriangle
          className="text-yellow-400 flex-shrink-0 mt-0.5"
          size={18}
        />
        <div className="text-sm">
          <p className="font-medium text-yellow-300 mb-1">
            Security Best Practices
          </p>
          <ul className="text-neutral-400 space-y-1 text-xs">
            <li>• Never commit API keys to version control</li>
            <li>• Use environment variables to store keys</li>
            <li>• Rotate keys regularly and after potential exposure</li>
            <li>• Create separate keys for different environments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
