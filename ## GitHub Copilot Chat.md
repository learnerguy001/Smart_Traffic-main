## GitHub Copilot Chat

- Extension Version: 0.22.4 (prod)
- VS Code: vscode/1.95.2
- OS: Mac

## Network

User Settings:
```json
  "github.copilot.advanced": {
    "debug.useElectronFetcher": true,
    "debug.useNodeFetcher": false
  }
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 20.205.243.168 (24 ms)
- DNS ipv6 Lookup: ::ffff:20.205.243.168 (1 ms)
- Electron Fetcher (configured): HTTP 200 (303 ms)
- Node Fetcher: HTTP 200 (266 ms)
- Helix Fetcher: HTTP 200 (363 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.112.21 (13 ms)
- DNS ipv6 Lookup: ::ffff:140.82.112.21 (1 ms)
- Electron Fetcher (configured): HTTP 200 (934 ms)
- Node Fetcher: HTTP 200 (983 ms)
- Helix Fetcher: HTTP 200 (1086 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).
