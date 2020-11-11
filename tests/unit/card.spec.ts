import { expect } from "chai";
import { mount, createLocalVue } from "@vue/test-utils";
import Card from "@/components/Card.vue";
import Vuetify from "vuetify/lib";
import { CardModel } from "@/store/CardModel";

describe("Card.vue", () => {
  let vuetify: any;
  const localVue = createLocalVue();

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("smoke screen", () => {
    const wrapper = mount(Card, {
      propsData: {
        value: new CardModel(CardModel.createEmptyItem(), 0),
      },
      localVue,
      vuetify,
    });

    expect(wrapper.find(".v-card")).to.exist;
  });
});
