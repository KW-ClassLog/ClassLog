export default function NonLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className="non-login-body">
      <div className="content">{children}</div>
    </body>
  );
}
