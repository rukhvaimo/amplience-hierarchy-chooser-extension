import Vue from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";
import { when } from "mobx";

import DynamicContent from "@/store/DynamicContent";
import TreeView from "@/components/TreeView/TreeView.vue";
import TreeStore from "@/store/Tree";

Vue.use(Vuetify);
const localVue = createLocalVue();

describe("TreeView.vue", () => {
  let vuetify: any;

  beforeEach(async (done) => {
    await DynamicContent.initialize();
    vuetify = new Vuetify();
    done();
  });

  it("Should load nodes", async () => {
    const wrapper = mount(TreeView, {
      localVue,
      vuetify,
    });
    await flushPromises();
    await when(() => TreeStore.treeLoaded === true);
    expect(TreeStore.visibleNodes.length > 0).toBe(true);
  });
});
