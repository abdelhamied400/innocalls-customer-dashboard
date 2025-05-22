export type Paginated<T> = {
  data: T[];
  current_page: number;
  from: number;
  last_page: number;
  page: number;
  per_page: number;
  to: number;
  total: number;
};
