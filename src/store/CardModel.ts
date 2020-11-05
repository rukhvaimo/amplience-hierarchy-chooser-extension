import { ContentItemModel } from "./DynamicContent";

import store from "./DynamicContent";

export interface EmptyItem {
  _empty: boolean;
}

export class CardModel {
  ACTIONS = {
    EXISTING: [
      {
        label: "remove",
        icon: "mdi-delete-outline",
        action: () => {
          store.removeItem(this.contentItem);
        },
      },
    ],
    NEW: [
      {
        label: "add",
        icon: "mdi-plus",
        action: () => {
          store.togglePanel(this.index);
        },
      },
    ],
  };

  static createEmptyItem(): EmptyItem {
    return Object.assign({}, { _empty: true });
  }

  constructor(
    public contentItem:
      | ContentItemModel
      | EmptyItem = CardModel.createEmptyItem(),
    public index: number,
    public path: Array<string> = []
  ) {}

  get actions() {
    return this.contentItem && this.isEmpty()
      ? this.ACTIONS.NEW
      : this.ACTIONS.EXISTING;
  }

  isEmpty() {
    return (this.contentItem as EmptyItem)._empty;
  }

  toJSON() {
    if (this.isEmpty()) {
      return this.contentItem;
    }

    const { id, contentType } = this.contentItem as ContentItemModel;

    return {
      id,
      contentType,
      _meta: {
        schema: store.getItemRef(),
      },
    };
  }
}
