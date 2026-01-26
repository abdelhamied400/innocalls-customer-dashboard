export type BreakType = {
  id: string;
  nameAR: string;
  nameEN: string;
  isDeleted: boolean;
};

export type CreateBreakTypePayload = {
  nameAR: string;
  nameEN: string;
};

export type UpdateBreakTypePayload = {
  nameAR: string;
  nameEN: string;
};
