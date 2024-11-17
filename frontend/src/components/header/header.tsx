import { HeaderActionButton } from "./headerActionButton";
import { Logo } from "./logo";
import { TitleAndSubmission } from "./titleAndSubmission";

const shouldShowActionButton = (pathName: string) => {
  return pathName !== "/join";
};

export const Header = () => {
  return (
    <header id="header" className="flex align-center">
      <Logo />
      <TitleAndSubmission />
      {shouldShowActionButton(location.pathname) ? (
        <HeaderActionButton />
      ) : (
        ""
      )}
    </header>
  );
};