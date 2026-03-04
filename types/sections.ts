export interface BaseProps {
  visibleSections: Set<string>;
}

export interface HeaderProps {
  lang: string;
}

export interface HeroProps {
  lang: string;
}

export interface AboutProps extends BaseProps {}

export interface ServicesProps extends BaseProps {}

export interface WorkProps extends BaseProps {}

export interface ProcessProps extends BaseProps {}

export interface FaqProps extends BaseProps {}

export interface CtaProps extends BaseProps {}

export interface FooterProps {
  lang: string;
}
