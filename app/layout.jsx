export const metadata = {
  title: 'Proxmox AI Chat',
  description: 'Chat interface for Proxmox AI agent',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
