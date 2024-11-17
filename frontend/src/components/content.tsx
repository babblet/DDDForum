interface ContentProps {
  children: React.ReactNode
}
export const Content = ({ children }: ContentProps) => (
  <div className='content-container'>
    {children}
  </div>
)