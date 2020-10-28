import mock from "./mock";
import { SDK, init, Params } from "dc-extensions-sdk";
import { DynamicContent, ContentItem } from "dc-management-sdk-js";
import { action, computed, observable } from "mobx";

import { path } from "rambda";
import { CardModel, EmptyItem } from "./CardModel";
import { FieldModel } from "./FieldModel";

interface ExtensionParams {
  instance: {
    nodeId: string;
    dcConfig?: string;
  };
}

export interface ContentItemModel {
  _meta: {
    schema: string;
  };
  id: string;
  contentType: string;
}
export class Store {
  @observable dcExtensionSdk!: SDK<any, Params & ExtensionParams>;
  @observable dcManagementSdk!: DynamicContent;
  @observable rootNode!: ContentItem;

  @observable model: Array<CardModel> = [new CardModel(undefined, 0)];

  @observable isReadOnly: Boolean = false;
  @observable panelOpen: Boolean = false;
  @observable activeCard: number | null = null;

  @computed
  get loading() {
    return !this.dcExtensionSdk || !this.dcManagementSdk;
  }

  @computed
  public get listModel() {
    return this.model;
  }

  public set listModel(value: Array<CardModel>) {
    this.updateList(value);
  }

  @action.bound async initialize() {
    try {
      this.dcExtensionSdk = await init();
      this.dcManagementSdk = new DynamicContent(
        {} as any,
        {},
        this.dcExtensionSdk.client
      );

      await Promise.all([this.getValue(), this.getNode()]);

      this.isReadOnly = this.dcExtensionSdk.form.readOnly;

      this.dcExtensionSdk.frame.startAutoResizer();
      this.dcExtensionSdk.form.onReadOnlyChange((readonly) => {
        this.isReadOnly = readonly;
      });
    } catch (error) {
      console.info("Failed to initialize", error);
    }
  }

  @action.bound togglePanel(index: number | null = null) {
    this.panelOpen = !this.panelOpen;
    this.activeCard = this.panelOpen ? index : null;
  }

  @action.bound async getValue() {
    try {
      const value: ContentItemModel[] = await this.dcExtensionSdk.field.getValue();
      const minItems = this.minItems;
      const maxItems = this.maxItems;

      const model = await FieldModel.getDefaultValue(mock as any, {
        minItems,
        maxItems,
      });

      this.model = model;
    } catch (err) {
      console.info("Unable to get field value");
    }

    return this.model;
  }

  @action.bound async updateList(model: Array<CardModel>) {
    this.model = model.map(
      (value, index) =>
        new CardModel(value.contentItem, index, value.path.split("/"))
    );

    await this.dcExtensionSdk.field.setValue(this.model);
  }

  @action.bound async getNode() {
    const nodeId = this.getNodeId();

    if (!nodeId) {
      throw new Error("No NodeId supplied to extension");
    }

    this.rootNode = await this.dcManagementSdk.contentItems.get(nodeId);

    return this.rootNode;
  }

  @action.bound async addItem(node: any) {
    const schema = this.getItemRef();

    if (!schema) {
      throw new Error("Schema is not set up for a List");
    }

    const contentItem = Object.assign(
      {},
      {
        id: node.id,
        label: node.label,
        contentType: node.contentTypeUri,
        _meta: {
          schema,
        },
      }
    );

    this.model.push(new CardModel(contentItem, this.model.length));

    await this.dcExtensionSdk.field.setValue(this.model);
  }

  @action.bound async removeItem(node: any) {
    const model = this.model.filter((value) => {
      if ((value.contentItem as EmptyItem)._empty) {
        return true;
      }
      return node.id !== (value.contentItem as ContentItemModel).id;
    });

    if (!model.length) {
      this.model.push(
        new CardModel(CardModel.createEmptyItem(), this.model.length)
      );
    }

    this.model = model;

    await this.dcExtensionSdk.field.setValue(this.model);
  }

  @action.bound
  isLast(item: CardModel) {
    return this.model.length === item.index + 1;
  }

  @action.bound isEmpty(item: CardModel) {
    return Boolean((item.contentItem as EmptyItem)._empty);
  }

  @computed get maxItems(): number {
    return (
      path(["field", "schema", "maxItems"], this.dcExtensionSdk) ||
      Number.MAX_SAFE_INTEGER
    );
  }

  @computed get minItems(): number {
    return path(["field", "schema", "minItems"], this.dcExtensionSdk) || 0;
  }

  @computed get title(): string {
    return path(["field", "schema", "title"], this.dcExtensionSdk) || "";
  }

  private getNodeId(): string | undefined {
    return path(["params", "instance", "nodeId"], this.dcExtensionSdk);
  }

  private getItemRef(): string | undefined {
    return path(
      ["field", "schema", "items", "allOf", 0, "$ref"],
      this.dcExtensionSdk
    );
  }
}

export default new Store();
