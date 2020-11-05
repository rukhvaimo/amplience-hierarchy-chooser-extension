import { SDK, init, Params } from "dc-extensions-sdk";
import { DynamicContent, ContentItem, Status } from "dc-management-sdk-js";
import { action, computed, observable } from "mobx";

import { path } from "ramda";
import { CardModel, EmptyItem } from "./CardModel";
import { ErrorModel, ERROR_TYPE, NodeError, NODE_ERRORS } from "./Errors";
import { FieldModel } from "./FieldModel";

type ExtensionParams = Params & {
  instance: {
    nodeId: string;
    dcConfig?: string;
  };
};

export interface ContentItemModel {
  _meta: {
    schema: string;
  };
  id: string;
  contentType: string;
}

export type DcExtension = SDK<any, ExtensionParams>;
export class Store {
  @observable dcExtensionSdk!: DcExtension;

  @observable dcManagementSdk!: DynamicContent;

  @observable rootNode!: ContentItem;

  @observable model: Array<CardModel> = [new CardModel(undefined, 0)];

  @observable isReadOnly: Boolean = false;

  @observable panelOpen: Boolean = false;

  @observable activeCard: number | null = null;

  @observable error: null | ErrorModel = null;

  @computed get loading() {
    return !this.dcExtensionSdk || !this.dcManagementSdk;
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

  @computed
  public get listModel() {
    return this.model;
  }

  public set listModel(value: Array<CardModel>) {
    this.updateList(value);
  }

  async initialize() {
    try {
      const dcExtensionSdk = await init<any, ExtensionParams>();
      const dcManagementSdk = new DynamicContent(
        {} as any,
        {},
        dcExtensionSdk.client
      );

      this.setDynamicContent(dcManagementSdk, dcExtensionSdk);

      const [model, node] = await Promise.all([
        this.getValue(),
        this.getNode(),
      ]);

      this.setValue(model);
      this.setRootNode(node);
      this.setReadOnly(this.dcExtensionSdk.form.readOnly);

      this.dcExtensionSdk.frame.startAutoResizer();
      this.dcExtensionSdk.form.onReadOnlyChange((readonly) =>
        this.setReadOnly(readonly)
      );
    } catch (error) {
      this.setError(error);
      console.info("Failed to initialize", error);
    }
  }

  async getValue() {
    try {
      const value: ContentItemModel[] = await this.dcExtensionSdk.field.getValue();
      const minItems = this.minItems;
      const maxItems = this.maxItems;

      const model = await FieldModel.getDefaultValue(value, {
        minItems,
        maxItems,
      });

      return model;
    } catch (err) {
      console.info("Unable to get field value");
      return this.model;
    }
  }

  async updateList(model: Array<CardModel>) {
    this.setValue(
      model.map(
        (value, index) => new CardModel(value.contentItem, index, value.path)
      )
    );

    await this.dcExtensionSdk.field.setValue(this.model);
  }

  async getNode() {
    const nodeId = this.getNodeId();

    if (!nodeId) {
      throw new Error(ERROR_TYPE.CANNOT_BE_FOUND);
    }

    const node = await this.dcManagementSdk.contentItems.get(nodeId);

    if (node.status === Status.DELETED) {
      throw new Error(ERROR_TYPE.ARCHIVED);
    }

    if (!node.hierarchy) {
      throw new Error(ERROR_TYPE.NOT_HIERARCHY);
    }

    if (!node.hierarchy?.root) {
      throw new Error(ERROR_TYPE.NOT_ROOT);
    }

    return node;
  }

  async addItem(node: any) {
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

    this.pushItem(contentItem);

    await this.dcExtensionSdk.field.setValue(this.model);
  }

  async removeItem(node: any) {
    const model = this.model.filter((value) => {
      if ((value.contentItem as EmptyItem)._empty) {
        return true;
      }
      return node.id !== (value.contentItem as ContentItemModel).id;
    });

    if (!model.length) {
      model.push(new CardModel(CardModel.createEmptyItem(), this.model.length));
    }

    await this.updateList(model);
    await this.dcExtensionSdk.field.setValue(model);
  }

  @action.bound setError(err: NodeError) {
    const error = NODE_ERRORS[err.message];

    this.error = error || NODE_ERRORS.CANNOT_BE_FOUND;
  }

  @action.bound setDynamicContent(
    dcManagementSdk: DynamicContent,
    dcExtensionSdk: DcExtension
  ) {
    this.dcExtensionSdk = dcExtensionSdk;
    this.dcManagementSdk = dcManagementSdk;
  }

  @action.bound togglePanel(index: number | null = null) {
    this.panelOpen = !this.panelOpen;
    this.activeCard = this.panelOpen ? index : null;
  }

  @action.bound setValue(model: Array<CardModel>) {
    this.model = model;
  }

  @action.bound setNode(node: ContentItem) {
    this.rootNode = node;
  }

  @action.bound pushItem(contentItem: ContentItemModel | EmptyItem) {
    this.model.push(new CardModel(contentItem, this.model.length));
  }

  @action.bound isLast(item: CardModel) {
    return this.model.length === item.index + 1;
  }

  @action.bound isEmpty(item: CardModel) {
    return Boolean((item.contentItem as EmptyItem)._empty);
  }

  @action.bound setRootNode(node: ContentItem) {
    this.rootNode = node;
  }

  @action.bound setReadOnly(readonly: Boolean) {
    this.isReadOnly = readonly;
  }

  getNodeId(): string | undefined {
    return path(["params", "instance", "nodeId"], this.dcExtensionSdk);
  }

  getItemRef(): string | undefined {
    return path(
      ["field", "schema", "items", "allOf", 0, "$ref"],
      this.dcExtensionSdk
    );
  }
}

export default new Store();
