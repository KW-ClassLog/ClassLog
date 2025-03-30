export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <body className="student-body">{children}</body>;
}
