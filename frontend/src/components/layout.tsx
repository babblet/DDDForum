import { Content } from "./content"
import { Header } from "./header/header"

type LayoutProps = {
  children?: React.ReactNode
}
export const Layout = ({ children }: LayoutProps) => (
  <>
    <Header />
    <Content>
      {children}
    </Content>
  </>
)
