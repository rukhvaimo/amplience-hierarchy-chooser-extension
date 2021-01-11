import { mount, createLocalVue } from "@vue/test-utils";
import Card from "@/components/Card.vue";
import { CardModel } from "@/store/CardModel";

describe("Card.vue", () => {
  let vuetify: any;
  const localVue = createLocalVue();

  // it("smoke screen", () => {
  //   const wrapper = mount(Card, {
  //     propsData: {
  //       value: new CardModel(CardModel.createEmptyItem(), 0),
  //     },
  //     localVue,
  //     vuetify,
  //   });

  //   expect(wrapper.find(".v-card")).not.toBeNull;
  // });
});
