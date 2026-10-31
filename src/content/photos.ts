/**
 * Fotografias institucionais REAIS da CredFlex.
 * Para publicar uma foto: salve o arquivo em `public/images/institucional/`
 * e preencha o caminho abaixo (ex.: "/images/institucional/fachada.jpg").
 * Enquanto for `null`, o espaço exibe um painel da marca (sem foto fictícia).
 */
export interface Photo {
  src: string | null;
  alt: string;
  /** Especificação para a equipe da CredFlex. */
  brief: string;
  /** Ponto focal do recorte (CSS object-position). */
  focus?: string;
}

export const photos = {
  fachada: {
    src: null,
    alt: "Fachada do escritório da CredFlex na Rua Fernando Costa, 495, em Osvaldo Cruz/SP",
    brief: "Fachada do escritório com a marca visível. Horizontal, luz natural, mín. 2000 px.",
    focus: "50% 45%",
  },
  atendimento: {
    src: null,
    alt: "Equipe da CredFlex atendendo um cliente no escritório",
    brief: "Atendimento real no escritório (equipe + cliente com autorização de imagem). Mín. 1600 px.",
  },
  equipe: {
    src: null,
    alt: "Equipe da CredFlex reunida no escritório",
    brief: "Foto de equipe real, horizontal 3:2, com autorização de imagem de cada pessoa.",
  },
} satisfies Record<string, Photo>;
