/**
 * Represents a ColList item.
 * No matter what the ColList renders, each element must have at least these attributs
 */
export interface Item {
  _id: string;
  isSelected: boolean;
}
