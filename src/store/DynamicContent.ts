import { SDK, init, Params } from "dc-extensions-sdk";
import { DynamicContent, OAuth2ClientCredentials } from "dc-management-sdk-js";
import { action, computed, observable } from "mobx";

interface ExtensionParams {
  instance: {
    nodeId: string;
  };
}
export class Store {
  @observable dcExtensionSdk!: SDK<any, Params & ExtensionParams>;
  @observable dcManagementSdk!: DynamicContent;

  @observable model: Array<any> = [];

  constructor() {
    this.initialize();
  }

  @computed
  get loading() {
    return !this.dcExtensionSdk || !this.dcManagementSdk;
  }

  @action.bound async initialize() {
    try {
      this.dcExtensionSdk = await init();
      this.dcManagementSdk = new DynamicContent(
        {} as OAuth2ClientCredentials,
        {},
        this.dcExtensionSdk.client
      );

      this.getValue();

      this.dcExtensionSdk.frame.startAutoResizer();
    } catch (error) {
      console.info("Failed to initialize");
    }
  }

  @action.bound async getValue() {
    try {
      this.model = await this.dcExtensionSdk.field.getValue();
    } catch (err) {
      console.info("Unable to get field value");
    }

    return this.model;
  }

  @action.bound async fetchNode() {
    const nodeId = this.dcExtensionSdk.params.instance.nodeId;

    return this.dcManagementSdk.contentItems.get(nodeId);
  }
}

export default new Store();
