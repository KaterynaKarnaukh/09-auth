import type { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
// interface PrivateLayoutProps {
//   children: ReactNode;
//   modal?: ReactNode;
// }
 
// export default function PrivateLayout({ children, modal }: PrivateLayoutProps) {
//   return (
//     <>
//       {children}
//       {modal}
//     </>
//   );
// }
 