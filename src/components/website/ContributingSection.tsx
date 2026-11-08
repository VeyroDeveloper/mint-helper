import React from 'react';
import { GitPullRequest, Bug, Sparkles, Code2, ExternalLink } from 'lucide-react';

export const ContributingSection: React.FC = () => {
  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto text-xs">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-100">Contributing to mint-helper</h1>
        <p className="text-xs text-zinc-400">
          How to contribute code, report bugs, translate strings, and submit feature requests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 space-y-2 shadow-sm">
          <Bug className="text-emerald-400" size={20} />
          <h3 className="font-bold text-zinc-100 text-sm">Report a Bug</h3>
          <p className="text-zinc-400 leading-relaxed text-xs">
            Encountered an issue on Linux Mint? Use our structured GitHub issue template to report distribution details and reproduction steps.
          </p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 space-y-2 shadow-sm">
          <Sparkles className="text-emerald-400" size={20} />
          <h3 className="font-bold text-zinc-100 text-sm">Feature Requests</h3>
          <p className="text-zinc-400 leading-relaxed text-xs">
            Suggest applications or configuration improvements that adhere to our zero-telemetry, safety-first philosophy.
          </p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 space-y-2 shadow-sm">
          <GitPullRequest className="text-emerald-400" size={20} />
          <h3 className="font-bold text-zinc-100 text-sm">Submit Pull Requests</h3>
          <p className="text-zinc-400 leading-relaxed text-xs">
            Rust developers and GTK4 designers are invited to submit pull requests. Ensure all tests and clippy checks pass before PR submission.
          </p>
        </div>
      </div>

      {/* Quick development steps */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-zinc-200">Local Development Quickstart</h3>
        <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800 font-mono text-zinc-300 space-y-1.5 text-xs">
          <div className="text-zinc-400"># 1. Clone repository</div>
          <div className="text-emerald-400">git clone https://github.com/linuxmint-community/mint-helper.git</div>
          <div className="text-zinc-400 pt-2"># 2. Build desktop application in Rust</div>
          <div className="text-emerald-400">cd mint-helper/app && cargo test && cargo run</div>
          <div className="text-zinc-400 pt-2"># 3. Format and lint checks</div>
          <div className="text-emerald-400">cargo fmt --check && cargo clippy -- -D warnings</div>
        </div>
      </div>
    </div>
  );
};
