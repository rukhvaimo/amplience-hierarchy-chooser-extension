import { CardModel, EmptyItem } from "./CardModel";
import store from "./DynamicContent";

export interface ContentItemModel {
  _meta: {
    schema: string;
  };
  id: string;
  contentType: string;
}

export class FieldModel {
  static async getDefaultValue(
    value: Array<ContentItemModel | EmptyItem>,
    { minItems, maxItems }: { minItems: number; maxItems: number }
  ) {
    const createItem = async (
      value: ContentItemModel | EmptyItem | undefined,
      index: number
    ) => {
      if (value && (value as ContentItemModel).id) {
        const parents = await store.dcManagementSdk.hierarchies.parents.get(
          (value as ContentItemModel).id
        );
        const path = parents.parents.map((parent) => parent.label);

        return new CardModel(value, index, path);
      }

      return new CardModel(value, index);
    };

    const createModel = async () => {
      if (!value.length) {
        return Promise.all(
          Array.from<undefined>({ length: minItems }).map(createItem)
        );
      }

      if (minItems && value.length < minItems) {
        return Promise.all(
          [value, Array.from<undefined>({ length: minItems - value.length })]
            .flat()
            .map(createItem)
        );
      }

      return Promise.all(value.map(createItem));
    };

    const model = await createModel();

    if (!maxItems || maxItems > model.length || !model.length) {
      model.push(new CardModel(CardModel.createEmptyItem(), model.length));
    }

    return model;
  }
}
