import { SDK, init, Params } from "dc-extensions-sdk";
import { DynamicContent, ContentItem } from "dc-management-sdk-js";
import { action, computed, observable } from "mobx";

import {
  always,
  equals,
  flatten,
  ifElse,
  invoker,
  is,
  isNil,
  length,
  map,
  path,
  pathEq,
  pipe,
  reject,
  subtract,
} from "ramda";
import { CardModel, EmptyItem } from "./CardModel";
import { ErrorModel, ERROR_TYPE, NodeError, NODE_ERRORS } from "./Errors";
import { ContentItemModel, FieldModel } from "./FieldModel";

export enum CardType {
  CHIP = "chip",
  LARGE = "large",
  SMALL = "small",
}

type ExtensionParams = Params & {
  instance: {
    nodeId: string;
    type: CardType;
  };
};

export type DcExtension = SDK<any, ExtensionParams>;
export class Store {
  @observable dcExtensionSdk!: DcExtension;

  @observable dcManagementSdk!: DynamicContent;

  @observable rootNode!: ContentItem;

  @observable model: Array<CardModel> = [new CardModel(undefined, 0)];

  @observable isReadOnly: Boolean = false;

  @observable panelOpen: Boolean = false;

  @observable error: null | ErrorModel = null;

  @observable loading: Boolean = true;

  @computed get maxItems(): number {
    return (
      path(["field", "schema", "maxItems"], this.dcExtensionSdk) ||
      Number.MAX_SAFE_INTEGER
    );
  }

  @computed get minItems(): number {
    return path(["field", "schema", "minItems"], this.dcExtensionSdk) || 0;
  }

  @computed get remainingItems(): number {
    const isEmpty = pathEq(["contentItem", "_empty"], true);
    //@ts-ignore
    return pipe(reject(isEmpty), length, subtract(this.maxItems))(this.model);
  }

  @computed get title(): string {
    return path(["field", "schema", "title"], this.dcExtensionSdk) || "";
  }

  @computed get cardType() {
    return (this.params.type || CardType.LARGE).toLowerCase();
  }

  @computed get params(): ExtensionParams["instance"] {
    return (
      path(["params", "instance"], this.dcExtensionSdk) ||
      ({} as ExtensionParams["instance"])
    );
  }

  @computed
  public get listModel() {
    return this.model;
  }

  @computed
  public get allowedTypes(): string[] {
    // @ts-ignore
    return pipe(
      //@ts-ignore
      path(["field", "schema", "items", "allOf"]),
      map(path(["properties", "contentType", "enum"])),
      flatten,
      reject(isNil)
      //@ts-ignore
    )(this.dcExtensionSdk);
  }

  public set listModel(value: Array<CardModel>) {
    this.updateList(value).catch(() => {
      console.info("Invalid model value");
    });
  }

  async initialize() {
    try {
      const dcExtensionSdk = await init<any, ExtensionParams>();
      const dcManagementSdk = new DynamicContent({}, {}, dcExtensionSdk.client);

      this.setDynamicContent(dcManagementSdk, dcExtensionSdk);

      const [model, node] = await Promise.all([
        this.getValue(),
        this.getNode(),
      ]);

      this.setValue(model);

      if (node) {
        this.setRootNode(node);
      }

      this.setReadOnly(this.dcExtensionSdk.form.readOnly);

      this.dcExtensionSdk.frame.startAutoResizer();
      this.dcExtensionSdk.form.onReadOnlyChange((readonly) =>
        this.setReadOnly(readonly)
      );
    } catch (error) {
      this.setError(error);
      console.info("Failed to initialize", error);
    } finally {
      this.setLoading(false);
    }
  }

  async getValue() {
    try {
      const value: ContentItemModel[] = await this.dcExtensionSdk.field.getValue();

      const withLabel = await Promise.all(
        value.map(async (item) => {
          if (item.id) {
            const { label } = await this.dcManagementSdk.contentItems.get(
              item.id
            );

            item.label = label;
          }

          return item;
        })
      );

      return this.createModel(withLabel);
    } catch (err) {
      console.info("Unable to get field value");
      return this.model;
    }
  }

  async updateList(model: Array<CardModel>) {
    const updated = model.map(
      (value, index) => new CardModel(value.contentItem, index, value.path)
    );
    this.setValue(updated);

    const value = this.exportModel();

    if (equals(value, await this.dcExtensionSdk.field.getValue())) {
      return;
    }

    await this.dcExtensionSdk.field.setValue(value);
  }

  async getNode() {
    try {
      const nodeId = this.getNodeId();

      if (!nodeId) {
        throw new Error(ERROR_TYPE.CANNOT_BE_FOUND);
      }

      const node = await this.dcManagementSdk.contentItems.get(nodeId);

      if ((node.status as any) === "ARCHIVED") {
        throw new Error(ERROR_TYPE.ARCHIVED);
      }

      if (!node.hierarchy) {
        throw new Error(ERROR_TYPE.NOT_HIERARCHY);
      }

      if (!node.hierarchy?.root) {
        throw new Error(ERROR_TYPE.NOT_ROOT);
      }

      return node;
    } catch (err) {
      this.setError(err);
    }
  }

  async removeItem(index: number) {
    const updated = this.model
      .filter((value, i) => {
        if ((value.contentItem as EmptyItem)._empty) {
          return false;
        }
        return index !== i;
      })
      .filter(Boolean)
      .map((value) => value.export());

    const model = await this.createModel(updated);

    try {
      await this.updateList(model);
    } catch (err) {
      console.info("Invalid model value");
    }
  }

  @action.bound setLoading(loading: Boolean) {
    this.loading = loading;
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

  @action.bound togglePanel() {
    this.panelOpen = !this.panelOpen;
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

  async createModel(value: Array<ContentItemModel | EmptyItem>) {
    const minItems = this.minItems;
    const maxItems = this.maxItems;

    const model = await FieldModel.getDefaultValue(value, {
      minItems,
      maxItems,
    });

    return model;
  }

  exportModel(model?: CardModel[]) {
    return this.clean((model || this.model).map((card) => card.toJSON()));
  }

  clean(model: Array<ContentItemModel | EmptyItem>) {
    const length = model.length;
    const last = model[length - 1];

    if ((last as EmptyItem)._empty) {
      const value = [...model];

      value.pop();

      return value;
    }

    return model;
  }

  getNodeId(): string | undefined {
    return this.params.nodeId;
  }

  getItemRef(): string {
    return (
      path(
        ["field", "schema", "items", "allOf", 0, "$ref"],
        this.dcExtensionSdk
      ) || ""
    );
  }

  hasHitLimit(selected: any[]) {
    const model = this.model.filter((item) => !this.isEmpty(item));

    return selected.length + model.length >= this.maxItems;
  }

  setComponentHeight(height: number): void {
    this.dcExtensionSdk.frame.setHeight(height);
  }

  autoSizeComponent(shouldAutosize: boolean): void {
    ifElse(
      always(shouldAutosize),
      invoker(0, "startAutoResizer"),
      invoker(0, "stopAutoResizer")
    )(this.dcExtensionSdk.frame);
  }
}

export default new Store();
