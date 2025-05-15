/**
 * Default Pages to Show
 *
 * @type {number}
 */
export const defaultPagesToShow: number = 2;

/**
 * Generates Pages Array
 *
 * @param {number} pageIndex
 * @param {number} pagesCount
 * @returns {number[]}
 */
export const generatePagesArray = (
  pageIndex: number,
  pagesCount: number
): number[] => {
  const currentPage = pageIndex + 1;
  const pagesAroundCurrent = Math.floor(defaultPagesToShow / 2);

  const startPage = Math.max(3, currentPage - pagesAroundCurrent);
  const endPage = Math.min(pagesCount - 2, currentPage + pagesAroundCurrent);

  const otherPages = [...Array(endPage - startPage + 1)].map(
    (_, index) => startPage + index
  );

  return otherPages;
};

export const shouldAddPreEllipses = (pageIndex: number) => {
  return pageIndex > defaultPagesToShow;
};

export const shouldAddPostEllipses = (
  pageIndex: number,
  pagesCount: number
) => {
  return pageIndex < pagesCount - defaultPagesToShow - 1;
};
