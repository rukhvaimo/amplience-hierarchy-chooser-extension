import store from "./DynamicContent";
import { ContentItemModel } from "./FieldModel";

export interface EmptyItem {
  _empty: boolean;
}

export class CardModel {
  ACTIONS = {
    EXISTING: [
      {
        label: "Remove",
        icon: "mdi-delete-outline",
        action: () => {
          store.removeItem(this.index);
        },
      },
    ],
    NEW: [
      {
        label: "Add",
        icon: "mdi-plus",
        action: () => {
          store.togglePanel();
        },
      },
    ],
  };

  static createEmptyItem(): EmptyItem {
    return { _empty: true };
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
    return Boolean((this.contentItem as EmptyItem)._empty);
  }

  toJSON(): EmptyItem | ContentItemModel {
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
