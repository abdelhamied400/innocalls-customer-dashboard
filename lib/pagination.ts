/**
 * Default Pages to Show
 *
 * @type {number}
 */
export const defaultPagesToShow: number = 4;

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
  const pagesAroundCurrent = Math.floor(defaultPagesToShow / 2); // Number of pages to show around the current page
  const startPage = Math.max(3, pageIndex - pagesAroundCurrent + 1);
  const endPage = Math.min(pagesCount - 2, pageIndex + pagesAroundCurrent + 1);
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
