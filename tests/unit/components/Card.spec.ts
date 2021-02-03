import Vue from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";

import Card from "@/components/Card.vue";
import DynamicContent from "@/store/DynamicContent";
import { getContent } from "../../data/Content";

Vue.use(Vuetify);
const localVue = createLocalVue();

describe("Card.vue", () => {
  let vuetify: any;

  beforeEach(async (done) => {
    await DynamicContent.initialize();
    vuetify = new Vuetify();
    done();
  });

  describe("Classes", () => {
    it("Should have is-last class if card is last item", () => {
      const wrapper = mount(Card, {
        localVue,
        vuetify,
        propsData: {
          value: DynamicContent.model[1],
        },
      });
      expect(wrapper.find(".v-card").classes()).toContain("is-last");
    });
    it("Should have is-edit class is editing", () => {
      DynamicContent.model[0].contentItem = getContent();
      DynamicContent.model[0].path = ["root"];
      const wrapper = mount(Card, {
        localVue,
        vuetify,
        propsData: {
          value: DynamicContent.model[0],
        },
      });
      expect(wrapper.find(".v-card").classes()).toContain("is-edit");
    });
    it("Should have is-new class if card is empty", () => {
      const wrapper = mount(Card, {
        localVue,
        vuetify,
        propsData: {
          value: DynamicContent.model[0],
        },
      });
      expect(wrapper.find(".v-card").classes()).toContain("is-new");
    });
  });
  describe("Edit mode", () => {
    it("Should display card image and label", async () => {
      DynamicContent.model[0].contentItem = getContent();
      DynamicContent.model[0].path = ["root"];
      //@ts-ignore
      DynamicContent.model[0].contentItem.label = "Test";
      const wrapper = mount(Card, {
        localVue,
        vuetify,
        propsData: {
          value: DynamicContent.model[0],
        },
      });
      await flushPromises();
      expect(wrapper.find(".card__image").exists()).toBe(true);
      expect(wrapper.find("h3").text()).toBe(
        //@ts-ignore
        wrapper.vm.value.contentItem.label
      );
    });
  });
  describe("Card count", () => {
    it("Should show card count", () => {
      DynamicContent.model[0].contentItem = getContent();
      DynamicContent.model[0].path = ["root"];
      const wrapper = mount(Card, {
        localVue,
        vuetify,
        propsData: {
          value: DynamicContent.model[0],
        },
      });

      expect(wrapper.find(".card__count").text()).toBe(
        (DynamicContent.model[0].index + 1).toString()
      );
    });
  });
  describe("Actions", () => {
    it("Should open browser", async () => {
      const wrapper = mount(Card, {
        localVue,
        vuetify,
        propsData: {
          value: DynamicContent.model[0],
        },
      });
      await wrapper.find(".Add-btn").trigger("click");
      expect(DynamicContent.panelOpen).toBe(true);
    });
    it("Should remove item", async () => {
      DynamicContent.model[0].contentItem = getContent();
      DynamicContent.model[0].path = ["root"];
      const wrapper = mount(Card, {
        localVue,
        vuetify,
        propsData: {
          value: DynamicContent.model[0],
        },
      });
      await wrapper.find(".Remove-btn").trigger("click");
      await flushPromises();

      expect(DynamicContent.model[0].isEmpty()).toEqual(true);
    });
  });
});
