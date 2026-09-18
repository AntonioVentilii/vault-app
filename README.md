<h1 align="left">
  <a href="https://sovault.app/">
    <img src="https://github.com/antonioventilii/vault-app/raw/main/static/logo/vault-icon.webp"
         width="40"
         style="vertical-align: middle;" />
  </a>
  <span style="vertical-align: middle;">SoVault App</span>
</h1>

[![GitHub Checks Workflow Status](https://img.shields.io/github/actions/workflow/status/AntonioVentilii/vault-app/checks.yml?logo=github&label=Checks)](https://github.com/AntonioVentilii/vault-app/actions/workflows/checks.yml)
[![GitHub Deploy Workflow Status](https://img.shields.io/github/actions/workflow/status/AntonioVentilii/vault-app/deploy.yml?logo=github&label=Deploy)](https://github.com/AntonioVentilii/vault-app/actions/workflows/deploy.yml)

Welcome to **SoVault App**, the official frontend application for [SoVault Core](https://github.com/AntonioVentilii/vault-core) — a high-performance, pay-as-you-go sharded file storage system built on the Internet Computer (ICP).

🌍 **Main Domain**: [sovault.app](https://sovault.app/)  
🛠️ **Canister App**: [https://z6kq3-iqaaa-aaaal-asxhq-cai.icp0.io/](https://z6kq3-iqaaa-aaaal-asxhq-cai.icp0.io/)

## 📖 What is this?

**SoVault (_Sovereign Vault_) App** is the sleek, modern, user-facing interface for the **SoVault Core** library. It provides an intuitive experience for users to securely store, manage, and share their files on the Internet Computer.

The application is built using **SvelteKit** and integrates directly with the **SoVault Core** canisters. It transparently handles complex operations for the user:

- **Authentication**: Secure, seamless sign-in using Internet Identity, Passkey, or Google (_coming soon_).
- **File Uploading & Chunking**: Slicing large files into manageable chunks (1MB each) locally in the browser and uploading them concurrently to storage buckets.
- **Permissions & Access**: Managing ICRC-2 token approvals (ICP/ckUSDC) for **SoVault Core**'s scalable "Pay-As-You-Go" storage model.
- **Downloading & Reassembly**: Retrieving download plans, parallel fetching of chunks across buckets, and reconstructing the original file efficiently.
- **Granular Sharing**: Easy generation of public links and managing Access Control Lists (ACLs).

## 🔗 Integration Details

This frontend was built by more or less strictly following the principles outlined in the [**SoVault Core** Integration Guide](https://github.com/AntonioVentilii/vault-core/blob/main/INTEGRATION_GUIDE.md).

While the fundamental protocol logic (initiation, concurrent chunking, ICP/ckUSDC approvals, completion, and retrieval) remains identical, a few custom architecture adjustments were implemented to fit seamlessly with our SvelteKit application. These adjustments mostly focus on optimising concurrent token approvals, managing store dependencies efficiently, and enriching UI/UX with smooth upload progress tracking.

## 🛠️ Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Integration**: `@dfinity/agent`, `@icp-sdk/canisters`, `@icp-sdk/auth`
- **Language**: TypeScript

## 🚀 Getting Started Locally

### Prerequisites

- Node.js (see `.node-version` file for recommended version)
- `npm`

### Installation

Install the dependencies:

```bash
npm ci
```

### Running the App

Start the development server:

```bash
npm run dev
```

### Running against a local replica

To serve the app the way it is served in production:

```bash
npx icp network start -d
npm run deploy:local
npx icp network stop
```

The local gateway is on port 5987, which is what the app already expects
locally. `icp` and `ic-wasm` are devDependencies, so `npm ci` installs them —
there is no separate toolchain to set up.

## 🚀 Deploy

```bash
npm run deploy
```

That runs `icp deploy -e ic frontend`, building the site and uploading `build/`
to `z6kq3-iqaaa-aaaal-asxhq-cai` — the same canister as before, now running the
standard asset canister wasm instead of Juno's satellite. The name is mapped to
that ID in [`.icp/data/mappings/ic.ids.json`](./.icp/data/mappings/ic.ids.json),
which is committed on purpose: losing it loses the mapping.

Headers, caching and the content security policy come from
[`static/.ic-assets.json5`](./static/.ic-assets.json5). It must live in
`static/` so `adapter-static` copies it into `build/` — icp-cli only reads it
from the directory it uploads.

> **`static/.well-known/ic-domains` keeps `sovault.app` working.** The boundary
> nodes read that file to validate the custom domain against this canister.
> Delete it and the domain stops resolving here.

CI deploys on every push to `main` via
[`deploy.yml`](./.github/workflows/deploy.yml), using a `DEPLOY_PEM` repository
secret. The principal behind it needs the canister's `Commit` permission:

```bash
npx icp canister call frontend grant_permission \
  '(record { to_principal = principal "<principal>"; permission = variant { Commit } })' -e ic
```

Prefer that over adding a controller: a controller can replace the wasm or
delete the canister, whereas `Commit` only allows publishing assets.

## 🤝 Contributing

Since this repository is strictly the frontend component of **SoVault Core**, any backend issues, canister bugs, or core architecture contributions should be directed to the [**SoVault Core** Repository](https://github.com/AntonioVentilii/vault-core).

However, any UI/UX improvements, frontend optimisations, or integration enhancements for the **SoVault App** are very welcome here! Please open issues and/or submit pull requests with your contributions.

## 🙏 Acknowledgements & Credits

A massive thank you to the [Juno](https://juno.build/) project.

The baseline of this entire application was initialised via the Juno CLI and templates. The app has since moved off Juno entirely — its own auth, and a standard asset canister for hosting — but the debt is real. Furthermore, several core service integrations, utility scripts, components, and architectural conventions in the **SoVault App** were directly inspired by or derived from the Juno open-source repositories. We are deeply grateful for their robust tooling and ecosystem!

---

_Built with ❤️ on the Internet Computer._
